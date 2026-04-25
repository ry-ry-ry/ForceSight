import { useState, useEffect } from 'react';
import { db, useLiveData } from '../database/adapter';
import type { Deployment } from '../database/types';
import { today, daysBetween, getEffectivenessInfo, getEffectivePatch } from '../utils';
import { getConfig, DEFAULT_ECHELONS, AVAILABLE_COUNTRIES } from '../database/config';
import {
    SIZE_SYMBOLS,
    searchNatoSymbols,
    getNatoSymbolDataUrl,
    getNatoSymbolByCode,
    type Affiliation
} from '../nato-symbol-library';

// Get echelons available for a specific country
function getEchelonsForCountry(country: string | undefined): string[] {
    const config = getConfig();
    if (!country) return DEFAULT_ECHELONS;
    return config.countryEchelons?.[country] || DEFAULT_ECHELONS;
}

function inferEchelon(name: string): string {
    const lower = name.toLowerCase();
    if (lower.includes('command')) return 'Command';
    if (lower.includes('corps')) return 'Corps';
    if (lower.includes('division') || lower.includes('div')) return 'Division';
    if (lower.includes('wing') || lower.includes('wg')) return 'Wing';
    if (lower.includes('brigade') || lower.includes('bde')) return 'Brigade';
    if (lower.includes('regiment') || lower.includes('regt')) return 'Regiment';
    if (lower.includes('group') || lower.includes('grp')) return 'Group';
    if (lower.includes('battalion') || lower.includes('bn')) return 'Battalion';
    if (lower.includes('squadron') || lower.includes('sqn')) return 'Squadron';
    if (lower.includes('company') || lower.includes('co')) return 'Company';
    if (lower.includes('platoon') || lower.includes('plt')) return 'Platoon';
    return 'Battalion'; // default
}

export default function UnitForm({ unit, defaults, onDone }: any) {
    const [name, setName] = useState(unit?.name || '');
    const [type, setType] = useState(unit?.type || 'Ground');
    const [echelon, setEchelon] = useState(unit?.echelon || 'Battalion');
    const [country, setCountry] = useState(unit?.country || defaults?.country || '');
    const [status, setStatus] = useState(unit?.status || 'Standby');
    const [rtb, setRtb] = useState(unit?.lastRTBDate || '');

    // Reset echelon to first available when country changes if current echelon isn't valid
    useEffect(() => {
        if (type === 'Base') return; // Bases don't have echelons
        const availableEchelons = getEchelonsForCountry(country);
        if (!availableEchelons.includes(echelon)) {
            setEchelon(availableEchelons[0] || 'Battalion');
        }
    }, [country, echelon, type]);

    const [parentId, setParentId] = useState(unit?.parentId || defaults?.parentId || '');
    const [attached, setAttached] = useState<boolean>(unit?.attached ?? false);
    const [patch, setPatch] = useState(unit?.patch || '');
    const [health, setHealth] = useState<'Healthy' | 'Damaged' | 'Destroyed'>(unit?.health || 'Healthy');
    const [effectiveness, setEffectiveness] = useState<number>(unit?.effectiveness ?? 100);
    const [parentSearch, setParentSearch] = useState('');
    const [showParentDropdown, setShowParentDropdown] = useState(false);
    // NATO symbol fields
    const [natoSymbol, setNatoSymbol] = useState<string>(unit?.natoSymbol || '');
    const [affiliation, setAffiliation] = useState<Affiliation>(unit?.affiliation || 'friendly');
    const [sizeSymbolOverride, setSizeSymbolOverride] = useState<string>(unit?.sizeSymbolOverride || '');
    const [symbolSearch, setSymbolSearch] = useState('');
    const [showSymbolDropdown, setShowSymbolDropdown] = useState(false);
    // Base-specific fields
    const [location, setLocation] = useState(unit?.location || '');
    const [baseId, setBaseId] = useState(unit?.baseId || '');

    const isBase = type === 'Base';

    const allUnits = useLiveData(() => db.units.toArray(), []);

    // Deployments belonging to the currently-selected parent unit
    const parentDeployments = useLiveData(
        () => parentId
            ? db.deployments.where('unitId').equals(parentId).sortBy('startDate')
            : Promise.resolve([] as Deployment[]),
        [parentId]
    );

    // Deployments already belonging to the current unit (edit mode)
    const currentDeployments = useLiveData(
        () => unit?.id
            ? db.deployments.where('unitId').equals(unit.id).sortBy('startDate')
            : Promise.resolve([] as Deployment[]),
        [unit?.id]
    );

    // Which parent deployments to inherit (only relevant when creating)
    const [inheritedDeploymentIds, setInheritedDeploymentIds] = useState<Set<string>>(new Set());

    // Reset inherited selections whenever the parent changes
    useEffect(() => {
        setInheritedDeploymentIds(new Set());
    }, [parentId]);

    const handleToggleInherit = (id: string) => {
        setInheritedDeploymentIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleInheritAll = () => {
        if (!availableParentDeployments.length) return;
        if (inheritedDeploymentIds.size === availableParentDeployments.length) {
            setInheritedDeploymentIds(new Set());
        } else {
            setInheritedDeploymentIds(new Set(availableParentDeployments.map(d => d.id)));
        }
    };

    // Determine which parent deployments are already present on the current unit
    const duplicateParentDeploymentIds = new Set<string>();
    if (parentDeployments && currentDeployments) {
        for (const pd of parentDeployments) {
            const alreadyHas = currentDeployments.some(cd =>
                cd.name === pd.name &&
                cd.operationId === pd.operationId &&
                cd.startDate === pd.startDate
            );
            if (alreadyHas) duplicateParentDeploymentIds.add(pd.id);
        }
    }
    const availableParentDeployments = parentDeployments?.filter(d => !duplicateParentDeploymentIds.has(d.id)) || [];

    useEffect(() => {
        if (!unit && name) {
            setEchelon(inferEchelon(name));
        }
    }, [name, unit]);

    const filteredParents = allUnits?.filter(u =>
        u.id !== unit?.id &&
        u.name.toLowerCase().includes(parentSearch.toLowerCase())
    ) || [];

    const selectedParent = allUnits?.find(u => u.id === parentId);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                // Base photographs should be high quality, unit patches can be smaller
                const maxSize = isBase ? 1200 : 200;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxSize) {
                        height *= maxSize / width;
                        width = maxSize;
                    }
                } else {
                    if (height > maxSize) {
                        width *= maxSize / height;
                        height = maxSize;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);
                setPatch(canvas.toDataURL('image/png'));
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    async function save() {
        try {
            const now = Date.now();
            const unitId = unit?.id || crypto.randomUUID();

            // Warn if user is overriding the deployment-derived status.
            // Reconciliation flips status based on active deployments after any
            // deployment edit, so a manual non-Deployed value here is short-lived
            // if the unit still has open deployments.
            if (!isBase && unit?.id && status !== unit?.status && status !== 'Deployed') {
                const activeDeps = (await db.deployments.where('unitId').equals(unit.id).toArray())
                    .filter(d => !d.endDate);
                if (activeDeps.length > 0) {
                    const ok = confirm(
                        `This unit has ${activeDeps.length} active deployment(s).\n\n` +
                        `Setting status to "${status}" overrides the auto-derived status. ` +
                        `It will revert to "Deployed" the next time a deployment of this unit is saved.\n\n` +
                        `Continue?`
                    );
                    if (!ok) return;
                }
            }

            await db.units.put({
                id: unitId,
                name,
                type,
                echelon: isBase ? undefined : echelon,
                country: country || undefined,
                status: isBase ? 'Active' : status,  // Bases get 'Active' status
                health,
                effectiveness: isBase ? undefined : effectiveness,
                parentId: isBase ? undefined : (parentId || undefined),
                attached: isBase ? undefined : attached,
                taskForceId: unit?.taskForceId || undefined,
                patch: patch || undefined,
                lastRTBDate: rtb || undefined,
                natoSymbol: isBase ? undefined : (natoSymbol || undefined),
                affiliation: isBase ? undefined : (affiliation || undefined),
                sizeSymbolOverride: isBase ? undefined : (sizeSymbolOverride || undefined),
                location: isBase ? (location || undefined) : undefined,
                baseId: isBase ? undefined : (baseId || undefined),
                createdAt: unit?.createdAt || now
            });

            // Inherit selected deployments from parent
            if (parentId && inheritedDeploymentIds.size > 0 && parentDeployments?.length) {
                const toInherit = parentDeployments.filter(d =>
                    inheritedDeploymentIds.has(d.id) && !duplicateParentDeploymentIds.has(d.id)
                );
                if (toInherit.length > 0) {
                    const newDeployments: Deployment[] = toInherit.map(d => ({
                        id: crypto.randomUUID(),
                        unitId,
                        name: d.name,
                        operation: d.operation,
                        operationId: d.operationId,
                        startDate: d.startDate,
                        endDate: d.endDate
                    }));
                    await db.deployments.bulkPut(newDeployments);
                }
            }

            onDone(unitId);
        } catch (err) {
            console.error('Failed to save unit:', err);
            alert('Failed to save unit: ' + (err as Error).message);
        }
    }

    async function remove() {
        if (!unit) return;
        await db.units.delete(unit.id);
        onDone();
    }

    return (
        <div className="card">
            <h2>{unit ? (isBase ? 'Edit Base' : 'Edit Unit') : (isBase ? 'Create Base' : 'Create Unit')}</h2>

            <div style={{ display: 'grid', gap: 16, marginTop: 16 }}>

                <div>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: 14, color: '#9ca3af' }}>
                        {isBase ? 'Base Name' : 'Unit Name'}
                    </label>
                    <input
                        className="input"
                        placeholder={isBase ? 'Enter base name (e.g., Fort Bragg)' : 'Enter unit name'}
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: 6, fontSize: 14, color: '#9ca3af' }}>
                            Type
                        </label>
                        <select
                            className="input"
                            value={type}
                            onChange={e => setType(e.target.value)}
                            style={{ width: '100%' }}
                        >
                            <option>Base</option>
                            <option>Command</option>
                            <option>Ground</option>
                            <option>Air</option>
                            <option>SOF</option>
                            <option>Support</option>
                        </select>
                    </div>

                    {/* Echelon - only for non-Base units */}
                    {!isBase && (
                        <div>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: 14, color: '#9ca3af' }}>
                                Echelon
                            </label>
                            <select
                                className="input"
                                value={echelon}
                                onChange={e => setEchelon(e.target.value)}
                                style={{ width: '100%' }}
                            >
                                {getEchelonsForCountry(country).map(e => (
                                    <option key={e} value={e}>{e}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* Location - only for Bases */}
                {isBase && (
                    <div>
                        <label style={{ display: 'block', marginBottom: 6, fontSize: 14, color: '#9ca3af' }}>
                            Location
                        </label>
                        <input
                            className="input"
                            placeholder="e.g., North Carolina, United States"
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                        />
                    </div>
                )}

                <div>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: 14, color: '#9ca3af' }}>
                        Country
                    </label>
                    <select
                        className="input"
                        value={country}
                        onChange={e => setCountry(e.target.value)}
                        style={{ width: '100%' }}
                    >
                        <option value="">Select country...</option>
                        {AVAILABLE_COUNTRIES.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                {/* Status - only for non-Base units */}
                {!isBase && (
                    <div>
                        <label style={{ display: 'block', marginBottom: 6, fontSize: 14, color: '#9ca3af' }}>
                            Status
                        </label>
                        <select
                            className="input"
                            value={status}
                            onChange={e => setStatus(e.target.value)}
                            style={{ width: '100%' }}
                        >
                            <option>Standby</option>
                            <option>Deployed</option>
                            <option>Training</option>
                            <option>Reset</option>
                        </select>
                    </div>
                )}

                {/* Health - shared by both units and bases */}
                <div style={{ display: 'grid', gridTemplateColumns: !isBase ? '1fr 1fr' : '1fr', gap: 12 }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: 6, fontSize: 14, color: '#9ca3af' }}>
                            Health
                        </label>
                        <select
                            className="input"
                            value={health}
                            onChange={e => setHealth(e.target.value as 'Healthy' | 'Damaged' | 'Destroyed')}
                            style={{ width: '100%' }}
                        >
                            <option>Healthy</option>
                            <option>Damaged</option>
                            <option>Destroyed</option>
                        </select>
                    </div>

                    {/* Effectiveness - only for non-Base units */}
                    {!isBase && (
                        <div>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: 14, color: '#9ca3af' }}>
                                Effectiveness
                            </label>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-sm)'
                            }}>
                                <input
                                    type="range"
                                    min={0}
                                    max={100}
                                    step={10}
                                    value={effectiveness}
                                    onChange={e => setEffectiveness(Number(e.target.value))}
                                    style={{
                                        flex: 1,
                                        accentColor: getEffectivenessInfo(effectiveness).color,
                                        cursor: 'pointer'
                                    }}
                                />
                            <span style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: 13,
                                fontWeight: 600,
                                color: getEffectivenessInfo(effectiveness).color,
                                minWidth: 38,
                                textAlign: 'right'
                            }}>
                                {effectiveness}%
                            </span>
                        </div>
                        <div style={{
                            fontSize: 11,
                            color: getEffectivenessInfo(effectiveness).color,
                            marginTop: 4,
                            fontWeight: 500
                        }}>
                            {getEffectivenessInfo(effectiveness).label}
                        </div>
                    </div>
                    )}
                </div>

                {/* Base assignment - only for non-Base units */}
                {!isBase && (
                    <div>
                        <label style={{ display: 'block', marginBottom: 6, fontSize: 14, color: '#9ca3af' }}>
                            Stationed At (Base)
                        </label>
                        <select
                            className="input"
                            value={baseId}
                            onChange={e => setBaseId(e.target.value)}
                            style={{ width: '100%' }}
                        >
                            <option value="">No base assigned</option>
                            {allUnits?.filter((u: any) => u.type === 'Base').map((b: any) => (
                                <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Parent Unit - only for non-Base units */}
                {!isBase && (
                    <div>
                        <label style={{ display: 'block', marginBottom: 6, fontSize: 14, color: '#9ca3af' }}>
                            Parent Unit
                        </label>
                        <div style={{ position: 'relative' }}>
                            {selectedParent ? (
                            <div
                                onClick={() => {
                                    setParentId('');
                                    setParentSearch('');
                                }}
                                style={{
                                    padding: 'var(--spacing-sm)',
                                    background: 'var(--color-bg-tertiary)',
                                    border: '1px solid var(--color-border-accent)',
                                    borderRadius: 'var(--radius-sm)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--spacing-sm)'
                                }}
                            >
                                {getEffectivePatch(selectedParent, allUnits) && (
                                    <img
                                        src={getEffectivePatch(selectedParent, allUnits)}
                                        alt={selectedParent.name}
                                        style={{
                                            width: 24,
                                            height: 24,
                                            objectFit: 'contain',
                                            borderRadius: 'var(--radius-sm)',
                                            border: '1px solid var(--color-border-accent)'
                                        }}
                                    />
                                )}
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, fontSize: 13 }}>{selectedParent.name}</div>
                                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                                        {selectedParent.echelon || selectedParent.type}
                                    </div>
                                </div>
                                <span style={{ color: 'var(--color-text-muted)', fontSize: 18 }}>×</span>
                            </div>
                        ) : (
                            <>
                                <input
                                    className="input"
                                    placeholder="Search for parent unit..."
                                    value={parentSearch}
                                    onChange={e => {
                                        setParentSearch(e.target.value);
                                        setShowParentDropdown(true);
                                    }}
                                    onFocus={() => setShowParentDropdown(true)}
                                    style={{ width: '100%' }}
                                />
                                {showParentDropdown && filteredParents.length > 0 && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        right: 0,
                                        maxHeight: '250px',
                                        overflowY: 'auto',
                                        background: 'var(--color-bg-secondary)',
                                        border: '1px solid var(--color-border-accent)',
                                        borderRadius: 'var(--radius-sm)',
                                        zIndex: 1000,
                                        marginTop: 'var(--spacing-xs)'
                                    }}>
                                        <div
                                            onClick={() => {
                                                setParentId('');
                                                setShowParentDropdown(false);
                                                setParentSearch('');
                                            }}
                                            style={{
                                                padding: 'var(--spacing-sm)',
                                                cursor: 'pointer',
                                                borderBottom: '1px solid var(--color-border-primary)',
                                                fontSize: 12,
                                                color: 'var(--color-text-muted)'
                                            }}
                                        >
                                            No Parent (Top Level)
                                        </div>
                                        {filteredParents.map(u => (
                                            <div
                                                key={u.id}
                                                onClick={() => {
                                                    setParentId(u.id);
                                                    setShowParentDropdown(false);
                                                    setParentSearch('');
                                                }}
                                                style={{
                                                    padding: 'var(--spacing-sm)',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 'var(--spacing-sm)',
                                                    transition: 'background 0.2s ease'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = 'var(--color-bg-tertiary)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = 'transparent';
                                                }}
                                            >
                                                {getEffectivePatch(u, allUnits) && (
                                                    <img
                                                        src={getEffectivePatch(u, allUnits)}
                                                        alt={u.name}
                                                        style={{
                                                            width: 24,
                                                            height: 24,
                                                            objectFit: 'contain',
                                                            borderRadius: 'var(--radius-sm)',
                                                            border: '1px solid var(--color-border-accent)'
                                                        }}
                                                    />
                                                )}
                                                <div>
                                                    <div style={{ fontWeight: 600, fontSize: 12 }}>{u.name}</div>
                                                    <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>
                                                        {u.echelon || u.type}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
                )}

                {/* Attachment option - shown when a parent is selected and not a Base */}
                {!isBase && parentId && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-sm)',
                        padding: 'var(--spacing-sm)',
                        background: 'var(--color-bg-tertiary)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border-primary)'
                    }}>
                        <input
                            type="checkbox"
                            id="attached"
                            checked={attached}
                            onChange={(e) => setAttached(e.target.checked)}
                            style={{ width: 16, height: 16, cursor: 'pointer' }}
                        />
                        <label htmlFor="attached" style={{ fontSize: 13, cursor: 'pointer', userSelect: 'none' }}>
                            <span style={{ fontWeight: 500 }}>Attached</span>
                            <span style={{ color: 'var(--color-text-muted)', marginLeft: 6, fontSize: 11 }}>
                                (admin only, not in higher hierarchy)
                            </span>
                        </label>
                    </div>
                )}

                {/* Inherit deployments from parent — shown when a parent is selected and there are deployments to copy */}
                {!isBase && parentId && availableParentDeployments.length > 0 && (
                    <div style={{
                        padding: 'var(--spacing-md)',
                        background: 'var(--color-bg-tertiary)',
                        border: '1px solid var(--color-border-primary)',
                        borderRadius: 'var(--radius-md)'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 'var(--spacing-sm)'
                        }}>
                            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)' }}>
                                {unit ? 'Inherit Additional Deployments from Parent' : 'Inherit Deployments from Parent'}
                                <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 'normal', marginLeft: 6 }}>
                                    ({availableParentDeployments.length} available)
                                </span>
                            </label>
                            <button
                                onClick={handleInheritAll}
                                type="button"
                                style={{
                                    fontSize: 11,
                                    padding: '3px 10px',
                                    background: 'var(--color-bg-primary)',
                                    borderColor: 'var(--color-border-accent)'
                                }}
                            >
                                {inheritedDeploymentIds.size === availableParentDeployments.length ? 'Deselect All' : 'Select All'}
                            </button>
                        </div>

                        <div style={{
                            display: 'grid',
                            gap: 4,
                            maxHeight: 220,
                            overflowY: 'auto'
                        }}>
                            {availableParentDeployments.map(d => {
                                const isActive = !d.endDate;
                                const duration = d.endDate
                                    ? daysBetween(d.startDate, d.endDate)
                                    : daysBetween(d.startDate, today());

                                return (
                                    <label
                                        key={d.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--spacing-sm)',
                                            padding: '8px var(--spacing-sm)',
                                            background: inheritedDeploymentIds.has(d.id)
                                                ? 'var(--color-bg-elevated)'
                                                : 'var(--color-bg-primary)',
                                            borderRadius: 'var(--radius-sm)',
                                            border: inheritedDeploymentIds.has(d.id)
                                                ? '1px solid var(--color-accent-primary)'
                                                : '1px solid var(--color-border-primary)',
                                            cursor: 'pointer',
                                            transition: 'all 0.15s ease',
                                            userSelect: 'none'
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.borderColor = 'var(--color-accent-primary)';
                                        }}
                                        onMouseLeave={e => {
                                            if (!inheritedDeploymentIds.has(d.id)) {
                                                e.currentTarget.style.borderColor = 'var(--color-border-primary)';
                                            }
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={inheritedDeploymentIds.has(d.id)}
                                            onChange={() => handleToggleInherit(d.id)}
                                            style={{ accentColor: 'var(--color-accent-primary)', flexShrink: 0 }}
                                        />
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                                                <div style={{ fontWeight: 600, fontSize: 13 }}>
                                                    {d.name}
                                                </div>
                                                {isActive && (
                                                    <span style={{
                                                        padding: '1px 6px',
                                                        background: 'var(--color-status-deployed)',
                                                        color: 'white',
                                                        fontSize: 9,
                                                        fontWeight: 600,
                                                        borderRadius: 'var(--radius-sm)',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.5px'
                                                    }}>
                                                        Active
                                                    </span>
                                                )}
                                            </div>
                                            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
                                                {d.startDate} → {d.endDate || 'Ongoing'}
                                                <span style={{ marginLeft: 8, color: 'var(--color-accent-primary)' }}>
                                                    {duration}d
                                                </span>
                                                {d.operation && (
                                                    <span style={{ marginLeft: 8 }}>
                                                        · {d.operation}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>

                        {inheritedDeploymentIds.size > 0 && (
                            <div style={{
                                marginTop: 'var(--spacing-sm)',
                                fontSize: 11,
                                color: 'var(--color-accent-primary)'
                            }}>
                                {inheritedDeploymentIds.size} deployment{inheritedDeploymentIds.size !== 1 ? 's' : ''} will be copied to {unit ? 'this unit' : 'the new unit'}
                            </div>
                        )}
                    </div>
                )}

                <div>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: 14, color: '#9ca3af' }}>
                        Last RTB Date
                    </label>
                    <input
                        className="input"
                        type="date"
                        value={rtb}
                        onChange={e => setRtb(e.target.value)}
                        style={{ width: '100%' }}
                    />
                </div>

                {/* Patch/Photograph */}
                <div>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: 14, color: '#9ca3af' }}>
                        {isBase ? 'Base Photograph' : 'Unit Patch'}
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{
                            padding: 8,
                            border: '1px solid #334155',
                            borderRadius: 6,
                            background: '#020617',
                            color: '#9ca3af',
                            width: '100%',
                            cursor: 'pointer'
                        }}
                    />
                    {patch && (
                        <div style={{
                            marginTop: 12,
                            padding: 12,
                            background: '#020617',
                            borderRadius: 8,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12
                        }}>
                            <img
                                src={patch}
                                alt={isBase ? 'Base photograph' : 'Unit patch'}
                                style={{
                                    width: 80,
                                    height: 80,
                                    objectFit: 'contain',
                                    borderRadius: 4,
                                    border: '1px solid #334155'
                                }}
                            />
                            <button onClick={() => setPatch('')}>
                                {isBase ? 'Remove Photograph' : 'Remove Patch'}
                            </button>
                        </div>
                    )}
                </div>

                {/* NATO Symbol Section - only for non-Base units */}
                {!isBase && (
                <div style={{
                    padding: 'var(--spacing-md)',
                    background: 'var(--color-bg-tertiary)',
                    border: '1px solid var(--color-border-primary)',
                    borderRadius: 'var(--radius-md)'
                }}>
                    <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        NATO Symbol
                    </label>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        {/* Affiliation */}
                        <div>
                            <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: 'var(--color-text-muted)' }}>
                                Affiliation
                            </label>
                            <select
                                className="input"
                                value={affiliation}
                                onChange={e => setAffiliation(e.target.value as Affiliation)}
                                style={{ width: '100%' }}
                            >
                                <option value="friendly">Friendly</option>
                                <option value="hostile">Hostile</option>
                                <option value="neutral">Neutral</option>
                                <option value="unknown">Unknown</option>
                            </select>
                        </div>

                        {/* Size Override */}
                        <div>
                            <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: 'var(--color-text-muted)' }}>
                                Size Symbol (Auto: {echelon})
                            </label>
                            <select
                                className="input"
                                value={sizeSymbolOverride}
                                onChange={e => setSizeSymbolOverride(e.target.value)}
                                style={{ width: '100%' }}
                            >
                                <option value="">Auto from Echelon</option>
                                {Object.entries(SIZE_SYMBOLS).map(([name, data]) => (
                                    <option key={name} value={name}>{data.symbol} {name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Symbol Search/Select */}
                    <div style={{ marginTop: 12 }}>
                        <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: 'var(--color-text-muted)' }}>
                            Function Symbol
                        </label>
                        <button
                            type="button"
                            onClick={() => setShowSymbolDropdown(true)}
                            style={{
                                width: '100%',
                                textAlign: 'left',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                padding: 'var(--spacing-sm)',
                                background: 'var(--color-bg-secondary)',
                                border: '1px solid var(--color-border-accent)',
                                borderRadius: 'var(--radius-sm)',
                                cursor: 'pointer'
                            }}
                        >
                            {natoSymbol ? (
                                <>
                                    <img
                                        src={getNatoSymbolDataUrl(natoSymbol, affiliation, 40)}
                                        alt="Selected symbol"
                                        style={{ width: 40, height: 40, objectFit: 'contain' }}
                                    />
                                    <span>{getNatoSymbolByCode(natoSymbol)?.name || natoSymbol}</span>
                                </>
                            ) : (
                                <span style={{ color: 'var(--color-text-muted)' }}>Click to select a symbol...</span>
                            )}
                        </button>
                    </div>

                    {/* Symbol Selection Modal */}
                    {showSymbolDropdown && (
                        <>
                            <div
                                onClick={() => {
                                    setShowSymbolDropdown(false);
                                    setSymbolSearch('');
                                }}
                                style={{
                                    position: 'fixed',
                                    inset: 0,
                                    background: 'rgba(0,0,0,0.6)',
                                    zIndex: 2000,
                                }}
                            />
                            <div style={{
                                position: 'fixed',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: 'min(90vw, 600px)',
                                maxHeight: '80vh',
                                background: 'var(--color-bg-secondary)',
                                border: '1px solid var(--color-border-accent)',
                                borderRadius: 'var(--radius-md)',
                                zIndex: 2001,
                                display: 'flex',
                                flexDirection: 'column',
                                boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
                            }}>
                                <div style={{
                                    padding: 'var(--spacing-md)',
                                    borderBottom: '1px solid var(--color-border-primary)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}>
                                    <h3 style={{ margin: 0, fontSize: 16 }}>Select Function Symbol</h3>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowSymbolDropdown(false);
                                            setSymbolSearch('');
                                        }}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            fontSize: 20,
                                            cursor: 'pointer',
                                            color: 'var(--color-text-muted)',
                                            padding: '2px 6px',
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                                <div style={{ padding: 'var(--spacing-md)' }}>
                                    <input
                                        className="input"
                                        placeholder="Search symbols (infantry, armor, aviation...)"
                                        value={symbolSearch}
                                        onChange={e => setSymbolSearch(e.target.value)}
                                        autoFocus
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                <div style={{
                                    flex: 1,
                                    overflowY: 'auto',
                                    padding: '0 var(--spacing-md) var(--spacing-md)',
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                                    gap: 'var(--spacing-sm)',
                                    alignContent: 'start',
                                }}>
                                    {searchNatoSymbols(symbolSearch).map(entry => (
                                        <div
                                            key={entry.code}
                                            onClick={() => {
                                                setNatoSymbol(entry.code);
                                                setShowSymbolDropdown(false);
                                                setSymbolSearch('');
                                            }}
                                            style={{
                                                padding: 'var(--spacing-sm)',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 8,
                                                background: natoSymbol === entry.code ? 'var(--color-bg-tertiary)' : 'var(--color-bg-primary)',
                                                border: `1px solid ${natoSymbol === entry.code ? 'var(--color-accent-primary)' : 'var(--color-border-primary)'}`,
                                                borderRadius: 'var(--radius-sm)',
                                                transition: 'all 0.2s ease',
                                            }}
                                            onMouseEnter={(e) => {
                                                if (natoSymbol !== entry.code) {
                                                    e.currentTarget.style.borderColor = 'var(--color-border-accent)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (natoSymbol !== entry.code) {
                                                    e.currentTarget.style.borderColor = 'var(--color-border-primary)';
                                                }
                                            }}
                                        >
                                            <img
                                                src={getNatoSymbolDataUrl(entry.code, 'friendly', 40)}
                                                alt={entry.name}
                                                style={{ width: 40, height: 40, objectFit: 'contain', flexShrink: 0 }}
                                            />
                                            <div style={{ minWidth: 0 }}>
                                                <div style={{ fontWeight: 600, fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{entry.name}</div>
                                                <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>
                                                    {entry.category}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Preview */}
                    {natoSymbol && (
                        <div style={{
                            marginTop: 12,
                            padding: 12,
                            background: 'var(--color-bg-primary)',
                            borderRadius: 'var(--radius-sm)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12
                        }}>
                            <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Preview:</div>
                            <img
                                src={getNatoSymbolDataUrl(natoSymbol, affiliation, 64)}
                                alt="Selected symbol"
                                style={{ width: 64, height: 64, objectFit: 'contain' }}
                            />
                            <span style={{ fontSize: 16 }}>
                                {SIZE_SYMBOLS[sizeSymbolOverride || echelon]?.symbol || ''}
                            </span>
                        </div>
                    )}
                </div>
                )}

            </div>

            <div style={{ marginTop: 20, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button onClick={onDone} style={{ background: '#374151' }}>
                    Cancel
                </button>

                {unit && (
                    <button
                        onClick={remove}
                        style={{ background: '#991b1b', borderColor: '#b91c1c' }}
                    >
                        {isBase ? 'Delete Base' : 'Delete Unit'}
                    </button>
                )}

                <button
                    onClick={save}
                    style={{ background: '#1e40af', borderColor: '#2563eb' }}
                >
                    {unit ? 'Save Changes' : (isBase ? 'Create Base' : 'Create Unit')}
                </button>
            </div>
        </div>
    );
}
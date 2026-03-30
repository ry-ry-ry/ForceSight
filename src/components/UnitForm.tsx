import { useState, useEffect } from 'react';
import { db } from '../db';
import type { Deployment } from '../db';
import { useLiveQuery } from 'dexie-react-hooks';
import { today, daysBetween } from '../utils';

function inferEchelon(name: string): string {
    const lower = name.toLowerCase();
    if (lower.includes('command')) return 'Command';
    if (lower.includes('corps')) return 'Corps';
    if (lower.includes('division') || lower.includes('div')) return 'Division';
    if (lower.includes('brigade') || lower.includes('bde')) return 'Brigade';
    if (lower.includes('regiment') || lower.includes('regt')) return 'Regiment';
    if (lower.includes('battalion') || lower.includes('bn')) return 'Battalion';
    if (lower.includes('squadron') || lower.includes('sqn')) return 'Squadron';
    if (lower.includes('company') || lower.includes('co')) return 'Company';
    return 'Battalion'; // default
}

export default function UnitForm({ unit, onDone }: any) {
    const [name, setName] = useState(unit?.name || '');
    const [type, setType] = useState(unit?.type || 'Ground');
    const [echelon, setEchelon] = useState(unit?.echelon || 'Battalion');
    const [country, setCountry] = useState(unit?.country || '');
    const [status, setStatus] = useState(unit?.status || 'Standby');
    const [rtb, setRtb] = useState(unit?.lastRTBDate || '');
    const [parentId, setParentId] = useState(unit?.parentId || '');
    const [patch, setPatch] = useState(unit?.patch || '');
    const [parentSearch, setParentSearch] = useState('');
    const [showParentDropdown, setShowParentDropdown] = useState(false);

    const allUnits = useLiveQuery(() => db.units.toArray(), []);

    // Deployments belonging to the currently-selected parent unit
    const parentDeployments = useLiveQuery(
        () => parentId
            ? db.deployments.where('unitId').equals(parentId).sortBy('startDate')
            : Promise.resolve([] as Deployment[]),
        [parentId]
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
        if (!parentDeployments?.length) return;
        if (inheritedDeploymentIds.size === parentDeployments.length) {
            setInheritedDeploymentIds(new Set());
        } else {
            setInheritedDeploymentIds(new Set(parentDeployments.map(d => d.id)));
        }
    };

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
                const maxSize = 200;
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
        const now = Date.now();
        const unitId = unit?.id || crypto.randomUUID();

        await db.units.put({
            id: unitId,
            name,
            type,
            echelon,
            country: country || undefined,
            status,
            parentId: parentId || undefined,
            patch: patch || undefined,
            lastRTBDate: rtb || undefined,
            createdAt: unit?.createdAt || now
        });

        // Inherit selected deployments from parent (only on create)
        if (!unit && parentId && inheritedDeploymentIds.size > 0 && parentDeployments?.length) {
            const toInherit = parentDeployments.filter(d => inheritedDeploymentIds.has(d.id));
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

        onDone();
    }

    async function remove() {
        if (!unit) return;
        await db.units.delete(unit.id);
        onDone();
    }

    return (
        <div className="card">
            <h2>{unit ? 'Edit Unit' : 'Create Unit'}</h2>

            <div style={{ display: 'grid', gap: 16, marginTop: 16 }}>

                <div>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: 14, color: '#9ca3af' }}>
                        Unit Name
                    </label>
                    <input
                        className="input"
                        placeholder="Enter unit name"
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
                            <option>Command</option>
                            <option>Ground</option>
                            <option>Air</option>
                            <option>SOF</option>
                            <option>Support</option>
                        </select>
                    </div>

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
                            <option>Company</option>
                            <option>Squadron</option>
                            <option>Battalion</option>
                            <option>Regiment</option>
                            <option>Brigade</option>
                            <option>Division</option>
                            <option>Corps</option>
                            <option>Command</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: 14, color: '#9ca3af' }}>
                        Country (Optional)
                    </label>
                    <input
                        className="input"
                        placeholder="e.g., United States, United Kingdom"
                        value={country}
                        onChange={e => setCountry(e.target.value)}
                    />
                </div>

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
                                {selectedParent.patch && (
                                    <img
                                        src={selectedParent.patch}
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
                                                {u.patch && (
                                                    <img
                                                        src={u.patch}
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

                {/* Inherit deployments from parent — only shown when creating and a parent is selected */}
                {!unit && parentId && parentDeployments && parentDeployments.length > 0 && (
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
                                Inherit Deployments from Parent
                                <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 'normal', marginLeft: 6 }}>
                                    ({parentDeployments.length} available)
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
                                {inheritedDeploymentIds.size === parentDeployments.length ? 'Deselect All' : 'Select All'}
                            </button>
                        </div>

                        <div style={{
                            display: 'grid',
                            gap: 4,
                            maxHeight: 220,
                            overflowY: 'auto'
                        }}>
                            {parentDeployments.map(d => {
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
                                {inheritedDeploymentIds.size} deployment{inheritedDeploymentIds.size !== 1 ? 's' : ''} will be copied to the new unit
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

                <div>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: 14, color: '#9ca3af' }}>
                        Unit Patch
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
                                alt="Unit patch"
                                style={{
                                    width: 80,
                                    height: 80,
                                    objectFit: 'contain',
                                    borderRadius: 4,
                                    border: '1px solid #334155'
                                }}
                            />
                            <button onClick={() => setPatch('')}>Remove Patch</button>
                        </div>
                    )}
                </div>

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
                        Delete Unit
                    </button>
                )}

                <button
                    onClick={save}
                    style={{ background: '#1e40af', borderColor: '#2563eb' }}
                >
                    {unit ? 'Save Changes' : 'Create Unit'}
                </button>
            </div>
        </div>
    );
}
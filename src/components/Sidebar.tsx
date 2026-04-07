import { db, useLiveData } from '../database/adapter';
import React, { useState } from 'react';
import type { Unit } from '../database/types';
import { militaryNameCompare } from '../utils';
import { UnitIcon } from './UnitIcon';

export default function Sidebar({ select }: any) {
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState<'name' | 'status' | 'echelon' | 'created'>('name');
    const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set(['Bases', 'Ground', 'Air', 'SOF', 'Support']));
    const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set());
    const [showFilters, setShowFilters] = useState(false);

    // Filters
    const [filterCountry, setFilterCountry] = useState<string>('');
    const [filterEchelon, setFilterEchelon] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<string>('');
    const [filterOperation, setFilterOperation] = useState<string>('');
    const [filterHealth, setFilterHealth] = useState<string>('');
    const [filterEffectiveness, setFilterEffectiveness] = useState<string>('');

    const units = useLiveData(() => db.units.toArray(), []);
    const deployments = useLiveData(() => db.deployments.toArray(), []);
    const operations = useLiveData(() => db.operations.toArray(), []);
    const customSymbols = useLiveData(() => db.natoSymbols.toArray(), []);

    const toggleType = (type: string) => {
        const newExpanded = new Set(expandedTypes);
        if (newExpanded.has(type)) {
            newExpanded.delete(type);
        } else {
            newExpanded.add(type);
        }
        setExpandedTypes(newExpanded);
    };

    const toggleUnit = (id: string) => {
        const newExpanded = new Set(expandedUnits);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedUnits(newExpanded);
    };

    const getStatusColor = (status: string) => {
        const colors: any = {
            Deployed: 'var(--color-status-deployed)',
            Standby: 'var(--color-status-standby)',
            Training: 'var(--color-status-training)',
            Reset: 'var(--color-status-reset)'
        };
        return colors[status] || 'var(--color-text-muted)';
    };

    const applyFilters = (units: Unit[]) => {
        return units.filter(u => {
            // Hide Command-type units from sidebar
            if (u.type === 'Command') {
                return false;
            }

            // Search filter
            if (search && !u.name.toLowerCase().includes(search.toLowerCase())) {
                return false;
            }

            // Country filter
            if (filterCountry && u.country !== filterCountry) {
                return false;
            }

            // Echelon filter
            if (filterEchelon && u.echelon !== filterEchelon) {
                return false;
            }

            // Status filter
            if (filterStatus && u.status !== filterStatus) {
                return false;
            }

            // Operation filter
            if (filterOperation) {
                const unitDeployment = deployments?.find(d => d.unitId === u.id && d.operationId === filterOperation);
                if (!unitDeployment) {
                    return false;
                }
            }

            // Health filter
            if (filterHealth && (u.health || 'Healthy') !== filterHealth) {
                return false;
            }

            // Effectiveness filter
            if (filterEffectiveness) {
                const eff = u.effectiveness ?? 100;
                switch (filterEffectiveness) {
                    case 'effective':
                        if (eff < 80) return false;
                        break;
                    case 'slightly-degraded':
                        if (eff < 70 || eff >= 80) return false;
                        break;
                    case 'degraded':
                        if (eff < 60 || eff >= 70) return false;
                        break;
                    case 'heavily-degraded':
                        if (eff < 40 || eff >= 60) return false;
                        break;
                    case 'combat-ineffective':
                        if (eff >= 40) return false;
                        break;
                }
            }

            return true;
        });
    };

    const sortUnits = (units: Unit[]) => {
        const sorted = [...units];
        switch (sortBy) {
            case 'name':
                sorted.sort((a, b) => militaryNameCompare(a.name, b.name));
                break;
            case 'status':
                sorted.sort((a, b) => a.status.localeCompare(b.status));
                break;
            case 'echelon':
                const echelonOrder = ['Command', 'Corps', 'Division', 'Brigade', 'Regiment', 'Battalion', 'Squadron', 'Company', 'Platoon'];
                sorted.sort((a, b) => {
                    const aIndex = echelonOrder.indexOf(a.echelon || '');
                    const bIndex = echelonOrder.indexOf(b.echelon || '');
                    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
                });
                break;
            case 'created':
                sorted.sort((a, b) => b.createdAt - a.createdAt);
                break;
        }
        return sorted;
    };

    const groupByType = (unitsToGroup: Unit[]) => {
        const groups: Record<string, Unit[]> = {
            Bases: [],
            Ground: [],
            Air: [],
            SOF: [],
            Support: []
        };

        // When filters are active (beyond just search), show ALL matching units
        // flat — so subordinate units that match a filter aren't hidden behind
        // unexpanded / non-matching parents.
        const hasActiveFilters = !!(filterCountry || filterEchelon || filterStatus || filterOperation || filterHealth || filterEffectiveness);

        unitsToGroup.forEach(u => {
            if (u.type === 'Command') return; // Skip Commands
            if (u.type === 'Base') {
                groups['Bases'].push(u);
                return;
            }

            if (hasActiveFilters) {
                // Flat mode: every matching unit appears as a root entry
                if (groups[u.type]) {
                    groups[u.type].push(u);
                }
            } else {
                // Tree mode: only top-level or direct children of Commands
                const isTopLevel = !u.parentId;
                const parentUnit = u.parentId ? units?.find((p: Unit) => p.id === u.parentId) : null;
                const isChildOfCommand = parentUnit?.type === 'Command';

                if (isTopLevel || isChildOfCommand) {
                    if (groups[u.type]) {
                        groups[u.type].push(u);
                    }
                }
            }
        });

        return groups;
    };

    const getChildren = (parentId: string, allUnits: Unit[], rootParentId?: string) => {
        return allUnits
            .filter(u => {
                if (u.parentId !== parentId) return false;
                if (u.type === 'Command') return false;
                // Attached units only show when their immediate parent is the root being viewed
                // If rootParentId is set and this unit is attached, only show if parentId === rootParentId
                if (u.attached && rootParentId !== undefined && parentId !== rootParentId) return false;
                return true;
            })
            .sort((a, b) => militaryNameCompare(a.name, b.name));
    };

    const getParentCommand = (unit: Unit) => {
        if (!unit.parentId) return null;
        const parent = units?.find((u: Unit) => u.id === unit.parentId);
        if (parent?.type === 'Command') return parent;
        return null;
    };

    const renderUnit = (u: Unit, depth: number, allUnits: Unit[], flatMode: boolean = false, rootParentId?: string): React.ReactElement => {
        // Get children - pass rootParentId to filter attached units correctly
        // If this is a top-level render, u.id becomes the rootParentId
        const effectiveRootId = rootParentId === undefined ? u.id : rootParentId;
        const children = flatMode ? [] : getChildren(u.id, allUnits, effectiveRootId);
        const hasChildren = children.length > 0;
        const isExpanded = expandedUnits.has(u.id);
        const parentCommand = getParentCommand(u);

        return (
            <div key={u.id}>
                <div
                    onClick={() => select(u)}
                    style={{
                        padding: 'var(--spacing-md)',
                        paddingLeft: `calc(var(--spacing-xl) + ${depth * 20}px)`,
                        borderBottom: '1px solid var(--color-border-primary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-sm)',
                        transition: 'all 0.2s ease',
                        position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--color-bg-tertiary)';
                        e.currentTarget.style.borderLeftColor = 'var(--color-accent-primary)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderLeftColor = 'transparent';
                    }}
                >
                    <div style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 2,
                        background: 'transparent',
                        transition: 'background 0.2s ease'
                    }} />

                    {hasChildren && (
                        <span
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleUnit(u.id);
                            }}
                            style={{
                                cursor: 'pointer',
                                userSelect: 'none',
                                width: 16,
                                color: 'var(--color-accent-primary)',
                                transition: 'transform 0.2s ease',
                                transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                                fontSize: 12
                            }}
                        >
                            ▶
                        </span>
                    )}
                    {!hasChildren && <span style={{ width: 16 }} />}

                    <UnitIcon
                        unit={u}
                        allUnits={units}
                        customSymbols={customSymbols}
                        size="small"
                    />

                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                            fontWeight: 600,
                            fontSize: 13,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>
                            {u.name}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
                            {u.echelon || u.type}
                            {u.country && ` • ${u.country}`}
                        </div>
                        {parentCommand && (
                            <div style={{
                                fontSize: 10,
                                color: 'var(--color-accent-primary)',
                                marginTop: 2
                            }}>
                                {parentCommand.name}
                            </div>
                        )}
                    </div>

                    <div
                        className="status-indicator"
                        style={{
                            background: getStatusColor(u.status),
                            flexShrink: 0
                        }}
                    />
                </div>

                {hasChildren && isExpanded && children.map(child => renderUnit(child, depth + 1, allUnits, false, effectiveRootId))}
            </div>
        );
    };

    if (!units) return (
        <div className="sidebar">
            <div style={{
                padding: 'var(--spacing-xl)',
                textAlign: 'center',
                color: 'var(--color-text-muted)'
            }}>
                Loading...
            </div>
        </div>
    );

    const filtered = applyFilters(units);
    const sorted = sortUnits(filtered);
    const grouped = groupByType(sorted);

    const activeFiltersCount = [filterCountry, filterEchelon, filterStatus, filterOperation, filterHealth, filterEffectiveness].filter(Boolean).length;
    const hasActiveFilters = activeFiltersCount > 0;

    // Get unique values for filters
    const countries = Array.from(new Set(units.map(u => u.country).filter(Boolean))).sort();
    const echelons = Array.from(new Set(units.map(u => u.echelon).filter(Boolean))).sort();

    return (
        <div className="sidebar">
            <div style={{
                padding: 'var(--spacing-lg)',
                borderBottom: '1px solid var(--color-border-primary)',
                background: 'var(--color-bg-tertiary)'
            }}>
                <h3 style={{
                    marginBottom: 'var(--spacing-md)',
                    color: 'var(--color-accent-primary)',
                    fontSize: 16
                }}>
                    UNIT ROSTER
                </h3>

                <input
                    className="input"
                    placeholder="Search units..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ marginBottom: 'var(--spacing-sm)' }}
                />

                <select
                    className="input"
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as any)}
                    style={{ width: '100%', marginBottom: 'var(--spacing-sm)' }}
                >
                    <option value="name">Sort: Alphabetical</option>
                    <option value="status">Sort: Status</option>
                    <option value="echelon">Sort: Echelon</option>
                    <option value="created">Sort: Recently Created</option>
                </select>

                <button
                    onClick={() => setShowFilters(!showFilters)}
                    style={{
                        width: '100%',
                        fontSize: 11,
                        background: showFilters ? 'var(--color-accent-primary)' : 'var(--color-bg-elevated)',
                        color: showFilters ? 'var(--color-bg-primary)' : 'var(--color-text-primary)',
                        borderColor: showFilters ? 'var(--color-accent-primary)' : 'var(--color-border-accent)'
                    }}
                >
                    {showFilters ? '▼' : '▶'} Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                </button>

                {showFilters && (
                    <div style={{
                        marginTop: 'var(--spacing-sm)',
                        padding: 'var(--spacing-sm)',
                        background: 'var(--color-bg-primary)',
                        borderRadius: 'var(--radius-sm)',
                        display: 'grid',
                        gap: 'var(--spacing-xs)'
                    }}>
                        <select
                            className="input"
                            value={filterCountry}
                            onChange={e => setFilterCountry(e.target.value)}
                            style={{ width: '100%', fontSize: 11 }}
                        >
                            <option value="">All Countries</option>
                            {countries.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>

                        <select
                            className="input"
                            value={filterEchelon}
                            onChange={e => setFilterEchelon(e.target.value)}
                            style={{ width: '100%', fontSize: 11 }}
                        >
                            <option value="">All Echelons</option>
                            {echelons.map(e => (
                                <option key={e} value={e}>{e}</option>
                            ))}
                        </select>

                        <select
                            className="input"
                            value={filterStatus}
                            onChange={e => setFilterStatus(e.target.value)}
                            style={{ width: '100%', fontSize: 11 }}
                        >
                            <option value="">All Statuses</option>
                            <option value="Deployed">Deployed</option>
                            <option value="Standby">Standby</option>
                            <option value="Training">Training</option>
                            <option value="Reset">Reset</option>
                        </select>

                        <select
                            className="input"
                            value={filterOperation}
                            onChange={e => setFilterOperation(e.target.value)}
                            style={{ width: '100%', fontSize: 11 }}
                        >
                            <option value="">All Operations</option>
                            {operations?.map(op => (
                                <option key={op.id} value={op.id}>{op.name}</option>
                            ))}
                        </select>

                        <select
                            className="input"
                            value={filterHealth}
                            onChange={e => setFilterHealth(e.target.value)}
                            style={{ width: '100%', fontSize: 11 }}
                        >
                            <option value="">All Health</option>
                            <option value="Healthy">Healthy</option>
                            <option value="Damaged">Damaged</option>
                            <option value="Destroyed">Destroyed</option>
                        </select>

                        <select
                            className="input"
                            value={filterEffectiveness}
                            onChange={e => setFilterEffectiveness(e.target.value)}
                            style={{ width: '100%', fontSize: 11 }}
                        >
                            <option value="">All Effectiveness</option>
                            <option value="effective">Effective (80–100%)</option>
                            <option value="slightly-degraded">Slightly Degraded (70–79%)</option>
                            <option value="degraded">Degraded (60–69%)</option>
                            <option value="heavily-degraded">Heavily Degraded (40–59%)</option>
                            <option value="combat-ineffective">Combat Ineffective (0–39%)</option>
                        </select>

                        {activeFiltersCount > 0 && (
                            <button
                                onClick={() => {
                                    setFilterCountry('');
                                    setFilterEchelon('');
                                    setFilterStatus('');
                                    setFilterOperation('');
                                    setFilterHealth('');
                                    setFilterEffectiveness('');
                                }}
                                style={{
                                    fontSize: 10,
                                    padding: '4px 8px',
                                    background: 'var(--color-bg-elevated)'
                                }}
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}

                <div style={{
                    marginTop: 'var(--spacing-sm)',
                    fontSize: 11,
                    color: 'var(--color-text-muted)',
                    textAlign: 'center'
                }}>
                    {filtered.length} of {units.filter(u => u.type !== 'Command').length} units
                </div>

                {activeFiltersCount > 0 && (
                    <div style={{
                        marginTop: 'var(--spacing-sm)',
                        padding: '6px var(--spacing-sm)',
                        background: 'var(--color-status-training)15',
                        border: '1px solid var(--color-status-training)60',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 'var(--spacing-xs)'
                    }}>
                        <span style={{
                            fontSize: 11,
                            color: 'var(--color-status-training)',
                            fontWeight: 600
                        }}>
                            {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active — {units.filter(u => u.type !== 'Command').length - filtered.length} hidden
                        </span>
                        <button
                            onClick={() => {
                                setFilterCountry('');
                                setFilterEchelon('');
                                setFilterStatus('');
                                setFilterOperation('');
                                setFilterHealth('');
                                setFilterEffectiveness('');
                            }}
                            style={{
                                fontSize: 9,
                                padding: '2px 8px',
                                background: 'var(--color-status-training)',
                                borderColor: 'var(--color-status-training)',
                                color: 'var(--color-bg-primary)',
                                fontWeight: 600
                            }}
                        >
                            CLEAR
                        </button>
                    </div>
                )}
            </div>

            <div>
                {Object.entries(grouped).map(([type, typeUnits]) => (
                    <div key={type}>
                        <div
                            onClick={() => toggleType(type)}
                            style={{
                                padding: 'var(--spacing-sm) var(--spacing-md)',
                                background: 'var(--color-bg-elevated)',
                                borderBottom: '1px solid var(--color-border-primary)',
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'var(--color-bg-tertiary)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'var(--color-bg-elevated)';
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                                <span style={{
                                    color: 'var(--color-accent-primary)',
                                    fontSize: 12,
                                    transition: 'transform 0.2s ease',
                                    transform: expandedTypes.has(type) ? 'rotate(90deg)' : 'rotate(0deg)'
                                }}>
                                    ▶
                                </span>
                                <span style={{
                                    fontWeight: 600,
                                    fontSize: 13,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    {type}
                                </span>
                            </div>
                            <span style={{
                                fontSize: 11,
                                color: 'var(--color-text-muted)',
                                fontFamily: 'var(--font-mono)'
                            }}>
                                {typeUnits.length}
                            </span>
                        </div>

                        {expandedTypes.has(type) && typeUnits.map(u => renderUnit(u, 0, filtered, hasActiveFilters))}
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div style={{
                        padding: 'var(--spacing-xl)',
                        textAlign: 'center',
                        color: 'var(--color-text-muted)',
                        fontSize: 12
                    }}>
                        No units found
                    </div>
                )}
            </div>
        </div>
    );
}

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { useState } from 'react';
import type { Unit } from '../db';

export default function Sidebar({ select }: any) {
    const [search, setSearch] = useState('');
    const [expanded, setExpanded] = useState<Set<string>>(new Set());
    const [sortBy, setSortBy] = useState<'name' | 'status' | 'echelon' | 'created'>('name');
    const units = useLiveQuery(() => db.units.toArray(), []);

    const toggleExpand = (id: string) => {
        const newExpanded = new Set(expanded);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpanded(newExpanded);
    };

    const buildTree = (units: Unit[]) => {
        // Sort units based on selected sort option
        let sortedUnits = [...units];
        switch (sortBy) {
            case 'name':
                sortedUnits.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'status':
                sortedUnits.sort((a, b) => a.status.localeCompare(b.status));
                break;
            case 'echelon':
                const echelonOrder = ['Division', 'Brigade', 'Regiment', 'Battalion', 'Squadron', 'Company'];
                sortedUnits.sort((a, b) => {
                    const aIndex = echelonOrder.indexOf(a.echelon || '');
                    const bIndex = echelonOrder.indexOf(b.echelon || '');
                    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
                });
                break;
            case 'created':
                sortedUnits.sort((a, b) => b.createdAt - a.createdAt);
                break;
        }

        const topLevel = sortedUnits.filter(u => !u.parentId);
        const childMap = new Map<string, Unit[]>();

        sortedUnits.forEach(u => {
            if (u.parentId) {
                if (!childMap.has(u.parentId)) {
                    childMap.set(u.parentId, []);
                }
                childMap.get(u.parentId)!.push(u);
            }
        });

        return { topLevel, childMap };
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

    const renderUnit = (u: Unit, depth: number, childMap: Map<string, Unit[]>) => {
        const color = getStatusColor(u.status);
        const children = childMap.get(u.id) || [];
        const hasChildren = children.length > 0;
        const isExpanded = expanded.has(u.id);

        return (
            <div key={u.id}>
                <div
                    onClick={() => select(u)}
                    style={{
                        padding: 'var(--spacing-md)',
                        paddingLeft: `calc(var(--spacing-md) + ${depth * 20}px)`,
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
                                toggleExpand(u.id);
                            }}
                            style={{
                                cursor: 'pointer',
                                userSelect: 'none',
                                width: 16,
                                color: 'var(--color-accent-primary)',
                                transition: 'transform 0.2s ease',
                                transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)'
                            }}
                        >
                            ▶
                        </span>
                    )}
                    {!hasChildren && <span style={{ width: 16 }} />}

                    {u.patch && (
                        <img
                            src={u.patch}
                            alt={`${u.name} patch`}
                            style={{
                                width: 32,
                                height: 32,
                                objectFit: 'contain',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--color-border-accent)'
                            }}
                        />
                    )}

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
                        <div style={{
                            fontSize: 11,
                            color: 'var(--color-text-muted)',
                            marginTop: 2
                        }}>
                            {u.echelon || u.type}
                        </div>
                    </div>

                    <div
                        className="status-indicator"
                        style={{
                            background: color,
                            flexShrink: 0
                        }}
                    />
                </div>
                {hasChildren && isExpanded && children.map(child => renderUnit(child, depth + 1, childMap))}
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

    const filtered = units.filter(u => u.name.toLowerCase().includes(search.toLowerCase()));
    const { topLevel, childMap } = buildTree(filtered);

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
                    style={{ width: '100%' }}
                >
                    <option value="name">Sort: Alphabetical</option>
                    <option value="status">Sort: Status</option>
                    <option value="echelon">Sort: Echelon</option>
                    <option value="created">Sort: Recently Created</option>
                </select>
            </div>

            <div>
                {topLevel.length === 0 ? (
                    <div style={{
                        padding: 'var(--spacing-xl)',
                        textAlign: 'center',
                        color: 'var(--color-text-muted)',
                        fontSize: 12
                    }}>
                        No units found
                    </div>
                ) : (
                    topLevel.map(u => renderUnit(u, 0, childMap))
                )}
            </div>
        </div>
    );
}
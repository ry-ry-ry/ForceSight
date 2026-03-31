import { useState, lazy, Suspense } from 'react';
import OverviewTab from './tabs/OverviewTab';
import DeploymentsTab from './tabs/DeploymentsTab';
import MissionsTab from './tabs/MissionsTab';
import { getEffectivenessInfo, getHealthColor } from '../utils';

const MapTab = lazy(() => import('./tabs/MapTab'));

export default function UnitPanel({ unit, onEdit, onSelectUnit, onAddSubordinate }: any) {
    const [tab, setTab] = useState<'overview' | 'deployments' | 'missions' | 'map'>('overview');

    return (
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>

            {/* HEADER */}
            <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                        <h1 style={{
                            fontSize: 32,
                            marginBottom: 'var(--spacing-sm)',
                            color: 'var(--color-accent-primary)'
                        }}>
                            {unit.name}
                        </h1>
                        <div style={{
                            display: 'flex',
                            gap: 'var(--spacing-md)',
                            alignItems: 'center',
                            fontSize: 13,
                            color: 'var(--color-text-secondary)'
                        }}>
                            <span>{unit.type}</span>
                            {unit.echelon && (
                                <>
                                    <span style={{ color: 'var(--color-text-muted)' }}>•</span>
                                    <span>{unit.echelon}</span>
                                </>
                            )}
                            <span style={{ color: 'var(--color-text-muted)' }}>•</span>
                            <span style={{
                                padding: '4px 8px',
                                borderRadius: 'var(--radius-sm)',
                                background: `var(--color-status-${unit.status.toLowerCase()})20`,
                                color: `var(--color-status-${unit.status.toLowerCase()})`,
                                border: `1px solid var(--color-status-${unit.status.toLowerCase()})40`,
                                textTransform: 'uppercase',
                                fontWeight: 600,
                                fontSize: 11,
                                letterSpacing: '0.5px'
                            }}>
                                {unit.status}
                            </span>
                            {unit.health && (
                                <>
                                    <span style={{ color: 'var(--color-text-muted)' }}>•</span>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: 'var(--radius-sm)',
                                        background: `${getHealthColor(unit.health)}20`,
                                        color: getHealthColor(unit.health),
                                        border: `1px solid ${getHealthColor(unit.health)}40`,
                                        textTransform: 'uppercase',
                                        fontWeight: 600,
                                        fontSize: 11,
                                        letterSpacing: '0.5px'
                                    }}>
                                        {unit.health}
                                    </span>
                                </>
                            )}
                            {unit.effectiveness !== undefined && (
                                <>
                                    <span style={{ color: 'var(--color-text-muted)' }}>•</span>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: 'var(--radius-sm)',
                                        background: `${getEffectivenessInfo(unit.effectiveness).color}20`,
                                        color: getEffectivenessInfo(unit.effectiveness).color,
                                        border: `1px solid ${getEffectivenessInfo(unit.effectiveness).color}40`,
                                        fontWeight: 600,
                                        fontSize: 11,
                                        letterSpacing: '0.5px'
                                    }}>
                                        {unit.effectiveness}% — {getEffectivenessInfo(unit.effectiveness).label}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                    {unit.patch && (
                        <img
                            src={unit.patch}
                            alt={`${unit.name} patch`}
                            style={{
                                width: 100,
                                height: 100,
                                objectFit: 'contain',
                                borderRadius: 'var(--radius-md)',
                                marginLeft: 'var(--spacing-xl)',
                                border: '2px solid var(--color-border-accent)',
                                padding: 'var(--spacing-sm)',
                                background: 'var(--color-bg-tertiary)'
                            }}
                        />
                    )}
                    <button onClick={onEdit} style={{ marginLeft: 'var(--spacing-lg)' }}>
                        Edit Unit
                    </button>
                </div>

                <div className="tactical-divider" style={{ margin: 'var(--spacing-lg) 0' }}></div>

                {/* TABS */}
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                    <button
                        onClick={() => setTab('overview')}
                        style={{
                            background: tab === 'overview' ? 'var(--color-accent-primary)' : 'var(--color-bg-elevated)',
                            borderColor: tab === 'overview' ? 'var(--color-accent-primary)' : 'var(--color-border-accent)',
                            color: tab === 'overview' ? 'var(--color-bg-primary)' : 'var(--color-text-primary)'
                        }}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setTab('deployments')}
                        style={{
                            background: tab === 'deployments' ? 'var(--color-accent-primary)' : 'var(--color-bg-elevated)',
                            borderColor: tab === 'deployments' ? 'var(--color-accent-primary)' : 'var(--color-border-accent)',
                            color: tab === 'deployments' ? 'var(--color-bg-primary)' : 'var(--color-text-primary)'
                        }}
                    >
                        Deployments
                    </button>
                    <button
                        onClick={() => setTab('missions')}
                        style={{
                            background: tab === 'missions' ? 'var(--color-accent-primary)' : 'var(--color-bg-elevated)',
                            borderColor: tab === 'missions' ? 'var(--color-accent-primary)' : 'var(--color-border-accent)',
                            color: tab === 'missions' ? 'var(--color-bg-primary)' : 'var(--color-text-primary)'
                        }}
                    >
                        Missions
                    </button>
                    <button
                        onClick={() => setTab('map')}
                        style={{
                            background: tab === 'map' ? 'var(--color-accent-primary)' : 'var(--color-bg-elevated)',
                            borderColor: tab === 'map' ? 'var(--color-accent-primary)' : 'var(--color-border-accent)',
                            color: tab === 'map' ? 'var(--color-bg-primary)' : 'var(--color-text-primary)'
                        }}
                    >
                        Map
                    </button>
                </div>
            </div>

            {/* TAB CONTENT */}
            {tab === 'overview' && <OverviewTab unit={unit} onSelectUnit={onSelectUnit} onAddSubordinate={onAddSubordinate} />}
            {tab === 'deployments' && <DeploymentsTab unit={unit} />}
            {tab === 'missions' && <MissionsTab unit={unit} />}
            {tab === 'map' && (
                <Suspense fallback={
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400, color: 'var(--color-text-muted)' }}>
                        Loading map...
                    </div>
                }>
                    <MapTab unit={unit} />
                </Suspense>
            )}

        </div>
    );
}
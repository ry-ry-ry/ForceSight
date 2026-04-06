import { db, useLiveData } from '../database/adapter';
import { useEffect, useState } from 'react';
import { calculateRotationStatus } from '../utils';
import { UnitIcon } from './UnitIcon';

export default function Dashboard({ onSelectUnit }: any) {
    const units = useLiveData(() => db.units.toArray(), []);
    const deployments = useLiveData(() => db.deployments.toArray(), []);
    const customSymbols = useLiveData(() => db.natoSymbols.toArray(), []);
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const stats = {
        totalUnits: units?.length || 0,
        deployed: units?.filter(u => u.status === 'Deployed').length || 0,
        standby: units?.filter(u => u.status === 'Standby').length || 0,
        training: units?.filter(u => u.status === 'Training').length || 0,
        activeDeployments: deployments?.filter(d => !d.endDate).length || 0
    };

    // Calculate rotation needs
    const rotationNeeds = units?.map(unit => {
        const activeDeployment = deployments?.find(d => d.unitId === unit.id && !d.endDate);
        if (!activeDeployment) return null;

        const rotationStatus = calculateRotationStatus(unit.type, activeDeployment.startDate);
        return {
            unit,
            deployment: activeDeployment,
            rotationStatus
        };
    }).filter(Boolean).sort((a, b) => {
        const priDiff = a!.rotationStatus.priority - b!.rotationStatus.priority;
        if (priDiff !== 0) return priDiff;
        return b!.rotationStatus.daysDeployed - a!.rotationStatus.daysDeployed;
    }) || [];

    const recentUnits = units?.slice(-5).reverse() || [];

    const getStatusColor = (status: string) => {
        const colors: any = {
            Deployed: 'var(--color-status-deployed)',
            Standby: 'var(--color-status-standby)',
            Training: 'var(--color-status-training)',
            Reset: 'var(--color-status-reset)'
        };
        return colors[status] || 'var(--color-text-muted)';
    };

    return (
        <div style={{ padding: 'var(--spacing-2xl)', maxWidth: 1400, margin: '0 auto' }}>

            {/* Header */}
            <div style={{ marginBottom: 'var(--spacing-2xl)' }} className="animate-fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-md)' }}>
                    <div>
                        <h1 style={{
                            fontSize: 48,
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: 'var(--spacing-sm)'
                        }}>
                            FORCESIGHT
                        </h1>
                        <p style={{
                            color: 'var(--color-text-muted)',
                            fontSize: 14,
                            letterSpacing: '2px',
                            textTransform: 'uppercase'
                        }}>
                            Operational Command Dashboard
                        </p>
                    </div>
                    <div style={{
                        textAlign: 'right',
                        padding: 'var(--spacing-md)',
                        background: 'var(--color-bg-secondary)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border-primary)'
                    }}>
                        <div style={{
                            fontSize: 24,
                            fontWeight: 600,
                            color: 'var(--color-accent-primary)',
                            fontFamily: 'var(--font-mono)'
                        }}>
                            {time.toLocaleTimeString('en-US', { hour12: false })}
                        </div>
                        <div style={{
                            fontSize: 12,
                            color: 'var(--color-text-muted)',
                            marginTop: 'var(--spacing-xs)'
                        }}>
                            {time.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            })}
                        </div>
                    </div>
                </div>
                <div className="tactical-divider"></div>
            </div>

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 'var(--spacing-lg)',
                marginBottom: 'var(--spacing-2xl)'
            }}>
                <StatCard
                    label="Total Units"
                    value={stats.totalUnits}
                    icon="▣"
                    delay={0}
                />
                <StatCard
                    label="Deployed"
                    value={stats.deployed}
                    color="var(--color-status-deployed)"
                    icon="◈"
                    delay={0.1}
                />
                <StatCard
                    label="Standby"
                    value={stats.standby}
                    color="var(--color-status-standby)"
                    icon="◆"
                    delay={0.2}
                />
                <StatCard
                    label="Training"
                    value={stats.training}
                    color="var(--color-status-training)"
                    icon="◇"
                    delay={0.3}
                />
                <StatCard
                    label="Active Ops"
                    value={stats.activeDeployments}
                    color="var(--color-accent-primary)"
                    icon="◉"
                    delay={0.4}
                />
            </div>

            {/* Main Content Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
                gap: 'var(--spacing-xl)'
            }}>

                {/* Rotation Status */}
                {rotationNeeds.length > 0 && (
                    <div className="card animate-fade-in" style={{ animationDelay: '0.5s', gridColumn: '1 / -1' }}>
                        <h2>Rotation Status</h2>
                        <div style={{
                            marginTop: 'var(--spacing-lg)',
                            display: 'grid',
                            gap: 'var(--spacing-md)',
                            maxHeight: '600px',
                            overflowY: 'auto',
                            paddingRight: 'var(--spacing-xs)'
                        }}>
                            {rotationNeeds.map((item, index) => (
                                <RotationCard
                                    key={item!.unit.id}
                                    unit={item!.unit}
                                    deployment={item!.deployment}
                                    rotationStatus={item!.rotationStatus}
                                    onSelect={() => onSelectUnit(item!.unit)}
                                    delay={0.6 + index * 0.05}
                                    allUnits={units}
                                    customSymbols={customSymbols}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Recent Units */}
                <div className="card animate-fade-in" style={{ animationDelay: '0.7s' }}>
                    <h2>Recent Units</h2>
                    <div style={{ marginTop: 'var(--spacing-lg)' }}>
                        {recentUnits.length === 0 ? (
                            <div style={{
                                textAlign: 'center',
                                padding: 'var(--spacing-2xl)',
                                color: 'var(--color-text-muted)'
                            }}>
                                No units created yet
                            </div>
                        ) : (
                            recentUnits.map((unit, index) => (
                                <div
                                    key={unit.id}
                                    onClick={() => onSelectUnit(unit)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--spacing-md)',
                                        padding: 'var(--spacing-md)',
                                        marginBottom: 'var(--spacing-sm)',
                                        background: 'var(--color-bg-tertiary)',
                                        border: '1px solid var(--color-border-primary)',
                                        borderRadius: 'var(--radius-sm)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        animation: 'slideIn 0.4s ease forwards',
                                        animationDelay: `${0.6 + index * 0.1}s`,
                                        opacity: 0
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'var(--color-bg-elevated)';
                                        e.currentTarget.style.borderColor = 'var(--color-accent-primary)';
                                        e.currentTarget.style.transform = 'translateX(4px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'var(--color-bg-tertiary)';
                                        e.currentTarget.style.borderColor = 'var(--color-border-primary)';
                                        e.currentTarget.style.transform = 'translateX(0)';
                                    }}
                                >
                                    <UnitIcon
                                        unit={unit}
                                        allUnits={units}
                                        customSymbols={customSymbols}
                                        size="small"
                                    />
                                    <div style={{ flex: 1 }}>
                                        <div style={{
                                            fontWeight: 600,
                                            marginBottom: 'var(--spacing-xs)'
                                        }}>
                                            {unit.name}
                                        </div>
                                        <div style={{
                                            fontSize: 12,
                                            color: 'var(--color-text-muted)'
                                        }}>
                                            {unit.echelon || unit.type}
                                        </div>
                                    </div>
                                    <div style={{
                                        fontSize: 11,
                                        padding: '4px 8px',
                                        borderRadius: 'var(--radius-sm)',
                                        background: getStatusColor(unit.status) + '20',
                                        color: getStatusColor(unit.status),
                                        border: `1px solid ${getStatusColor(unit.status)}40`,
                                        textTransform: 'uppercase',
                                        fontWeight: 600,
                                        letterSpacing: '0.5px'
                                    }}>
                                        {unit.status}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Status Breakdown */}
                <div className="card animate-fade-in" style={{ animationDelay: '0.8s' }}>
                    <h2>Status Overview</h2>
                    <div style={{ marginTop: 'var(--spacing-lg)' }}>
                        <StatusBar
                            label="Deployed"
                            value={stats.deployed}
                            total={stats.totalUnits}
                            color="var(--color-status-deployed)"
                        />
                        <StatusBar
                            label="Standby"
                            value={stats.standby}
                            total={stats.totalUnits}
                            color="var(--color-status-standby)"
                        />
                        <StatusBar
                            label="Training"
                            value={stats.training}
                            total={stats.totalUnits}
                            color="var(--color-status-training)"
                        />
                        <StatusBar
                            label="Reset"
                            value={stats.totalUnits - stats.deployed - stats.standby - stats.training}
                            total={stats.totalUnits}
                            color="var(--color-status-reset)"
                        />
                    </div>
                </div>

            </div>

        </div>
    );
}

function StatCard({ label, value, color, icon, delay }: any) {
    return (
        <div
            className="card animate-fade-in"
            style={{
                padding: 'var(--spacing-lg)',
                animationDelay: `${delay}s`,
                opacity: 0
            }}
        >
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 'var(--spacing-md)'
            }}>
                <div style={{
                    fontSize: 12,
                    color: 'var(--color-text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}>
                    {label}
                </div>
                <div style={{
                    fontSize: 24,
                    color: color || 'var(--color-accent-primary)',
                    opacity: 0.3
                }}>
                    {icon}
                </div>
            </div>
            <div style={{
                fontSize: 36,
                fontWeight: 700,
                color: color || 'var(--color-text-primary)',
                fontFamily: 'var(--font-mono)'
            }}>
                {value}
            </div>
        </div>
    );
}

function StatusBar({ label, value, total, color }: any) {
    const percentage = total > 0 ? (value / total) * 100 : 0;

    return (
        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 'var(--spacing-xs)',
                fontSize: 12
            }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
                <span style={{
                    color: color,
                    fontWeight: 600,
                    fontFamily: 'var(--font-mono)'
                }}>
                    {value} / {total}
                </span>
            </div>
            <div style={{
                height: 8,
                background: 'var(--color-bg-primary)',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                border: '1px solid var(--color-border-primary)'
            }}>
                <div style={{
                    height: '100%',
                    width: `${percentage}%`,
                    background: `linear-gradient(90deg, ${color}, ${color}dd)`,
                    transition: 'width 1s ease',
                    boxShadow: `0 0 10px ${color}40`
                }} />
            </div>
        </div>
    );
}

function RotationCard({ unit, deployment, rotationStatus, onSelect, delay, allUnits, customSymbols }: any) {
    const getStatusLabel = () => {
        switch (rotationStatus.status) {
            case 'overdue':
                return 'OVERDUE';
            case 'urgent':
                return 'URGENT';
            case 'soon':
                return 'SOON';
            default:
                return 'OK';
        }
    };

    const getStatusMessage = () => {
        if (rotationStatus.status === 'overdue') {
            return `${Math.abs(rotationStatus.daysUntilRotation)} days overdue`;
        }
        return `Rotate in ${rotationStatus.daysUntilRotation} days`;
    };

    const parentUnit = allUnits?.find((u: any) => u.id === unit.parentId);

    return (
        <div
            onClick={onSelect}
            style={{
                padding: 'var(--spacing-lg)',
                background: 'var(--color-bg-tertiary)',
                border: `2px solid ${rotationStatus.color}`,
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                animation: 'slideIn 0.4s ease forwards',
                animationDelay: `${delay}s`,
                opacity: 0,
                position: 'relative',
                overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--color-bg-elevated)';
                e.currentTarget.style.transform = 'translateX(4px)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--color-bg-tertiary)';
                e.currentTarget.style.transform = 'translateX(0)';
            }}
        >
            {rotationStatus.status === 'overdue' && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    padding: '6px 12px',
                    background: 'var(--color-status-deployed)',
                    color: 'white',
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    borderBottomLeftRadius: 'var(--radius-sm)'
                }}>
                    ⚠ OVERDUE
                </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)' }}>
                <UnitIcon
                    unit={unit}
                    allUnits={allUnits}
                    customSymbols={customSymbols}
                    size="medium"
                />

                <div style={{ flex: 1 }}>
                    <div style={{
                        fontWeight: 700,
                        fontSize: 16,
                        marginBottom: 'var(--spacing-xs)'
                    }}>
                        {unit.name}
                    </div>
                    <div style={{
                        fontSize: 12,
                        color: 'var(--color-text-muted)',
                        marginBottom: 'var(--spacing-xs)'
                    }}>
                        {deployment.operation || deployment.name} • {unit.echelon || unit.type}
                    </div>
                    {parentUnit && (
                        <div style={{
                            fontSize: 11,
                            color: 'var(--color-accent-secondary)',
                            marginBottom: 'var(--spacing-sm)'
                        }}>
                            Parent: {parentUnit.name}
                        </div>
                    )}

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 'var(--spacing-md)',
                        marginTop: 'var(--spacing-md)'
                    }}>
                        <div>
                            <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 4 }}>
                                Days Deployed
                            </div>
                            <div style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: 16,
                                fontWeight: 600,
                                color: rotationStatus.color
                            }}>
                                {rotationStatus.daysDeployed}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 4 }}>
                                Threshold
                            </div>
                            <div style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: 16,
                                fontWeight: 600
                            }}>
                                {rotationStatus.rotationThreshold}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 4 }}>
                                Status
                            </div>
                            <div style={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: rotationStatus.color,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                {getStatusMessage()}
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{
                    padding: 'var(--spacing-md)',
                    background: `${rotationStatus.color}20`,
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${rotationStatus.color}`,
                    minWidth: 100,
                    textAlign: 'center'
                }}>
                    <div style={{
                        fontSize: 11,
                        color: 'var(--color-text-muted)',
                        marginBottom: 4
                    }}>
                        Priority
                    </div>
                    <div style={{
                        fontSize: 24,
                        fontWeight: 700,
                        color: rotationStatus.color,
                        fontFamily: 'var(--font-mono)'
                    }}>
                        {getStatusLabel()}
                    </div>
                </div>
            </div>

            {/* Progress bar */}
            <div style={{
                marginTop: 'var(--spacing-md)',
                height: 6,
                background: 'var(--color-bg-primary)',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden'
            }}>
                <div style={{
                    height: '100%',
                    width: `${Math.min((rotationStatus.daysDeployed / rotationStatus.rotationThreshold) * 100, 100)}%`,
                    background: `linear-gradient(90deg, ${rotationStatus.color}, ${rotationStatus.color}dd)`,
                    transition: 'width 1s ease',
                    boxShadow: `0 0 10px ${rotationStatus.color}40`
                }} />
            </div>
        </div>
    );
}

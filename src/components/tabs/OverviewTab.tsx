import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db';
import { daysBetween, today, calculateReadiness } from '../../utils';
import type { Unit } from '../../db';

export default function OverviewTab({ unit, onSelectUnit }: any) {
    const deployments = useLiveQuery(
        () => db.deployments.where('unitId').equals(unit.id).sortBy('startDate'),
        [unit.id]
    );

    const allUnits = useLiveQuery(() => db.units.toArray(), []);
    const taskForces = useLiveQuery(() => db.taskForces.toArray(), []);

    const unitTaskForce = taskForces?.find(tf => tf.id === unit.taskForceId);

    const active = deployments?.find(d => !d.endDate);
    const completed = deployments?.filter(d => d.endDate).sort((a, b) =>
        new Date(b.endDate!).getTime() - new Date(a.endDate!).getTime()
    );
    const lastCompleted = completed?.[0];

    // Current deployment length
    const currentDeploymentLength = active
        ? daysBetween(active.startDate, today())
        : null;

    // Last deployment length
    const lastDeploymentLength = lastCompleted
        ? daysBetween(lastCompleted.startDate, lastCompleted.endDate!)
        : null;

    // Rest period (time since last deployment ended)
    const restPeriod = lastCompleted && !active
        ? daysBetween(lastCompleted.endDate!, today())
        : null;

    // Calculate readiness
    const readiness = calculateReadiness(
        active ? null : lastDeploymentLength,
        active ? null : restPeriod
    );

    const buildHierarchy = () => {
        if (!allUnits) return [];

        const hierarchy: Unit[] = [];
        let current: Unit | undefined = unit;

        while (current) {
            hierarchy.unshift(current);
            current = allUnits.find(u => u.id === current?.parentId);
        }

        return hierarchy;
    };

    const getSubordinates = (unitId: string): Unit[] => {
        if (!allUnits) return [];
        return allUnits.filter(u => u.parentId === unitId);
    };

    const renderSubordinates = (parentUnit: Unit, depth: number = 0): React.ReactElement[] => {
        const subordinates = getSubordinates(parentUnit.id);
        const elements: React.ReactElement[] = [];

        subordinates.forEach(sub => {
            elements.push(
                <div
                    key={sub.id}
                    onClick={() => onSelectUnit(sub)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-md)',
                        paddingLeft: depth,
                        marginBottom: 'var(--spacing-sm)',
                        padding: 'var(--spacing-sm)',
                        background: 'var(--color-bg-tertiary)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border-primary)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--color-bg-elevated)';
                        e.currentTarget.style.borderColor = 'var(--color-accent-primary)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'var(--color-bg-tertiary)';
                        e.currentTarget.style.borderColor = 'var(--color-border-primary)';
                    }}
                >
                    <span style={{ color: 'var(--color-accent-primary)', fontSize: 12 }}>└─</span>
                    {sub.patch && (
                        <img
                            src={sub.patch}
                            alt={`${sub.name} patch`}
                            style={{
                                width: 32,
                                height: 32,
                                objectFit: 'contain',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--color-border-accent)'
                            }}
                        />
                    )}
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: sub.id === unit.id ? 'bold' : 'normal', fontSize: 13 }}>
                            {sub.name}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
                            {sub.echelon || sub.type}
                        </div>
                    </div>
                </div>
            );
            elements.push(...renderSubordinates(sub, depth + 20));
        });

        return elements;
    };

    const hierarchy = buildHierarchy();
    const subordinates = getSubordinates(unit.id);

    const handleTaskForceChange = async (taskForceId: string) => {
        await db.units.update(unit.id, { taskForceId: taskForceId || undefined });
    };

    return (
        <div style={{ display: 'grid', gap: 'var(--spacing-xl)' }}>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-xl)' }}>

                {/* Operational Status */}
                <div className="card">
                    <h3>Operational Status</h3>
                    <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
                        <InfoRow label="Status" value={unit.status} />
                        <InfoRow label="Type" value={unit.type} />
                        {unit.echelon && <InfoRow label="Echelon" value={unit.echelon} />}
                        {unit.country && <InfoRow label="Country" value={unit.country} />}

                        <div style={{ marginTop: 'var(--spacing-sm)' }}>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: 12, color: 'var(--color-text-muted)' }}>
                                Task Force Assignment
                            </label>
                            <select
                                className="input"
                                value={unit.taskForceId || ''}
                                onChange={e => handleTaskForceChange(e.target.value)}
                                style={{ width: '100%' }}
                            >
                                <option value="">No Task Force</option>
                                {taskForces?.map(tf => (
                                    <option key={tf.id} value={tf.id}>
                                        {tf.name}
                                    </option>
                                ))}
                            </select>
                            {unitTaskForce && (
                                <div style={{
                                    marginTop: 'var(--spacing-xs)',
                                    fontSize: 11,
                                    color: 'var(--color-accent-primary)'
                                }}>
                                    Currently assigned to: {unitTaskForce.name}
                                    {unitTaskForce.description && ` - ${unitTaskForce.description}`}
                                </div>
                            )}
                        </div>

                        <div style={{
                            marginTop: 'var(--spacing-sm)',
                            padding: 'var(--spacing-md)',
                            background: 'var(--color-bg-primary)',
                            borderRadius: 'var(--radius-sm)',
                            border: `2px solid ${readiness.color}`
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                                    Readiness
                                </span>
                                <span style={{
                                    fontSize: 16,
                                    fontWeight: 700,
                                    color: readiness.color,
                                    fontFamily: 'JetBrains Mono',
                                    textTransform: 'uppercase'
                                }}>
                                    {readiness.label}
                                </span>
                            </div>
                            {readiness.ratio > 0 && readiness.ratio < 10 && (
                                <div style={{
                                    marginTop: 'var(--spacing-sm)',
                                    fontSize: 11,
                                    color: 'var(--color-text-muted)'
                                }}>
                                    Rest/Deploy Ratio: {readiness.ratio.toFixed(2)}:1
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Deployment Metrics */}
                <div className="card">
                    <h3>Deployment Metrics</h3>
                    <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
                        {active ? (
                            <>
                                <InfoRow
                                    label="Current Status"
                                    value="Deployed"
                                    valueColor="var(--color-status-deployed)"
                                />
                                <InfoRow
                                    label="Current Deployment"
                                    value={`${currentDeploymentLength} days`}
                                    valueColor="var(--color-accent-primary)"
                                />
                                <InfoRow
                                    label="Operation"
                                    value={active.operation || active.name}
                                />
                            </>
                        ) : (
                            <>
                                <InfoRow
                                    label="Current Status"
                                    value="Available"
                                    valueColor="var(--color-status-standby)"
                                />
                                {lastDeploymentLength && (
                                    <InfoRow
                                        label="Last Deployment"
                                        value={`${lastDeploymentLength} days`}
                                        valueColor="var(--color-text-secondary)"
                                    />
                                )}
                                {restPeriod !== null && (
                                    <InfoRow
                                        label="Rest Period"
                                        value={`${restPeriod} days`}
                                        valueColor="var(--color-accent-secondary)"
                                    />
                                )}
                                {!lastCompleted && (
                                    <div style={{
                                        padding: 'var(--spacing-md)',
                                        textAlign: 'center',
                                        color: 'var(--color-text-muted)',
                                        fontSize: 12
                                    }}>
                                        No deployment history
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

            </div>

            {/* Unit Hierarchy */}
            {hierarchy.length > 1 && (
                <div className="card">
                    <h3>Chain of Command</h3>
                    <div style={{ marginTop: 'var(--spacing-lg)' }}>
                        {hierarchy.map((u, index) => (
                            <div
                                key={u.id}
                                onClick={() => u.id !== unit.id && onSelectUnit(u)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--spacing-md)',
                                    paddingLeft: index * 20,
                                    marginBottom: 'var(--spacing-sm)',
                                    padding: 'var(--spacing-sm)',
                                    background: u.id === unit.id ? 'var(--color-bg-elevated)' : 'var(--color-bg-tertiary)',
                                    borderRadius: 'var(--radius-sm)',
                                    border: u.id === unit.id ? '1px solid var(--color-accent-primary)' : '1px solid var(--color-border-primary)',
                                    cursor: u.id !== unit.id ? 'pointer' : 'default',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    if (u.id !== unit.id) {
                                        e.currentTarget.style.background = 'var(--color-bg-elevated)';
                                        e.currentTarget.style.borderColor = 'var(--color-accent-primary)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (u.id !== unit.id) {
                                        e.currentTarget.style.background = 'var(--color-bg-tertiary)';
                                        e.currentTarget.style.borderColor = 'var(--color-border-primary)';
                                    }
                                }}
                            >
                                {index > 0 && (
                                    <span style={{ color: 'var(--color-accent-primary)', fontSize: 12 }}>└─</span>
                                )}
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
                                <div>
                                    <div style={{ fontWeight: u.id === unit.id ? 'bold' : 'normal', fontSize: 13 }}>
                                        {u.name}
                                    </div>
                                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
                                        {u.echelon || u.type}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Subordinate Units */}
            {subordinates.length > 0 && (
                <div className="card">
                    <h3>Subordinate Units</h3>
                    <div style={{ marginTop: 'var(--spacing-lg)' }}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-md)',
                                marginBottom: 'var(--spacing-md)',
                                padding: 'var(--spacing-sm)',
                                background: 'var(--color-bg-elevated)',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--color-accent-primary)'
                            }}
                        >
                            {unit.patch && (
                                <img
                                    src={unit.patch}
                                    alt={`${unit.name} patch`}
                                    style={{
                                        width: 32,
                                        height: 32,
                                        objectFit: 'contain',
                                        borderRadius: 'var(--radius-sm)',
                                        border: '1px solid var(--color-border-accent)'
                                    }}
                                />
                            )}
                            <div>
                                <div style={{ fontWeight: 'bold', fontSize: 13 }}>
                                    {unit.name}
                                </div>
                                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
                                    {unit.echelon || unit.type}
                                </div>
                            </div>
                        </div>
                        {renderSubordinates(unit, 20)}
                    </div>
                </div>
            )}

        </div>
    );
}

function InfoRow({ label, value, valueColor }: any) {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 'var(--spacing-sm)',
            background: 'var(--color-bg-tertiary)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 13
        }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
            <span style={{
                fontWeight: 600,
                fontFamily: 'JetBrains Mono',
                color: valueColor || 'var(--color-text-primary)'
            }}>
                {value}
            </span>
        </div>
    );
}

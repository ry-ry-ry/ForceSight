import { db, useLiveData } from '../database/adapter';
import { getHealthColor, getEffectivePatch } from '../utils';

interface Props {
    base: any;
    onEdit: () => void;
    onSelectUnit: (unit: any) => void;
}

export default function BasePanel({ base, onEdit, onSelectUnit }: Props) {
    const allUnits = useLiveData(() => db.units.toArray(), []);

    // Get tenant units (units stationed at this base)
    const tenantUnits = allUnits?.filter((u: any) => u.baseId === base.id && u.type !== 'Base') || [];

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            {/* BASE HEADER */}
            <div className="card" style={{ marginBottom: 'var(--spacing-xl)', textAlign: 'center' }}>
                <h1 style={{
                    fontSize: 36,
                    marginBottom: 'var(--spacing-sm)',
                    color: 'var(--color-accent-primary)'
                }}>
                    {base.name}
                </h1>

                {base.location && (
                    <div style={{
                        fontSize: 16,
                        color: 'var(--color-text-secondary)',
                        marginBottom: 'var(--spacing-md)'
                    }}>
                        {base.location}
                    </div>
                )}

                {base.country && (
                    <div style={{
                        fontSize: 14,
                        color: 'var(--color-text-muted)',
                        marginBottom: 'var(--spacing-sm)'
                    }}>
                        {base.country}
                    </div>
                )}

                {/* Health Badge */}
                {base.health && (
                    <div style={{ marginBottom: 'var(--spacing-md)' }}>
                        <span style={{
                            padding: '6px 16px',
                            borderRadius: 'var(--radius-sm)',
                            background: `${getHealthColor(base.health)}20`,
                            color: getHealthColor(base.health),
                            border: `1px solid ${getHealthColor(base.health)}40`,
                            textTransform: 'uppercase',
                            fontWeight: 600,
                            fontSize: 12,
                            letterSpacing: '1px'
                        }}>
                            {base.health}
                        </span>
                    </div>
                )}

                {/* Base Photograph */}
                {base.patch && (
                    <div style={{
                        marginTop: 'var(--spacing-xl)',
                        marginBottom: 'var(--spacing-xl)',
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <img
                            src={base.patch}
                            alt={`${base.name}`}
                            style={{
                                maxWidth: '100%',
                                width: '100%',
                                maxHeight: 600,
                                objectFit: 'cover',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--color-border-primary)',
                                boxShadow: '0 8px 40px rgba(0,0,0,0.4)'
                            }}
                        />
                    </div>
                )}

                <div style={{ marginTop: 'var(--spacing-lg)' }}>
                    <button onClick={onEdit}>
                        Edit Base
                    </button>
                </div>
            </div>

            {/* TENANT UNITS */}
            <div className="card">
                <h2 style={{
                    fontSize: 18,
                    marginBottom: 'var(--spacing-md)',
                    color: 'var(--color-accent-primary)'
                }}>
                    Tenant Units ({tenantUnits.length})
                </h2>

                {tenantUnits.length === 0 ? (
                    <div style={{
                        padding: 'var(--spacing-xl)',
                        textAlign: 'center',
                        color: 'var(--color-text-muted)',
                        fontSize: 14
                    }}>
                        No units stationed at this base.
                        <br />
                        <span style={{ fontSize: 12 }}>Edit units to assign them to this base.</span>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: 'var(--spacing-sm)'
                    }}>
                        {tenantUnits.map((unit: any) => (
                            <div
                                key={unit.id}
                                onClick={() => onSelectUnit(unit)}
                                style={{
                                    padding: 'var(--spacing-md)',
                                    background: 'var(--color-bg-tertiary)',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '1px solid var(--color-border-primary)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--spacing-sm)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--color-accent-primary)';
                                    e.currentTarget.style.background = 'var(--color-bg-elevated)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--color-border-primary)';
                                    e.currentTarget.style.background = 'var(--color-bg-tertiary)';
                                }}
                            >
                                {getEffectivePatch(unit, allUnits) && (
                                    <img
                                        src={getEffectivePatch(unit, allUnits)}
                                        alt={unit.name}
                                        style={{
                                            width: 40,
                                            height: 40,
                                            objectFit: 'contain',
                                            borderRadius: 'var(--radius-sm)',
                                            border: '1px solid var(--color-border-primary)',
                                            flexShrink: 0
                                        }}
                                    />
                                )}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        fontWeight: 600,
                                        fontSize: 14,
                                        marginBottom: 2
                                    }}>
                                        {unit.name}
                                    </div>
                                    <div style={{
                                        fontSize: 12,
                                        color: 'var(--color-text-muted)'
                                    }}>
                                        {unit.echelon || unit.type}
                                        {unit.status && ` • ${unit.status}`}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
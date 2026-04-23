import { db, useLiveData } from '../database/adapter';
import { useEffect, useState } from 'react';
import { calculateRotationStatus } from '../utils';
import { UnitIcon } from './UnitIcon';
import { getConfig, DEFAULT_CLOCKS, type DashboardClock } from '../database/config';

export default function Dashboard({ onSelectUnit }: any) {
    const units = useLiveData(() => db.units.toArray(), []);
    const deployments = useLiveData(() => db.deployments.toArray(), []);
    const customSymbols = useLiveData(() => db.natoSymbols.toArray(), []);
    const [time, setTime] = useState(new Date());

    const config = getConfig();
    const clocks: DashboardClock[] = config.dashboardClocks || DEFAULT_CLOCKS;

    useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTimeForTimezone = (timezone: string): string => {
        const opts: Intl.DateTimeFormatOptions = { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
        if (timezone === 'local') return time.toLocaleTimeString('en-GB', opts);
        try { return time.toLocaleTimeString('en-GB', { ...opts, timeZone: timezone }); }
        catch { return time.toLocaleTimeString('en-GB', opts); }
    };

    const formatDateForTimezone = (timezone: string): string => {
        const opts: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
        if (timezone === 'local') return time.toLocaleDateString('en-GB', opts).toUpperCase();
        try { return time.toLocaleDateString('en-GB', { ...opts, timeZone: timezone }).toUpperCase(); }
        catch { return time.toLocaleDateString('en-GB', opts).toUpperCase(); }
    };

    const stats = {
        totalUnits: units?.length || 0,
        deployed: units?.filter(u => u.status === 'Deployed').length || 0,
        standby: units?.filter(u => u.status === 'Standby').length || 0,
        training: units?.filter(u => u.status === 'Training').length || 0,
        activeDeployments: deployments?.filter(d => !d.endDate).length || 0,
    };
    const reset = Math.max(0, stats.totalUnits - stats.deployed - stats.standby - stats.training);

    const rotationNeeds = units?.map(unit => {
        const activeDeployment = deployments?.find(d => d.unitId === unit.id && !d.endDate);
        if (!activeDeployment) return null;
        const rotationStatus = calculateRotationStatus(unit.type, activeDeployment.startDate);
        return { unit, deployment: activeDeployment, rotationStatus };
    }).filter(Boolean).sort((a, b) => {
        const priDiff = a!.rotationStatus.priority - b!.rotationStatus.priority;
        if (priDiff !== 0) return priDiff;
        return b!.rotationStatus.daysDeployed - a!.rotationStatus.daysDeployed;
    }) || [];

    const recentUnits = units?.slice(-6).reverse() || [];

    return (
        <div
            className="animate-fade-in"
            style={{
                padding: 'clamp(24px, 3vw, 56px) clamp(24px, 4vw, 72px)',
                maxWidth: 1480,
                margin: '0 auto',
                position: 'relative',
                zIndex: 1,
            }}
        >
            {/* ══════════════════════════════ MASTHEAD ══════════════════════════════ */}
            <header style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'end', gap: 'var(--spacing-2xl)' }}>
                <div>
                    <div style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        letterSpacing: '0.25em',
                        color: 'var(--muted-soft)',
                        textTransform: 'uppercase',
                        marginBottom: 6,
                    }}>
                        Ref. FS&nbsp;·&nbsp;SECTION 01
                    </div>
                    <h1 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(44px, 4.6vw + 8px, 72px)',
                        fontWeight: 700,
                        letterSpacing: '0.03em',
                        lineHeight: 0.95,
                        color: 'var(--fore)',
                        margin: 0,
                    }}>
                        Forcesight
                    </h1>
                    <div style={{
                        marginTop: 10,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-md)',
                        fontSize: 12,
                        color: 'var(--muted)',
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                    }}>
                        <span>Operations Reference</span>
                        <span aria-hidden style={{ display: 'inline-block', width: 36, height: 2, background: 'var(--brass)' }} />
                        <span>Current Standing</span>
                    </div>
                </div>

                {/* Clock strip — tabular, hairline-separated, zero chrome */}
                <div style={{
                    display: 'flex',
                    alignItems: 'stretch',
                    borderTop: '1px solid var(--rule)',
                    borderBottom: '1px solid var(--rule)',
                    padding: '10px 0',
                }}>
                    {clocks.map((clock, i) => (
                        <div key={clock.id} style={{
                            paddingInline: 'var(--spacing-xl)',
                            borderLeft: i === 0 ? 'none' : '1px solid var(--rule)',
                            textAlign: i === 0 ? 'left' : 'center',
                            minWidth: 0,
                        }}>
                            <div style={{
                                fontSize: 10,
                                fontFamily: 'var(--font-mono)',
                                letterSpacing: '0.22em',
                                color: 'var(--muted-soft)',
                                textTransform: 'uppercase',
                                marginBottom: 4,
                            }}>
                                {clock.name}
                            </div>
                            <div className="num" style={{
                                fontSize: 22,
                                fontWeight: 500,
                                color: 'var(--fore)',
                                letterSpacing: '0.04em',
                            }}>
                                {formatTimeForTimezone(clock.timezone)}
                            </div>
                            <div className="num" style={{
                                fontSize: 10,
                                color: 'var(--muted)',
                                letterSpacing: '0.14em',
                                marginTop: 2,
                            }}>
                                {formatDateForTimezone(clock.timezone)}
                            </div>
                        </div>
                    ))}
                </div>
            </header>

            {/* ══════════════════════════════ FORCE STANDING ═════════════════════════════ */}
            <section style={{ marginTop: 'var(--spacing-3xl)' }}>
                <SectionHead eyebrow="I." title="Force Standing" subtitle="As recorded at the top of this page load." />

                <div style={{
                    marginTop: 'var(--spacing-lg)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
                    borderTop: '1px solid var(--rule)',
                    borderBottom: '1px solid var(--rule)',
                }}>
                    <Counter label="Total Units"      value={stats.totalUnits}        />
                    <Counter label="Deployed"          value={stats.deployed}          status="deployed" first={false} />
                    <Counter label="On Standby"        value={stats.standby}           status="standby"  first={false} />
                    <Counter label="In Training"       value={stats.training}          status="training" first={false} />
                    <Counter label="Active Operations" value={stats.activeDeployments} status="brass"    first={false} />
                </div>
            </section>

            {/* ══════════════════════════════ ROTATION STATUS ════════════════════════════ */}
            <section style={{ marginTop: 'var(--spacing-3xl)' }}>
                <SectionHead
                    eyebrow="II."
                    title="Rotation Status"
                    subtitle={rotationNeeds.length > 0
                        ? `${rotationNeeds.length} active deployment${rotationNeeds.length === 1 ? '' : 's'}, grouped by urgency.`
                        : 'No units currently deployed.'}
                />

                {rotationNeeds.length === 0 ? (
                    <EmptyNotice>All stations nominal — no active deployments to rotate.</EmptyNotice>
                ) : (
                    <RotationBuckets
                        rows={rotationNeeds}
                        onSelectUnit={onSelectUnit}
                        allUnits={units}
                        customSymbols={customSymbols}
                    />
                )}
            </section>

            {/* ══════════════════════════════ RECENT & DISTRIBUTION ══════════════════════ */}
            <section style={{
                marginTop: 'var(--spacing-3xl)',
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
                gap: 'clamp(32px, 4vw, 64px)',
            }}>
                {/* Recent Entries */}
                <div>
                    <SectionHead eyebrow="III." title="Recent Entries" subtitle="Last six units filed." />
                    <div style={{ marginTop: 'var(--spacing-lg)', borderTop: '1px solid var(--rule)' }}>
                        {recentUnits.length === 0 ? (
                            <EmptyNotice>No units on file.</EmptyNotice>
                        ) : (
                            recentUnits.map((unit) => (
                                <button
                                    key={unit.id}
                                    onClick={() => onSelectUnit(unit)}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'auto 1fr auto',
                                        alignItems: 'center',
                                        gap: 'var(--spacing-md)',
                                        width: '100%',
                                        textAlign: 'left',
                                        padding: '10px 4px',
                                        background: 'transparent',
                                        border: 0,
                                        borderBottom: '1px solid var(--rule)',
                                        color: 'var(--fore)',
                                        textTransform: 'none',
                                        letterSpacing: 0,
                                        cursor: 'pointer',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'oklch(from var(--brass) 40% 0.06 h / 0.06)';
                                        (e.currentTarget.querySelector('[data-rowmark]') as HTMLElement).style.background = 'var(--brass)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'transparent';
                                        (e.currentTarget.querySelector('[data-rowmark]') as HTMLElement).style.background = 'transparent';
                                    }}
                                >
                                    <span data-rowmark style={{
                                        width: 2,
                                        height: 22,
                                        background: 'transparent',
                                        transition: 'background 120ms ease-out',
                                        marginRight: 6,
                                    }} />
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                                        <UnitIcon unit={unit} allUnits={units} customSymbols={customSymbols} size="small" />
                                        <span style={{ minWidth: 0 }}>
                                            <span style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--fore)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {unit.name}
                                            </span>
                                            <span style={{ display: 'block', fontSize: 11, color: 'var(--muted)' }}>
                                                {unit.echelon || unit.type}
                                            </span>
                                        </span>
                                    </span>
                                    <StatusToken status={unit.status} />
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Distribution */}
                <div>
                    <SectionHead eyebrow="IV." title="Distribution" subtitle="Share of the total force by current status." />
                    <div style={{ marginTop: 'var(--spacing-lg)', borderTop: '1px solid var(--rule)' }}>
                        <DistributionRow label="Deployed" value={stats.deployed}  total={stats.totalUnits} tone="deployed" />
                        <DistributionRow label="Standby"  value={stats.standby}   total={stats.totalUnits} tone="standby"  />
                        <DistributionRow label="Training" value={stats.training}  total={stats.totalUnits} tone="training" />
                        <DistributionRow label="Reset"    value={reset}           total={stats.totalUnits} tone="reset"    />
                    </div>
                </div>
            </section>
        </div>
    );
}

/* ══════════════════════════════ Section parts ══════════════════════════════ */

function SectionHead({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: 'var(--spacing-lg)', alignItems: 'baseline' }}>
            <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: '0.08em',
                color: 'var(--brass)',
                paddingTop: 6,
            }}>
                {eyebrow}
            </span>
            <div>
                <h2 style={{
                    fontSize: 'clamp(22px, 1.4vw + 12px, 28px)',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    margin: 0,
                    color: 'var(--fore)',
                }}>
                    {title}
                </h2>
                {subtitle && (
                    <div style={{
                        marginTop: 4,
                        fontSize: 12,
                        color: 'var(--muted)',
                        letterSpacing: '0.04em',
                    }}>
                        {subtitle}
                    </div>
                )}
            </div>
        </div>
    );
}

function Counter({ label, value, status, first }: { label: string; value: number; status?: 'deployed' | 'standby' | 'training' | 'brass'; first?: boolean }) {
    const colorMap: Record<string, string> = {
        deployed: 'var(--status-deployed)',
        standby:  'var(--status-standby)',
        training: 'var(--status-training)',
        brass:    'var(--brass)',
    };
    const tint = status ? colorMap[status] : 'var(--fore)';

    return (
        <div style={{
            padding: '22px 24px',
            borderLeft: first === false ? '1px solid var(--rule)' : 'none',
            minWidth: 0,
        }}>
            <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: '0.22em',
                color: 'var(--muted)',
                textTransform: 'uppercase',
                marginBottom: 8,
            }}>
                {label}
            </div>
            <div className="num" style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(32px, 2.4vw + 10px, 44px)',
                fontWeight: 500,
                color: tint,
                letterSpacing: '0.02em',
                lineHeight: 1,
            }}>
                {value.toString().padStart(2, '0')}
            </div>
        </div>
    );
}

/* ─── Rotation variants ────────────────────────────────────────────────────── */

const ROTATION_STATE_COLOR: Record<string, string> = {
    overdue: 'var(--status-deployed)',
    urgent:  'var(--status-training)',
    soon:    'var(--brass)',
    ok:      'var(--status-standby)',
};

const SCROLL_BOX: React.CSSProperties = {
    marginTop: 'var(--spacing-md)',
    maxHeight: 420,
    overflowY: 'auto',
    borderTop: '1px solid var(--rule)',
    borderBottom: '1px solid var(--rule)',
    // A subtle inset to signal there's scroll-under content.
    boxShadow: 'inset 0 -14px 14px -14px oklch(0% 0 0 / 0.45), inset 0 14px 14px -14px oklch(0% 0 0 / 0.45)',
};

function RotationBuckets({ rows, onSelectUnit, allUnits, customSymbols }: any) {
    const buckets: Array<{ key: string; title: string }> = [
        { key: 'overdue', title: 'Overdue' },
        { key: 'urgent',  title: 'Urgent'  },
        { key: 'soon',    title: 'Soon'    },
        { key: 'ok',      title: 'Nominal' },
    ];

    const grouped: Record<string, any[]> = { overdue: [], urgent: [], soon: [], ok: [] };
    for (const r of rows) grouped[r.rotationStatus.status].push(r);

    return (
        <div style={SCROLL_BOX}>
            {buckets.map(b => {
                const items = grouped[b.key];
                if (!items || items.length === 0) return null;
                const color = ROTATION_STATE_COLOR[b.key];
                return (
                    <div key={b.key}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            padding: '12px 14px',
                            background: 'oklch(from var(--paper-1) calc(l - 0.01) c h)',
                            borderBottom: '1px solid var(--rule)',
                            position: 'sticky',
                            top: 0,
                            zIndex: 1,
                        }}>
                            <span aria-hidden style={{ width: 10, height: 10, background: color, boxShadow: 'inset 0 0 0 1px oklch(0% 0 0 / 0.45)' }} />
                            <span style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: 13,
                                fontWeight: 700,
                                letterSpacing: '0.18em',
                                textTransform: 'uppercase',
                                color: color,
                            }}>
                                {b.title}
                            </span>
                            <span className="num" style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 'auto' }}>
                                {items.length} unit{items.length === 1 ? '' : 's'}
                            </span>
                        </div>

                        {items.map((item: any) => {
                            const { unit, deployment, rotationStatus } = item;
                            const parentUnit = allUnits?.find((u: any) => u.id === unit.parentId);
                            const days = rotationStatus.daysUntilRotation;
                            const label =
                                rotationStatus.status === 'overdue' ? `${Math.abs(days)}d over` :
                                `${days}d left`;

                            return (
                                <div
                                    key={unit.id}
                                    onClick={() => onSelectUnit(unit)}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'auto 1fr auto auto',
                                        alignItems: 'center',
                                        gap: 14,
                                        padding: '10px 14px',
                                        borderBottom: '1px solid var(--rule)',
                                        cursor: 'pointer',
                                        transition: 'background 120ms ease-out',
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = 'oklch(from var(--brass) 40% 0.06 h / 0.06)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                                >
                                    <UnitIcon unit={unit} allUnits={allUnits} customSymbols={customSymbols} size="small" />
                                    <div style={{ minWidth: 0 }}>
                                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--fore)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {unit.name}
                                        </div>
                                        <div style={{ fontSize: 11, color: 'var(--muted)', display: 'flex', gap: 8 }}>
                                            <span>{unit.echelon || unit.type}</span>
                                            {parentUnit && (
                                                <>
                                                    <span style={{ color: 'var(--muted-soft)' }}>·</span>
                                                    <span style={{ color: 'var(--fore-dim)' }}>{parentUnit.name}</span>
                                                </>
                                            )}
                                            <span style={{ color: 'var(--muted-soft)' }}>·</span>
                                            <span style={{ color: 'var(--fore-dim)' }}>{deployment.operation || deployment.name}</span>
                                        </div>
                                    </div>
                                    <div className="num" style={{ fontSize: 13, fontWeight: 500, color: 'var(--fore)', textAlign: 'right' }}>
                                        {rotationStatus.daysDeployed}
                                        <span style={{ color: 'var(--muted-soft)' }}> / {rotationStatus.rotationThreshold}</span>
                                    </div>
                                    <div style={{
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: 11,
                                        color: color,
                                        letterSpacing: '0.08em',
                                        minWidth: 70,
                                        textAlign: 'right',
                                    }}>
                                        {label}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
}

/* ─── Distribution ─────────────────────────────────────────────────────────── */

function DistributionRow({ label, value, total, tone }: { label: string; value: number; total: number; tone: 'deployed' | 'standby' | 'training' | 'reset' }) {
    const pct = total > 0 ? (value / total) * 100 : 0;
    const color: Record<string, string> = {
        deployed: 'var(--status-deployed)',
        standby:  'var(--status-standby)',
        training: 'var(--status-training)',
        reset:    'var(--status-reset)',
    };

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: '100px 1fr auto',
            gap: 'var(--spacing-md)',
            alignItems: 'center',
            padding: '14px 0',
            borderBottom: '1px solid var(--rule)',
        }}>
            <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--fore-dim)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
            }}>
                <span aria-hidden style={{ width: 8, height: 8, background: color[tone], boxShadow: 'inset 0 0 0 1px oklch(0% 0 0 / 0.45)' }} />
                {label}
            </div>
            <div style={{ position: 'relative', height: 2, background: 'var(--rule)' }}>
                <span style={{ position: 'absolute', inset: 0, width: `${pct}%`, background: color[tone] }} />
            </div>
            <div className="num" style={{
                fontSize: 12,
                color: 'var(--fore)',
                minWidth: 56,
                textAlign: 'right',
            }}>
                {value} / {total}
            </div>
        </div>
    );
}

/* ─── Shared ───────────────────────────────────────────────────────────────── */

function StatusToken({ status }: { status: string }) {
    const map: Record<string, { color: string; label: string }> = {
        Deployed: { color: 'var(--status-deployed)', label: 'Deployed' },
        Standby:  { color: 'var(--status-standby)',  label: 'Standby'  },
        Training: { color: 'var(--status-training)', label: 'Training' },
        Reset:    { color: 'var(--status-reset)',    label: 'Reset'    },
    };
    const s = map[status] || { color: 'var(--muted)', label: status };
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span aria-hidden style={{ width: 7, height: 7, background: s.color, boxShadow: 'inset 0 0 0 1px oklch(0% 0 0 / 0.45)' }} />
            <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: s.color,
            }}>
                {s.label}
            </span>
        </span>
    );
}

function EmptyNotice({ children }: { children: React.ReactNode }) {
    return (
        <div style={{
            marginTop: 'var(--spacing-lg)',
            paddingBlock: 'var(--spacing-2xl)',
            borderTop: '1px solid var(--rule)',
            borderBottom: '1px solid var(--rule)',
            fontSize: 13,
            color: 'var(--muted)',
            fontStyle: 'italic',
            textAlign: 'center',
        }}>
            {children}
        </div>
    );
}

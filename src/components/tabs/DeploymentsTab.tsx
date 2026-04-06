import { db, useLiveData } from '../../database/adapter';
import type { Unit } from '../../database/types';
import { today, daysBetween, militaryNameCompare } from '../../utils';
import { useState } from 'react';
import { UnitIcon } from '../UnitIcon';

export default function DeploymentsTab({ unit }: any) {
    const [editing, setEditing] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);

    const deployments = useLiveData(
        () => db.deployments.where('unitId').equals(unit.id).sortBy('startDate'),
        [unit.id]
    );

    const operations = useLiveData(() => db.operations.toArray(), []);
    const allUnits = useLiveData(() => db.units.toArray(), []);

    const handleCreate = () => {
        setCreating(true);
    };

    const handleEdit = (id: string) => {
        setEditing(id);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Delete this deployment?')) {
            await db.deployments.delete(id);
        }
    };

    return (
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                    <h3>Deployment History</h3>
                    <button onClick={handleCreate}>+ Add Deployment</button>
                </div>

                {creating && (
                    <DeploymentForm
                        unitId={unit.id}
                        operations={operations}
                        allUnits={allUnits}
                        onDone={() => setCreating(false)}
                    />
                )}

                <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                    {deployments?.map(d => (
                        editing === d.id ? (
                            <DeploymentForm
                                key={d.id}
                                deployment={d}
                                unitId={unit.id}
                                operations={operations}
                                allUnits={allUnits}
                                onDone={() => setEditing(null)}
                            />
                        ) : (
                            <DeploymentCard
                                key={d.id}
                                deployment={d}
                                operations={operations}
                                onEdit={() => handleEdit(d.id)}
                                onDelete={() => handleDelete(d.id)}
                            />
                        )
                    ))}

                    {!deployments?.length && !creating && (
                        <div style={{
                            textAlign: 'center',
                            padding: 'var(--spacing-2xl)',
                            color: 'var(--color-text-muted)',
                            fontSize: 13
                        }}>
                            No deployments recorded
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function DeploymentCard({ deployment, operations, onEdit, onDelete }: any) {
    const duration = deployment.endDate
        ? daysBetween(deployment.startDate, deployment.endDate)
        : daysBetween(deployment.startDate, today());

    const isActive = !deployment.endDate;
    const linkedOperation = operations?.find((op: any) => op.id === deployment.operationId);

    return (
        <div style={{
            padding: 'var(--spacing-lg)',
            background: 'var(--color-bg-tertiary)',
            border: isActive ? '1px solid var(--color-accent-primary)' : '1px solid var(--color-border-primary)',
            borderRadius: 'var(--radius-md)',
            position: 'relative'
        }}>
            {isActive && (
                <div style={{
                    position: 'absolute',
                    top: 'var(--spacing-sm)',
                    right: 'var(--spacing-sm)',
                    padding: '4px 8px',
                    background: 'var(--color-status-deployed)',
                    color: 'white',
                    fontSize: 11,
                    fontWeight: 600,
                    borderRadius: 'var(--radius-sm)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    Active
                </div>
            )}

            <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <h3 style={{ fontSize: 16, marginBottom: 'var(--spacing-xs)' }}>
                    {deployment.name}
                </h3>
                {deployment.operation && (
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                        Operation: {deployment.operation}
                    </div>
                )}
                {linkedOperation && (
                    <div style={{
                        fontSize: 12,
                        color: 'var(--color-accent-primary)',
                        marginTop: 4
                    }}>
                        Linked to: {linkedOperation.name} ({linkedOperation.type})
                    </div>
                )}
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: 'var(--spacing-md)',
                marginBottom: 'var(--spacing-md)'
            }}>
                <div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>
                        Start Date
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                        {deployment.startDate}
                    </div>
                </div>
                <div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>
                        End Date
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                        {deployment.endDate || 'Ongoing'}
                    </div>
                </div>
                <div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>
                        Duration
                    </div>
                    <div style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 13,
                        color: 'var(--color-accent-primary)'
                    }}>
                        {duration} days
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                <button onClick={onEdit} style={{ fontSize: 12 }}>Edit</button>
                <button
                    onClick={onDelete}
                    style={{
                        fontSize: 12,
                        background: 'var(--color-bg-primary)',
                        borderColor: 'var(--color-border-accent)'
                    }}
                >
                    Delete
                </button>
            </div>
        </div>
    );
}

// ── Subordinate unit picker ──────────────────────────────────────────

/** Recursively collect all descendant units of a given parent */
function getAllDescendants(parentId: string, allUnits: Unit[]): Unit[] {
    const direct = allUnits
        .filter(u => u.parentId === parentId)
        .sort((a, b) => militaryNameCompare(a.name, b.name));
    const result: Unit[] = [];
    for (const child of direct) {
        result.push(child);
        result.push(...getAllDescendants(child.id, allUnits));
    }
    return result;
}

/** Render a recursive, indented tree of subordinate units with checkboxes and patches */
function SubordinateTree({ parentId, allUnits, selectedIds, onToggle, depth = 0 }: {
    parentId: string;
    allUnits: Unit[];
    selectedIds: Set<string>;
    onToggle: (id: string) => void;
    depth?: number;
}) {
    const children = allUnits
        .filter(u => u.parentId === parentId)
        .sort((a, b) => militaryNameCompare(a.name, b.name));

    if (children.length === 0) return null;

    return (
        <>
            {children.map(sub => {
                const hasChildren = allUnits.some(u => u.parentId === sub.id);
                return (
                    <div key={sub.id} style={{ paddingLeft: depth }}>
                        <label
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-sm)',
                                padding: '6px var(--spacing-sm)',
                                background: hasChildren ? 'var(--color-bg-elevated)' : 'var(--color-bg-tertiary)',
                                borderRadius: 'var(--radius-sm)',
                                border: `1px solid ${hasChildren ? 'var(--color-border-accent)' : 'var(--color-border-primary)'}`,
                                cursor: 'pointer',
                                marginBottom: 3,
                                transition: 'all 0.15s ease',
                                userSelect: 'none'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.borderColor = 'var(--color-accent-primary)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = hasChildren
                                    ? 'var(--color-border-accent)'
                                    : 'var(--color-border-primary)';
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={selectedIds.has(sub.id)}
                                onChange={() => onToggle(sub.id)}
                                style={{ accentColor: 'var(--color-accent-primary)', flexShrink: 0 }}
                            />
                            <span style={{ color: 'var(--color-accent-primary)', fontSize: 12, flexShrink: 0 }}>└─</span>
                            <UnitIcon
                                unit={sub}
                                allUnits={allUnits}
                                size="small"
                            />
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: hasChildren ? 600 : 'normal', fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {sub.name}
                                </div>
                                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 1 }}>
                                    {sub.echelon || sub.type}
                                </div>
                            </div>
                        </label>
                        {hasChildren && (
                            <SubordinateTree
                                parentId={sub.id}
                                allUnits={allUnits}
                                selectedIds={selectedIds}
                                onToggle={onToggle}
                                depth={depth + 20}
                            />
                        )}
                    </div>
                );
            })}
        </>
    );
}

// ── Deployment Form ──────────────────────────────────────────────────

function DeploymentForm({ deployment, unitId, operations, allUnits, onDone }: any) {
    const [name, setName] = useState(deployment?.name || '');
    const [operation, setOperation] = useState(deployment?.operation || '');
    const [operationId, setOperationId] = useState(deployment?.operationId || '');
    const [startDate, setStartDate] = useState(deployment?.startDate || today());
    const [endDate, setEndDate] = useState(deployment?.endDate || '');

    // Subordinate unit selection
    const [applyToSubordinates, setApplyToSubordinates] = useState(false);
    const [selectedSubIds, setSelectedSubIds] = useState<Set<string>>(new Set());

    const subordinates = allUnits ? getAllDescendants(unitId, allUnits) : [];
    const hasSubordinates = subordinates.length > 0;

    const handleToggle = (id: string) => {
        setSelectedSubIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleSelectAll = () => {
        if (selectedSubIds.size === subordinates.length) {
            setSelectedSubIds(new Set());
        } else {
            setSelectedSubIds(new Set(subordinates.map(u => u.id)));
        }
    };

    const handleSave = async () => {
        const baseDeployment = {
            name,
            operation: operation || undefined,
            operationId: operationId || undefined,
            startDate,
            endDate: endDate || undefined
        };

        // Save for the current unit
        await db.deployments.put({
            id: deployment?.id || crypto.randomUUID(),
            unitId,
            ...baseDeployment
        });

        // Save for selected subordinate units (only on create, not edit)
        if (!deployment && applyToSubordinates && selectedSubIds.size > 0) {
            const subordinateDeployments = Array.from(selectedSubIds).map(subUnitId => ({
                id: crypto.randomUUID(),
                unitId: subUnitId,
                ...baseDeployment
            }));
            await db.deployments.bulkPut(subordinateDeployments);
        }

        onDone();
    };

    return (
        <div style={{
            padding: 'var(--spacing-lg)',
            background: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border-accent)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--spacing-md)'
        }}>
            <h3 style={{ fontSize: 16, marginBottom: 'var(--spacing-lg)' }}>
                {deployment ? 'Edit Deployment' : 'New Deployment'}
            </h3>

            <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: 12, color: 'var(--color-text-muted)' }}>
                        Deployment Name
                    </label>
                    <input
                        className="input"
                        placeholder="e.g., OIR Rotation 24-1"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: 12, color: 'var(--color-text-muted)' }}>
                        Operational Assignment (Optional)
                    </label>
                    <input
                        className="input"
                        placeholder="e.g., Operation Inherent Resolve"
                        value={operation}
                        onChange={e => setOperation(e.target.value)}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: 12, color: 'var(--color-text-muted)' }}>
                        Link to Operation (Optional)
                    </label>
                    <select
                        className="input"
                        value={operationId}
                        onChange={e => setOperationId(e.target.value)}
                        style={{ width: '100%' }}
                    >
                        <option value="">No linked operation</option>
                        {operations?.map((op: any) => (
                            <option key={op.id} value={op.id}>
                                {op.name} ({op.type})
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: 6, fontSize: 12, color: 'var(--color-text-muted)' }}>
                            Start Date
                        </label>
                        <input
                            className="input"
                            type="date"
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: 6, fontSize: 12, color: 'var(--color-text-muted)' }}>
                            End Date (Leave empty if ongoing)
                        </label>
                        <input
                            className="input"
                            type="date"
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                        />
                    </div>
                </div>

                {/* Subordinate unit application — only shown on create, and only if unit has subordinates */}
                {!deployment && hasSubordinates && (
                    <div style={{
                        borderTop: '1px solid var(--color-border-primary)',
                        paddingTop: 'var(--spacing-md)',
                        marginTop: 'var(--spacing-xs)'
                    }}>
                        <label
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-sm)',
                                cursor: 'pointer',
                                fontSize: 13,
                                fontWeight: 500,
                                userSelect: 'none'
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={applyToSubordinates}
                                onChange={e => {
                                    setApplyToSubordinates(e.target.checked);
                                    if (!e.target.checked) setSelectedSubIds(new Set());
                                }}
                                style={{ accentColor: 'var(--color-accent-primary)' }}
                            />
                            Apply to subordinate units
                            <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 'normal' }}>
                                ({subordinates.length} available)
                            </span>
                        </label>

                        {applyToSubordinates && (
                            <div style={{ marginTop: 'var(--spacing-md)' }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: 'var(--spacing-sm)'
                                }}>
                                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                                        Select units to include ({selectedSubIds.size} selected)
                                    </div>
                                    <button
                                        onClick={handleSelectAll}
                                        style={{
                                            fontSize: 11,
                                            padding: '3px 10px',
                                            background: 'var(--color-bg-primary)',
                                            borderColor: 'var(--color-border-accent)'
                                        }}
                                    >
                                        {selectedSubIds.size === subordinates.length ? 'Deselect All' : 'Select All'}
                                    </button>
                                </div>

                                <div style={{
                                    maxHeight: 300,
                                    overflowY: 'auto',
                                    padding: 'var(--spacing-sm)',
                                    background: 'var(--color-bg-primary)',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '1px solid var(--color-border-primary)'
                                }}>
                                    <SubordinateTree
                                        parentId={unitId}
                                        allUnits={allUnits || []}
                                        selectedIds={selectedSubIds}
                                        onToggle={handleToggle}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-lg)', justifyContent: 'flex-end' }}>
                <button onClick={onDone} style={{ background: 'var(--color-bg-primary)' }}>
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    style={{
                        background: 'var(--color-accent-primary)',
                        borderColor: 'var(--color-accent-primary)',
                        color: 'var(--color-bg-primary)'
                    }}
                >
                    {!deployment && applyToSubordinates && selectedSubIds.size > 0
                        ? `Save (${selectedSubIds.size + 1} units)`
                        : 'Save'}
                </button>
            </div>
        </div>
    );
}

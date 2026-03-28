import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db';
import { today, daysBetween } from '../../utils';
import { useState } from 'react';

export default function DeploymentsTab({ unit }: any) {
    const [editing, setEditing] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);

    const deployments = useLiveQuery(
        () => db.deployments.where('unitId').equals(unit.id).sortBy('startDate'),
        [unit.id]
    );

    const operations = useLiveQuery(() => db.operations.toArray(), []);

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
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 13 }}>
                        {deployment.startDate}
                    </div>
                </div>
                <div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>
                        End Date
                    </div>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 13 }}>
                        {deployment.endDate || 'Ongoing'}
                    </div>
                </div>
                <div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>
                        Duration
                    </div>
                    <div style={{
                        fontFamily: 'JetBrains Mono',
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

function DeploymentForm({ deployment, unitId, operations, onDone }: any) {
    const [name, setName] = useState(deployment?.name || '');
    const [operation, setOperation] = useState(deployment?.operation || '');
    const [operationId, setOperationId] = useState(deployment?.operationId || '');
    const [startDate, setStartDate] = useState(deployment?.startDate || today());
    const [endDate, setEndDate] = useState(deployment?.endDate || '');

    const handleSave = async () => {
        await db.deployments.put({
            id: deployment?.id || crypto.randomUUID(),
            unitId,
            name,
            operation: operation || undefined,
            operationId: operationId || undefined,
            startDate,
            endDate: endDate || undefined
        });
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
                    Save
                </button>
            </div>
        </div>
    );
}

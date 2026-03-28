import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { useState } from 'react';
import { today } from '../utils';

export default function OperationsManager({ onSelectUnit }: any) {
    const [editing, setEditing] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);

    const operations = useLiveQuery(() => db.operations.orderBy('startDate').reverse().toArray(), []);
    const units = useLiveQuery(() => db.units.toArray(), []);
    const deployments = useLiveQuery(() => db.deployments.toArray(), []);

    const handleCreate = () => {
        setCreating(true);
    };

    const handleEdit = (id: string) => {
        setEditing(id);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Delete this operation? This will not delete associated deployments.')) {
            await db.operations.delete(id);
        }
    };

    return (
        <div style={{ padding: 'var(--spacing-2xl)', maxWidth: 1400, margin: '0 auto' }}>

            <div style={{ marginBottom: 'var(--spacing-2xl)' }} className="animate-fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                    <div>
                        <h1 style={{
                            fontSize: 48,
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: 'var(--spacing-sm)'
                        }}>
                            OPERATIONS
                        </h1>
                        <p style={{
                            color: 'var(--color-text-muted)',
                            fontSize: 14,
                            letterSpacing: '2px',
                            textTransform: 'uppercase'
                        }}>
                            Operational Command Center
                        </p>
                    </div>
                    <button onClick={handleCreate}>+ New Operation</button>
                </div>
                <div className="tactical-divider"></div>
            </div>

            {creating && (
                <div className="animate-fade-in" style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <OperationForm onDone={() => setCreating(false)} />
                </div>
            )}

            <div style={{ display: 'grid', gap: 'var(--spacing-xl)' }}>
                {operations?.map((op, index) => (
                    editing === op.id ? (
                        <OperationForm
                            key={op.id}
                            operation={op}
                            onDone={() => setEditing(null)}
                        />
                    ) : (
                        <OperationCard
                            key={op.id}
                            operation={op}
                            units={units}
                            deployments={deployments}
                            onEdit={() => handleEdit(op.id)}
                            onDelete={() => handleDelete(op.id)}
                            onSelectUnit={onSelectUnit}
                            delay={index * 0.1}
                        />
                    )
                ))}

                {!operations?.length && !creating && (
                    <div className="card" style={{
                        textAlign: 'center',
                        padding: 'var(--spacing-2xl)',
                        color: 'var(--color-text-muted)'
                    }}>
                        No operations created yet
                    </div>
                )}
            </div>

        </div>
    );
}

function OperationCard({ operation, units, deployments, onEdit, onDelete, onSelectUnit, delay }: any) {
    const assignedDeployments = deployments?.filter((d: any) => d.operationId === operation.id) || [];
    const assignedUnits = assignedDeployments.map((d: any) =>
        units?.find((u: any) => u.id === d.unitId)
    ).filter(Boolean);

    const isActive = !operation.endDate;

    const getStatusColor = (status: string) => {
        const colors: any = {
            'Planning': 'var(--color-text-muted)',
            'Active': 'var(--color-status-deployed)',
            'Completed': 'var(--color-status-standby)',
            'Suspended': 'var(--color-status-training)'
        };
        return colors[status] || 'var(--color-text-muted)';
    };

    const getTypeColor = (type: string) => {
        const colors: any = {
            'Campaign': 'var(--color-status-deployed)',
            'Tactical': 'var(--color-accent-primary)',
            'Training': 'var(--color-status-training)',
            'Humanitarian': 'var(--color-status-standby)',
            'Other': 'var(--color-text-muted)'
        };
        return colors[type] || 'var(--color-text-muted)';
    };

    return (
        <div
            className="card animate-fade-in"
            style={{
                animationDelay: `${delay}s`,
                opacity: 0,
                border: isActive ? '1px solid var(--color-accent-primary)' : '1px solid var(--color-border-primary)'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-lg)' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-sm)' }}>
                        <h2 style={{ margin: 0 }}>{operation.name}</h2>
                        <span style={{
                            padding: '4px 10px',
                            background: `${getTypeColor(operation.type)}20`,
                            color: getTypeColor(operation.type),
                            border: `1px solid ${getTypeColor(operation.type)}40`,
                            borderRadius: 'var(--radius-sm)',
                            fontSize: 11,
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            {operation.type}
                        </span>
                        <span style={{
                            padding: '4px 10px',
                            background: `${getStatusColor(operation.status)}20`,
                            color: getStatusColor(operation.status),
                            border: `1px solid ${getStatusColor(operation.status)}40`,
                            borderRadius: 'var(--radius-sm)',
                            fontSize: 11,
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            {operation.status}
                        </span>
                    </div>
                    {operation.description && (
                        <p style={{
                            color: 'var(--color-text-secondary)',
                            fontSize: 13,
                            marginBottom: 'var(--spacing-md)'
                        }}>
                            {operation.description}
                        </p>
                    )}
                    <div style={{
                        display: 'flex',
                        gap: 'var(--spacing-xl)',
                        fontSize: 13,
                        color: 'var(--color-text-muted)'
                    }}>
                        <div>
                            <span style={{ color: 'var(--color-text-secondary)' }}>Start:</span>{' '}
                            <span style={{ fontFamily: 'JetBrains Mono' }}>{operation.startDate}</span>
                        </div>
                        <div>
                            <span style={{ color: 'var(--color-text-secondary)' }}>End:</span>{' '}
                            <span style={{ fontFamily: 'JetBrains Mono' }}>{operation.endDate || 'Ongoing'}</span>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                    <button onClick={onEdit}>Edit</button>
                    <button
                        onClick={onDelete}
                        style={{
                            background: 'var(--color-bg-primary)',
                            borderColor: 'var(--color-border-accent)'
                        }}
                    >
                        Delete
                    </button>
                </div>
            </div>

            <div className="tactical-divider" style={{ margin: 'var(--spacing-lg) 0' }}></div>

            <div>
                <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Assigned Units ({assignedUnits.length})</h3>
                {assignedUnits.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 'var(--spacing-sm)' }}>
                        {assignedUnits.map((unit: any) => (
                            <div
                                key={unit.id}
                                onClick={() => onSelectUnit(unit)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--spacing-sm)',
                                    padding: 'var(--spacing-sm)',
                                    background: 'var(--color-bg-tertiary)',
                                    border: '1px solid var(--color-border-primary)',
                                    borderRadius: 'var(--radius-sm)',
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
                                {unit.patch && (
                                    <img
                                        src={unit.patch}
                                        alt={unit.name}
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
                                        fontSize: 13,
                                        fontWeight: 600,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {unit.name}
                                    </div>
                                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                                        {unit.echelon || unit.type}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{
                        padding: 'var(--spacing-lg)',
                        textAlign: 'center',
                        color: 'var(--color-text-muted)',
                        fontSize: 12,
                        background: 'var(--color-bg-tertiary)',
                        borderRadius: 'var(--radius-sm)'
                    }}>
                        No units assigned to this operation
                    </div>
                )}
            </div>
        </div>
    );
}

function OperationForm({ operation, onDone }: any) {
    const [name, setName] = useState(operation?.name || '');
    const [type, setType] = useState(operation?.type || 'Campaign');
    const [status, setStatus] = useState(operation?.status || 'Planning');
    const [description, setDescription] = useState(operation?.description || '');
    const [startDate, setStartDate] = useState(operation?.startDate || today());
    const [endDate, setEndDate] = useState(operation?.endDate || '');

    const handleSave = async () => {
        await db.operations.put({
            id: operation?.id || crypto.randomUUID(),
            name,
            type,
            status,
            description: description || undefined,
            startDate,
            endDate: endDate || undefined,
            createdAt: operation?.createdAt || Date.now()
        });
        onDone();
    };

    return (
        <div className="card">
            <h2>{operation ? 'Edit Operation' : 'New Operation'}</h2>

            <div style={{ display: 'grid', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: 12, color: 'var(--color-text-muted)' }}>
                        Operation Name
                    </label>
                    <input
                        className="input"
                        placeholder="e.g., Operation Inherent Resolve"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: 6, fontSize: 12, color: 'var(--color-text-muted)' }}>
                            Type
                        </label>
                        <select
                            className="input"
                            value={type}
                            onChange={e => setType(e.target.value)}
                            style={{ width: '100%' }}
                        >
                            <option>Campaign</option>
                            <option>Tactical</option>
                            <option>Training</option>
                            <option>Humanitarian</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: 6, fontSize: 12, color: 'var(--color-text-muted)' }}>
                            Status
                        </label>
                        <select
                            className="input"
                            value={status}
                            onChange={e => setStatus(e.target.value)}
                            style={{ width: '100%' }}
                        >
                            <option>Planning</option>
                            <option>Active</option>
                            <option>Completed</option>
                            <option>Suspended</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: 12, color: 'var(--color-text-muted)' }}>
                        Description (Optional)
                    </label>
                    <textarea
                        className="input"
                        placeholder="Operation description..."
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        rows={3}
                        style={{ resize: 'vertical' }}
                    />
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

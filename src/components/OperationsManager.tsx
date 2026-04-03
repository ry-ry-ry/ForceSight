import { db, useLiveData } from '../database/adapter';
import { useState } from 'react';
import { today, getEffectivePatch } from '../utils';

export default function OperationsManager({ onSelectUnit }: any) {
    const [editing, setEditing] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);
    const [editingTaskForce, setEditingTaskForce] = useState<string | null>(null);
    const [creatingTaskForce, setCreatingTaskForce] = useState(false);
    const [selectedOperation, setSelectedOperation] = useState<string | null>(null);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [hideCompleted, setHideCompleted] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('');

    const operations = useLiveData(async () => {
        const ops = await db.operations.orderBy('startDate').toArray();
        return ops.reverse();
    }, []);
    const units = useLiveData(() => db.units.toArray(), []);
    const deployments = useLiveData(() => db.deployments.toArray(), []);
    const taskForces = useLiveData(() => db.taskForces.toArray(), []);

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

    const handleCreateTaskForce = (operationId?: string) => {
        setSelectedOperation(operationId || null);
        setCreatingTaskForce(true);
    };

    const handleEditTaskForce = (id: string) => {
        setEditingTaskForce(id);
    };

    const handleDeleteTaskForce = async (id: string) => {
        if (confirm('Delete this task force? Units will be unassigned.')) {
            // Unassign units from this task force
            const unitsInTF = units?.filter(u => u.taskForceId === id) || [];
            for (const unit of unitsInTF) {
                await db.units.update(unit.id, { taskForceId: undefined });
            }
            await db.taskForces.delete(id);
        }
    };

    const unassignedTaskForces = taskForces?.filter(tf => !tf.operationId) || [];

    const filteredOperations = operations?.filter(op => {
        if (searchQuery && !op.name.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }
        if (hideCompleted && op.status === 'Completed') {
            return false;
        }
        if (statusFilter && op.status !== statusFilter) {
            return false;
        }
        return true;
    });

    const activeFiltersCount = [
        searchQuery,
        hideCompleted,
        statusFilter
    ].filter(Boolean).length;

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

            {/* Filters */}
            <div className="card animate-fade-in" style={{ marginBottom: 'var(--spacing-xl)', animationDelay: '0.1s' }}>
                <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                        <label style={{ display: 'block', marginBottom: 6, fontSize: 12, color: 'var(--color-text-muted)' }}>
                            Search Operations
                        </label>
                        <input
                            className="input"
                            placeholder="Search by name..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div style={{ minWidth: 160 }}>
                        <label style={{ display: 'block', marginBottom: 6, fontSize: 12, color: 'var(--color-text-muted)' }}>
                            Status Filter
                        </label>
                        <select
                            className="input"
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            style={{ width: '100%' }}
                        >
                            <option value="">All Statuses</option>
                            <option value="Planning">Planning</option>
                            <option value="Active">Active</option>
                            <option value="Completed">Completed</option>
                            <option value="Suspended">Suspended</option>
                        </select>
                    </div>
                    <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-sm)',
                        padding: 'var(--spacing-sm) var(--spacing-md)',
                        background: 'var(--color-bg-tertiary)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border-primary)',
                        cursor: 'pointer',
                        fontSize: 13,
                        userSelect: 'none'
                    }}>
                        <input
                            type="checkbox"
                            checked={hideCompleted}
                            onChange={e => setHideCompleted(e.target.checked)}
                            style={{ accentColor: 'var(--color-accent-primary)' }}
                        />
                        Hide Completed
                    </label>
                    {activeFiltersCount > 0 && (
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setHideCompleted(false);
                                setStatusFilter('');
                            }}
                            style={{
                                fontSize: 12,
                                padding: '8px 14px',
                                background: 'var(--color-bg-elevated)',
                                borderColor: 'var(--color-border-accent)'
                            }}
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
                <div style={{ marginTop: 'var(--spacing-sm)', fontSize: 12, color: 'var(--color-text-muted)' }}>
                    Showing {filteredOperations?.length || 0} of {operations?.length || 0} operations
                </div>
            </div>

            {creating && (
                <div className="animate-fade-in" style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <OperationForm onDone={() => setCreating(false)} />
                </div>
            )}

            <div style={{ display: 'grid', gap: 'var(--spacing-xl)' }}>
                {filteredOperations?.map((op, index) => (
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
                            taskForces={taskForces}
                            onEdit={() => handleEdit(op.id)}
                            onDelete={() => handleDelete(op.id)}
                            onSelectUnit={onSelectUnit}
                            onDeleteTaskForce={handleDeleteTaskForce}
                            delay={index * 0.1}
                        />
                    )
                ))}

                {/* Unassigned Task Forces */}
                {unassignedTaskForces.length > 0 && (
                    <div className="card animate-fade-in">
                        <h2>Unassigned Task Forces</h2>
                        <div style={{ marginTop: 'var(--spacing-lg)', display: 'grid', gap: 'var(--spacing-md)' }}>
                            {unassignedTaskForces.map(tf => (
                                editingTaskForce === tf.id ? (
                                    <TaskForceForm
                                        key={tf.id}
                                        taskForce={tf}
                                        units={units}
                                        onDone={() => setEditingTaskForce(null)}
                                    />
                                ) : (
                                    <TaskForceCard
                                        key={tf.id}
                                        taskForce={tf}
                                        units={units}
                                        onEdit={() => handleEditTaskForce(tf.id)}
                                        onDelete={() => handleDeleteTaskForce(tf.id)}
                                        onSelectUnit={onSelectUnit}
                                    />
                                )
                            ))}
                        </div>
                    </div>
                )}

                {/* Create Unassigned Task Force Button */}
                <button
                    onClick={() => handleCreateTaskForce()}
                    style={{
                        padding: 'var(--spacing-lg)',
                        fontSize: 14,
                        background: 'var(--color-bg-elevated)',
                        border: '2px dashed var(--color-border-accent)'
                    }}
                >
                    + Create Unassigned Task Force
                </button>

                {creatingTaskForce && (
                    <div className="animate-fade-in">
                        <TaskForceForm
                            operationId={selectedOperation}
                            units={units}
                            onDone={() => {
                                setCreatingTaskForce(false);
                                setSelectedOperation(null);
                            }}
                        />
                    </div>
                )}

                {!filteredOperations?.length && !creating && (
                    <div className="card" style={{
                        textAlign: 'center',
                        padding: 'var(--spacing-2xl)',
                        color: 'var(--color-text-muted)'
                    }}>
                        {operations?.length ? 'No operations match the current filters' : 'No operations created yet'}
                    </div>
                )}
            </div>

        </div>
    );
}

function OperationCard({ operation, units, deployments, taskForces, onEdit, onDelete, onSelectUnit, onDeleteTaskForce, delay }: any) {
    const [showTaskForceForm, setShowTaskForceForm] = useState(false);
    const [editingTaskForce, setEditingTaskForce] = useState<string | null>(null);
    const [showAssignMenu, setShowAssignMenu] = useState(false);

    const assignedDeployments = deployments?.filter((d: any) => d.operationId === operation.id) || [];
    // Only show units with ACTIVE deployments (no end date) in the Assigned Units section
    const activeDeployments = assignedDeployments.filter((d: any) => !d.endDate);
    const assignedUnits = activeDeployments.map((d: any) =>
        units?.find((u: any) => u.id === d.unitId)
    ).filter(Boolean);

    const operationTaskForces = taskForces?.filter((tf: any) => tf.operationId === operation.id) || [];
    const unassignedTaskForces = taskForces?.filter((tf: any) => !tf.operationId) || [];

    const isActive = !operation.endDate;

    const handleAssignTaskForce = async (taskForceId: string) => {
        await db.taskForces.update(taskForceId, { operationId: operation.id });
        setShowAssignMenu(false);
    };

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
                            <span style={{ fontFamily: 'var(--font-mono)' }}>{operation.startDate}</span>
                        </div>
                        <div>
                            <span style={{ color: 'var(--color-text-secondary)' }}>End:</span>{' '}
                            <span style={{ fontFamily: 'var(--font-mono)' }}>{operation.endDate || 'Ongoing'}</span>
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

            {/* Task Forces */}
            {operationTaskForces.length > 0 && (
                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                        <h3 style={{ marginBottom: 0 }}>Task Forces ({operationTaskForces.length})</h3>
                        <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                            {unassignedTaskForces.length > 0 && (
                                <button
                                    onClick={() => setShowAssignMenu(!showAssignMenu)}
                                    style={{ fontSize: 11, padding: '4px 8px' }}
                                >
                                    Assign Existing
                                </button>
                            )}
                            <button onClick={() => setShowTaskForceForm(true)} style={{ fontSize: 11, padding: '4px 8px' }}>
                                + Add Task Force
                            </button>
                        </div>
                    </div>

                    {showAssignMenu && unassignedTaskForces.length > 0 && (
                        <div style={{
                            marginBottom: 'var(--spacing-md)',
                            padding: 'var(--spacing-sm)',
                            background: 'var(--color-bg-elevated)',
                            border: '1px solid var(--color-border-accent)',
                            borderRadius: 'var(--radius-sm)'
                        }}>
                            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-xs)' }}>
                                Select a task force to assign:
                            </div>
                            {unassignedTaskForces.map((tf: any) => (
                                <div
                                    key={tf.id}
                                    onClick={() => handleAssignTaskForce(tf.id)}
                                    style={{
                                        padding: 'var(--spacing-xs)',
                                        marginBottom: 'var(--spacing-xs)',
                                        background: 'var(--color-bg-tertiary)',
                                        border: '1px solid var(--color-border-primary)',
                                        borderRadius: 'var(--radius-sm)',
                                        cursor: 'pointer',
                                        fontSize: 12,
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--color-accent-primary)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--color-border-primary)';
                                    }}
                                >
                                    <div style={{ fontWeight: 600 }}>{tf.name}</div>
                                    {tf.description && (
                                        <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>
                                            {tf.description}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
                        {operationTaskForces.map((tf: any) => (
                            editingTaskForce === tf.id ? (
                                <TaskForceForm
                                    key={tf.id}
                                    taskForce={tf}
                                    operationId={operation.id}
                                    units={units}
                                    onDone={() => setEditingTaskForce(null)}
                                />
                            ) : (
                                <TaskForceCard
                                    key={tf.id}
                                    taskForce={tf}
                                    units={units}
                                    onEdit={() => setEditingTaskForce(tf.id)}
                                    onDelete={() => onDeleteTaskForce(tf.id)}
                                    onSelectUnit={onSelectUnit}
                                />
                            )
                        ))}
                    </div>
                </div>
            )}

            {showTaskForceForm && (
                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <TaskForceForm
                        operationId={operation.id}
                        units={units}
                        onDone={() => setShowTaskForceForm(false)}
                    />
                </div>
            )}

            {operationTaskForces.length === 0 && !showTaskForceForm && (
                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    {unassignedTaskForces.length > 0 && (
                        <>
                            <button
                                onClick={() => setShowAssignMenu(!showAssignMenu)}
                                style={{
                                    width: '100%',
                                    fontSize: 11,
                                    padding: 'var(--spacing-sm)',
                                    background: 'var(--color-bg-tertiary)',
                                    border: '1px dashed var(--color-border-accent)',
                                    marginBottom: 'var(--spacing-xs)'
                                }}
                            >
                                Assign Existing Task Force
                            </button>

                            {showAssignMenu && (
                                <div style={{
                                    marginBottom: 'var(--spacing-sm)',
                                    padding: 'var(--spacing-sm)',
                                    background: 'var(--color-bg-elevated)',
                                    border: '1px solid var(--color-border-accent)',
                                    borderRadius: 'var(--radius-sm)'
                                }}>
                                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-xs)' }}>
                                        Select a task force to assign:
                                    </div>
                                    {unassignedTaskForces.map((tf: any) => (
                                        <div
                                            key={tf.id}
                                            onClick={() => handleAssignTaskForce(tf.id)}
                                            style={{
                                                padding: 'var(--spacing-xs)',
                                                marginBottom: 'var(--spacing-xs)',
                                                background: 'var(--color-bg-tertiary)',
                                                border: '1px solid var(--color-border-primary)',
                                                borderRadius: 'var(--radius-sm)',
                                                cursor: 'pointer',
                                                fontSize: 12,
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.borderColor = 'var(--color-accent-primary)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.borderColor = 'var(--color-border-primary)';
                                            }}
                                        >
                                            <div style={{ fontWeight: 600 }}>{tf.name}</div>
                                            {tf.description && (
                                                <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>
                                                    {tf.description}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    <button
                        onClick={() => setShowTaskForceForm(true)}
                        style={{
                            width: '100%',
                            fontSize: 11,
                            padding: 'var(--spacing-sm)',
                            background: 'var(--color-bg-tertiary)',
                            border: '1px dashed var(--color-border-accent)'
                        }}
                    >
                        + Add Task Force to Operation
                    </button>
                </div>
            )}

            <div>
                <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Assigned Units ({assignedUnits.length})</h3>
                {assignedUnits.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 'var(--spacing-sm)' }}>
                        {assignedUnits.map((unit: any) => {
                            const taskForce = taskForces?.find((tf: any) => tf.id === unit.taskForceId);
                            return (
                                <div
                                    key={unit.id}
                                    onClick={() => onSelectUnit(unit)}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 'var(--spacing-xs)',
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
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                                        {getEffectivePatch(unit, units) && (
                                            <img
                                                src={getEffectivePatch(unit, units)}
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
                                    {taskForce && (
                                        <div style={{
                                            fontSize: 10,
                                            padding: '2px 6px',
                                            background: 'var(--color-accent-primary)20',
                                            color: 'var(--color-accent-primary)',
                                            border: '1px solid var(--color-accent-primary)40',
                                            borderRadius: 'var(--radius-sm)',
                                            textAlign: 'center',
                                            fontWeight: 600,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}>
                                            TF: {taskForce.name}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
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


function TaskForceCard({ taskForce, units, onEdit, onDelete, onSelectUnit }: any) {
    const tfUnits = units?.filter((u: any) => u.taskForceId === taskForce.id) || [];

    return (
        <div style={{
            padding: 'var(--spacing-md)',
            background: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border-accent)',
            borderRadius: 'var(--radius-sm)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-sm)' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 'var(--spacing-xs)' }}>
                        {taskForce.name}
                    </div>
                    {taskForce.description && (
                        <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                            {taskForce.description}
                        </div>
                    )}
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                    <button onClick={onEdit} style={{ fontSize: 10, padding: '4px 8px' }}>Edit</button>
                    <button
                        onClick={onDelete}
                        style={{
                            fontSize: 10,
                            padding: '4px 8px',
                            background: 'var(--color-bg-primary)',
                            borderColor: 'var(--color-border-accent)'
                        }}
                    >
                        Delete
                    </button>
                </div>
            </div>

            {tfUnits.length > 0 && (
                <div style={{
                    marginTop: 'var(--spacing-sm)',
                    paddingTop: 'var(--spacing-sm)',
                    borderTop: '1px solid var(--color-border-primary)'
                }}>
                    <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-xs)' }}>
                        Units ({tfUnits.length})
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-xs)' }}>
                        {tfUnits.map((unit: any) => (
                            <div
                                key={unit.id}
                                onClick={() => onSelectUnit(unit)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--spacing-xs)',
                                    fontSize: 10,
                                    padding: '3px 6px',
                                    background: 'var(--color-bg-tertiary)',
                                    border: '1px solid var(--color-border-primary)',
                                    borderRadius: 'var(--radius-sm)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--color-accent-primary)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--color-border-primary)';
                                }}
                            >
                                {getEffectivePatch(unit, units) && (
                                    <img
                                        src={getEffectivePatch(unit, units)}
                                        alt={unit.name}
                                        style={{
                                            width: 16,
                                            height: 16,
                                            objectFit: 'contain',
                                            borderRadius: 2,
                                            border: '1px solid var(--color-border-accent)'
                                        }}
                                    />
                                )}
                                <span>{unit.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function TaskForceForm({ taskForce, operationId, units, onDone }: any) {
    const [name, setName] = useState(taskForce?.name || '');
    const [description, setDescription] = useState(taskForce?.description || '');
    const [selectedUnits, setSelectedUnits] = useState<string[]>(
        taskForce ? (units?.filter((u: any) => u.taskForceId === taskForce?.id).map((u: any) => u.id) || []) : []
    );
    const [searchQuery, setSearchQuery] = useState('');

    const handleSave = async () => {
        const tfId = taskForce?.id || crypto.randomUUID();

        await db.taskForces.put({
            id: tfId,
            name,
            operationId: operationId || taskForce?.operationId || undefined,
            description: description || undefined,
            createdAt: taskForce?.createdAt || Date.now()
        });

        // Update unit assignments
        const allUnits = units || [];
        for (const unit of allUnits) {
            if (selectedUnits.includes(unit.id) && unit.taskForceId !== tfId) {
                await db.units.update(unit.id, { taskForceId: tfId });
            } else if (!selectedUnits.includes(unit.id) && unit.taskForceId === tfId) {
                await db.units.update(unit.id, { taskForceId: undefined });
            }
        }

        onDone();
    };

    const toggleUnit = (unitId: string) => {
        setSelectedUnits(prev =>
            prev.includes(unitId)
                ? prev.filter(id => id !== unitId)
                : [...prev, unitId]
        );
    };

    const filteredUnits = units?.filter((u: any) =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const getParentUnit = (parentId: string) => {
        return units?.find((u: any) => u.id === parentId);
    };

    return (
        <div className="card">
            <h2>{taskForce ? 'Edit Task Force' : 'New Task Force'}</h2>

            <div style={{ display: 'grid', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: 12, color: 'var(--color-text-muted)' }}>
                        Task Force Name
                    </label>
                    <input
                        className="input"
                        placeholder="e.g., Task Force Dagger"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: 12, color: 'var(--color-text-muted)' }}>
                        Description (Optional)
                    </label>
                    <textarea
                        className="input"
                        placeholder="Task force description..."
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        rows={2}
                        style={{ resize: 'vertical' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: 12, color: 'var(--color-text-muted)' }}>
                        Assign Units
                    </label>
                    <input
                        className="input"
                        placeholder="Search units..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        style={{ marginBottom: 'var(--spacing-sm)' }}
                    />
                    <div style={{
                        maxHeight: '300px',
                        overflowY: 'auto',
                        padding: 'var(--spacing-sm)',
                        background: 'var(--color-bg-tertiary)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border-primary)'
                    }}>
                        {filteredUnits.length > 0 ? (
                            filteredUnits.map((unit: any) => {
                                const parentUnit = unit.parentId ? getParentUnit(unit.parentId) : null;
                                return (
                                    <label
                                        key={unit.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--spacing-sm)',
                                            padding: 'var(--spacing-sm)',
                                            cursor: 'pointer',
                                            fontSize: 12,
                                            borderRadius: 'var(--radius-sm)',
                                            transition: 'background 0.2s ease',
                                            marginBottom: 'var(--spacing-xs)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'var(--color-bg-elevated)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'transparent';
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedUnits.includes(unit.id)}
                                            onChange={() => toggleUnit(unit.id)}
                                        />
                                        {getEffectivePatch(unit, units) && (
                                            <img
                                                src={getEffectivePatch(unit, units)}
                                                alt={unit.name}
                                                style={{
                                                    width: 24,
                                                    height: 24,
                                                    objectFit: 'contain',
                                                    borderRadius: 'var(--radius-sm)',
                                                    border: '1px solid var(--color-border-accent)'
                                                }}
                                            />
                                        )}
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 600 }}>{unit.name}</div>
                                            <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>
                                                {unit.echelon || unit.type}
                                                {parentUnit && ` • Parent: ${parentUnit.name}`}
                                            </div>
                                        </div>
                                    </label>
                                );
                            })
                        ) : (
                            <div style={{
                                textAlign: 'center',
                                padding: 'var(--spacing-md)',
                                color: 'var(--color-text-muted)',
                                fontSize: 11
                            }}>
                                No units found
                            </div>
                        )}
                    </div>
                    {selectedUnits.length > 0 && (
                        <div style={{
                            marginTop: 'var(--spacing-xs)',
                            fontSize: 11,
                            color: 'var(--color-text-muted)'
                        }}>
                            {selectedUnits.length} unit{selectedUnits.length !== 1 ? 's' : ''} selected
                        </div>
                    )}
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

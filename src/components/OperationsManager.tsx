import { db, useLiveData } from '../database/adapter';
import { useState } from 'react';
import { today } from '../utils';
import { UnitIcon } from './UnitIcon';

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
    const subOperations = useLiveData(() => db.subOperations.toArray(), []);
    const missions = useLiveData(() => db.missions.toArray(), []);

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

    const handleDeleteSubOperation = async (id: string) => {
        const activeMissionsForSubOp = missions?.filter(m => m.subOperationId === id && !m.endDate) || [];
        const msg = activeMissionsForSubOp.length > 0
            ? `Delete this sub-operation?\n\n${activeMissionsForSubOp.length} active mission(s) will be ended as of today (unit history preserved).`
            : 'Delete this sub-operation?';
        if (!confirm(msg)) return;
        for (const m of activeMissionsForSubOp) {
            await db.missions.update(m.id, { endDate: today() });
        }
        await db.subOperations.delete(id);
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
                            deployments={deployments}
                            subOperations={subOperations}
                            missions={missions}
                            onDone={() => setEditing(null)}
                        />
                    ) : (
                        <OperationCard
                            key={op.id}
                            operation={op}
                            units={units}
                            deployments={deployments}
                            taskForces={taskForces}
                            subOperations={subOperations}
                            missions={missions}
                            onEdit={() => handleEdit(op.id)}
                            onDelete={() => handleDelete(op.id)}
                            onSelectUnit={onSelectUnit}
                            onDeleteTaskForce={handleDeleteTaskForce}
                            onDeleteSubOperation={handleDeleteSubOperation}
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

function OperationCard({ operation, units, deployments, taskForces, subOperations, missions, onEdit, onDelete, onSelectUnit, onDeleteTaskForce, onDeleteSubOperation, delay }: any) {
    const [showTaskForceForm, setShowTaskForceForm] = useState(false);
    const [editingTaskForce, setEditingTaskForce] = useState<string | null>(null);
    const [showAssignMenu, setShowAssignMenu] = useState(false);
    const [showSubOperationForm, setShowSubOperationForm] = useState(false);
    const [editingSubOperation, setEditingSubOperation] = useState<string | null>(null);

    const assignedDeployments = deployments?.filter((d: any) => d.operationId === operation.id) || [];
    // Only show units with ACTIVE deployments (no end date) in the Assigned Units section
    const activeDeployments = assignedDeployments.filter((d: any) => !d.endDate);
    const assignedUnits = activeDeployments.map((d: any) =>
        units?.find((u: any) => u.id === d.unitId)
    ).filter(Boolean);

    const operationTaskForces = taskForces?.filter((tf: any) => tf.operationId === operation.id) || [];
    const unassignedTaskForces = taskForces?.filter((tf: any) => !tf.operationId) || [];

    const operationSubOps = subOperations?.filter((so: any) => so.parentOperationId === operation.id) || [];

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

            {/* Sub-Operations */}
            {operationSubOps.length > 0 && (
                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                        <h3 style={{ marginBottom: 0 }}>Sub-Operations ({operationSubOps.length})</h3>
                        <button onClick={() => setShowSubOperationForm(true)} style={{ fontSize: 11, padding: '4px 8px' }}>
                            + Add Sub-Operation
                        </button>
                    </div>

                    <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
                        {operationSubOps.map((so: any) => (
                            editingSubOperation === so.id ? (
                                <SubOperationForm
                                    key={so.id}
                                    subOp={so}
                                    parentOperationId={operation.id}
                                    units={units}
                                    missions={missions}
                                    onDone={() => setEditingSubOperation(null)}
                                />
                            ) : (
                                <SubOperationCard
                                    key={so.id}
                                    subOp={so}
                                    units={units}
                                    missions={missions}
                                    onEdit={() => setEditingSubOperation(so.id)}
                                    onDelete={() => onDeleteSubOperation(so.id)}
                                    onSelectUnit={onSelectUnit}
                                />
                            )
                        ))}
                    </div>
                </div>
            )}

            {showSubOperationForm && (
                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <SubOperationForm
                        parentOperationId={operation.id}
                        units={units}
                        missions={missions}
                        onDone={() => setShowSubOperationForm(false)}
                    />
                </div>
            )}

            {operationSubOps.length === 0 && !showSubOperationForm && (
                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <button
                        onClick={() => setShowSubOperationForm(true)}
                        style={{
                            width: '100%',
                            fontSize: 11,
                            padding: 'var(--spacing-sm)',
                            background: 'var(--color-bg-tertiary)',
                            border: '1px dashed var(--color-border-accent)'
                        }}
                    >
                        + Add Sub-Operation / Mission
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
                                        <UnitIcon
                                            unit={unit}
                                            allUnits={units}
                                            size="small"
                                        />
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

function OperationForm({ operation, deployments, subOperations, missions, onDone }: any) {
    const [name, setName] = useState(operation?.name || '');
    const [type, setType] = useState(operation?.type || 'Campaign');
    const [status, setStatus] = useState(operation?.status || 'Planning');
    const [description, setDescription] = useState(operation?.description || '');
    const [startDate, setStartDate] = useState(operation?.startDate || today());
    const [endDate, setEndDate] = useState(operation?.endDate || '');

    const prevStatus = operation?.status;
    const willCompleteCascade = operation && status === 'Completed' && prevStatus !== 'Completed';

    const cascadeCounts = (() => {
        if (!willCompleteCascade) return { deps: 0, subOps: 0, subMissions: 0 };
        const activeDeps = (deployments || []).filter((d: any) => d.operationId === operation.id && !d.endDate);
        const activeSubOps = (subOperations || []).filter((so: any) => so.parentOperationId === operation.id && so.status !== 'Completed');
        const activeSubOpIds = new Set(activeSubOps.map((so: any) => so.id));
        const activeSubMissions = (missions || []).filter((m: any) => m.subOperationId && activeSubOpIds.has(m.subOperationId) && !m.endDate);
        return { deps: activeDeps.length, subOps: activeSubOps.length, subMissions: activeSubMissions.length };
    })();

    const hasAnyCascadeImpact = willCompleteCascade && (cascadeCounts.deps > 0 || cascadeCounts.subOps > 0 || cascadeCounts.subMissions > 0);

    const handleSave = async () => {
        const payload = {
            id: operation?.id || crypto.randomUUID(),
            name,
            type,
            status,
            description: description || undefined,
            startDate,
            endDate: endDate || undefined,
            createdAt: operation?.createdAt || Date.now()
        };

        try {
            if (hasAnyCascadeImpact) {
                const ok = confirm(
                    `Mark "${name}" as Completed?\n\n` +
                    `This will end:\n` +
                    `  • ${cascadeCounts.deps} active deployment(s)\n` +
                    `  • ${cascadeCounts.subOps} active sub-operation(s) and ${cascadeCounts.subMissions} active mission(s)\n\n` +
                    `Unit deployment and mission history will be preserved with end dates applied.\n\n` +
                    `Continue?`
                );
                if (!ok) return;

                const closingDate = endDate || today();
                await db.operations.put(payload);

                const activeDeps = (deployments || []).filter((d: any) => d.operationId === operation.id && !d.endDate);
                for (const d of activeDeps) {
                    await db.deployments.update(d.id, { endDate: closingDate });
                }

                const activeSubOps = (subOperations || []).filter((so: any) => so.parentOperationId === operation.id && so.status !== 'Completed');
                for (const so of activeSubOps) {
                    const soEnd = so.endDate || closingDate;
                    await db.subOperations.update(so.id, { status: 'Completed', endDate: soEnd });
                    const soMissions = (missions || []).filter((m: any) => m.subOperationId === so.id && !m.endDate);
                    for (const m of soMissions) {
                        await db.missions.update(m.id, { endDate: soEnd });
                    }
                }
            } else {
                await db.operations.put(payload);
            }
            onDone();
        } catch (err) {
            console.error('Failed to save operation:', err);
            alert(`Failed to save operation:\n\n${(err as Error)?.message || err}`);
        }
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

                {hasAnyCascadeImpact && (
                    <div style={{
                        padding: 'var(--spacing-sm) var(--spacing-md)',
                        background: 'var(--color-status-training)20',
                        border: '1px solid var(--color-status-training)60',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--color-status-training)',
                        fontSize: 12,
                        lineHeight: 1.5
                    }}>
                        <strong>⚠ Completing this operation will cascade:</strong>
                        <div style={{ marginTop: 4, color: 'var(--color-text-secondary)' }}>
                            {cascadeCounts.deps} active deployment(s) will be ended.
                            {' '}
                            {cascadeCounts.subOps} active sub-operation(s) containing {cascadeCounts.subMissions} mission(s) will be closed.
                            {' '}
                            Unit history is preserved with end dates applied.
                        </div>
                    </div>
                )}

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
                                <UnitIcon
                                    unit={unit}
                                    allUnits={units}
                                    size="tiny"
                                />
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
                                        <UnitIcon
                                            unit={unit}
                                            allUnits={units}
                                            size="small"
                                        />
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


function getSubOpStatusColor(status: string): string {
    const colors: Record<string, string> = {
        'Planning': 'var(--color-text-muted)',
        'Active': 'var(--color-status-deployed)',
        'Completed': 'var(--color-status-standby)',
        'Suspended': 'var(--color-status-training)'
    };
    return colors[status] || 'var(--color-text-muted)';
}

function getSubOpTypeColor(type: string): string {
    const colors: Record<string, string> = {
        'Raid': 'var(--color-status-deployed)',
        'Reconnaissance': 'var(--color-accent-primary)',
        'Support': 'var(--color-status-training)',
        'Training': 'var(--color-status-standby)',
        'Other': 'var(--color-text-muted)'
    };
    return colors[type] || 'var(--color-text-muted)';
}

function SubOperationCard({ subOp, units, missions, onEdit, onDelete, onSelectUnit }: any) {
    const activeMissions = (missions || []).filter((m: any) => m.subOperationId === subOp.id && !m.endDate);
    const assignedUnits = activeMissions
        .map((m: any) => (units || []).find((u: any) => u.id === m.unitId))
        .filter(Boolean);

    return (
        <div style={{
            padding: 'var(--spacing-md)',
            background: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border-accent)',
            borderRadius: 'var(--radius-sm)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-sm)' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xs)', flexWrap: 'wrap' }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{subOp.name}</div>
                        <span style={{
                            padding: '2px 8px',
                            background: `${getSubOpTypeColor(subOp.type)}20`,
                            color: getSubOpTypeColor(subOp.type),
                            border: `1px solid ${getSubOpTypeColor(subOp.type)}40`,
                            borderRadius: 'var(--radius-sm)',
                            fontSize: 10,
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            {subOp.type}
                        </span>
                        <span style={{
                            padding: '2px 8px',
                            background: `${getSubOpStatusColor(subOp.status)}20`,
                            color: getSubOpStatusColor(subOp.status),
                            border: `1px solid ${getSubOpStatusColor(subOp.status)}40`,
                            borderRadius: 'var(--radius-sm)',
                            fontSize: 10,
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            {subOp.status}
                        </span>
                    </div>
                    {subOp.description && (
                        <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-xs)' }}>
                            {subOp.description}
                        </div>
                    )}
                    <div style={{ display: 'flex', gap: 'var(--spacing-md)', fontSize: 11, color: 'var(--color-text-muted)' }}>
                        <div>
                            <span style={{ color: 'var(--color-text-secondary)' }}>Start:</span>{' '}
                            <span style={{ fontFamily: 'var(--font-mono)' }}>{subOp.startDate}</span>
                        </div>
                        <div>
                            <span style={{ color: 'var(--color-text-secondary)' }}>End:</span>{' '}
                            <span style={{ fontFamily: 'var(--font-mono)' }}>{subOp.endDate || 'Ongoing'}</span>
                        </div>
                    </div>
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

            <div style={{
                marginTop: 'var(--spacing-sm)',
                paddingTop: 'var(--spacing-sm)',
                borderTop: '1px solid var(--color-border-primary)'
            }}>
                <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-xs)' }}>
                    Assigned Units ({assignedUnits.length})
                </div>
                {assignedUnits.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-xs)' }}>
                        {assignedUnits.map((unit: any) => (
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
                                <UnitIcon unit={unit} allUnits={units} size="tiny" />
                                <span>{unit.name}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ fontSize: 10, color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                        No units currently assigned
                    </div>
                )}
            </div>
        </div>
    );
}

function SubOperationForm({ subOp, parentOperationId, units, missions, onDone }: any) {
    const [name, setName] = useState(subOp?.name || '');
    const [missionType, setMissionType] = useState(subOp?.type || 'Raid');
    const [status, setStatus] = useState(subOp?.status || 'Active');
    const [description, setDescription] = useState(subOp?.description || '');
    const [startDate, setStartDate] = useState(subOp?.startDate || today());
    const [endDate, setEndDate] = useState(subOp?.endDate || '');
    const [searchQuery, setSearchQuery] = useState('');

    const initialSelectedUnits = subOp
        ? (missions || [])
            .filter((m: any) => m.subOperationId === subOp.id && !m.endDate)
            .map((m: any) => m.unitId)
        : [];
    const [selectedUnits, setSelectedUnits] = useState<string[]>(initialSelectedUnits);

    const prevStatus = subOp?.status;
    const activeMissionsForSubOp = subOp
        ? (missions || []).filter((m: any) => m.subOperationId === subOp.id && !m.endDate)
        : [];
    const unitsBeingUnassigned = subOp
        ? activeMissionsForSubOp.filter((m: any) => !selectedUnits.includes(m.unitId)).length
        : 0;
    const willCompleteCascade = status === 'Completed' && prevStatus !== 'Completed';
    const missionsEndedOnComplete = willCompleteCascade
        ? activeMissionsForSubOp.filter((m: any) => selectedUnits.includes(m.unitId)).length
        : 0;
    const showCascadeBanner = unitsBeingUnassigned > 0 || (willCompleteCascade && missionsEndedOnComplete > 0);

    const toggleUnit = (unitId: string) => {
        setSelectedUnits(prev =>
            prev.includes(unitId) ? prev.filter(id => id !== unitId) : [...prev, unitId]
        );
    };

    const filteredUnits = (units || []).filter((u: any) =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getParentUnit = (parentId: string) => (units || []).find((u: any) => u.id === parentId);

    const handleSave = async () => {
        if (!name.trim()) return;

        const subOpId = subOp?.id || crypto.randomUUID();
        const closingDate = endDate || today();

        // Only confirm if the save will end or unassign something.
        if (showCascadeBanner) {
            const lines: string[] = [];
            if (unitsBeingUnassigned > 0) {
                lines.push(`  \u2022 ${unitsBeingUnassigned} unit(s) will be unassigned \u2014 their mission(s) will be ended as of today.`);
            }
            if (willCompleteCascade && missionsEndedOnComplete > 0) {
                lines.push(`  \u2022 Completing this sub-operation will end ${missionsEndedOnComplete} remaining active mission(s).`);
            }
            const ok = confirm(
                `Save changes to "${name}"?\n\n` +
                `${lines.join('\n')}\n\n` +
                `Unit mission history will be preserved with end dates applied.\n\n` +
                `Continue?`
            );
            if (!ok) return;
        }

        try {
            await db.subOperations.put({
                id: subOpId,
                parentOperationId,
                name: name.trim(),
                type: missionType,
                status,
                description: description || undefined,
                startDate,
                endDate: endDate || undefined,
                createdAt: subOp?.createdAt || Date.now()
            });

            // Reconcile per-unit missions
            const existingActive = activeMissionsForSubOp as any[];
            const existingActiveUnitIds = new Set(existingActive.map((m: any) => m.unitId));
            const createdMissionIds: string[] = [];

            // Create missions for newly-selected units
            for (const unitId of selectedUnits) {
                if (!existingActiveUnitIds.has(unitId)) {
                    const missionId = crypto.randomUUID();
                    await db.missions.put({
                        id: missionId,
                        unitId,
                        operationId: parentOperationId,
                        subOperationId: subOpId,
                        name: name.trim(),
                        type: missionType,
                        startDate,
                        endDate: status === 'Completed' ? closingDate : undefined,
                        description: description || undefined,
                    });
                    createdMissionIds.push(missionId);
                }
            }

            // Update existing active missions to stay in sync with the sub-op metadata
            for (const m of existingActive) {
                if (selectedUnits.includes(m.unitId)) {
                    const updates: any = {
                        name: name.trim(),
                        type: missionType,
                        description: description || undefined,
                        startDate,
                    };
                    if (status === 'Completed') updates.endDate = closingDate;
                    await db.missions.update(m.id, updates);
                } else {
                    // Unit unassigned — end the mission as of today
                    await db.missions.update(m.id, { endDate: today() });
                }
            }

            onDone();
        } catch (err) {
            console.error('Failed to save sub-operation:', err);
            alert(`Failed to save sub-operation:\n\n${(err as Error)?.message || err}`);
        }
    };

    return (
        <div className="card">
            <h2>{subOp ? 'Edit Sub-Operation' : 'New Sub-Operation'}</h2>

            <div style={{ display: 'grid', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: 12, color: 'var(--color-text-muted)' }}>
                        Sub-Operation Name
                    </label>
                    <input
                        className="input"
                        placeholder="e.g., Operation Neptune Spear"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: 6, fontSize: 12, color: 'var(--color-text-muted)' }}>
                            Mission Type
                        </label>
                        <select
                            className="input"
                            value={missionType}
                            onChange={e => setMissionType(e.target.value)}
                            style={{ width: '100%' }}
                        >
                            <option>Raid</option>
                            <option>Reconnaissance</option>
                            <option>Support</option>
                            <option>Training</option>
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

                {showCascadeBanner && (
                    <div style={{
                        padding: 'var(--spacing-sm) var(--spacing-md)',
                        background: 'var(--color-status-training)20',
                        border: '1px solid var(--color-status-training)60',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--color-status-training)',
                        fontSize: 12,
                        lineHeight: 1.5
                    }}>
                        <strong>⚠ Saving will affect unit mission history:</strong>
                        <div style={{ marginTop: 4, color: 'var(--color-text-secondary)' }}>
                            {unitsBeingUnassigned > 0 && (
                                <div>{unitsBeingUnassigned} unit(s) will be unassigned — their mission(s) will be ended.</div>
                            )}
                            {willCompleteCascade && missionsEndedOnComplete > 0 && (
                                <div>{missionsEndedOnComplete} active mission(s) will be ended by completing this sub-operation.</div>
                            )}
                        </div>
                    </div>
                )}

                <div>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: 12, color: 'var(--color-text-muted)' }}>
                        Description (Optional)
                    </label>
                    <textarea
                        className="input"
                        placeholder="Sub-operation description..."
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        rows={2}
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
                                        <UnitIcon unit={unit} allUnits={units} size="small" />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 600 }}>{unit.name}</div>
                                            <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>
                                                {unit.echelon || unit.type}
                                                {parentUnit && ` \u2022 Parent: ${parentUnit.name}`}
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
                    disabled={!name.trim()}
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

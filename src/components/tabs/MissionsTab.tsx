import { db, useLiveData } from '../../database/adapter';
import { today, daysBetween } from '../../utils';
import { useState } from 'react';

export default function MissionsTab({ unit }: any) {
    const [editing, setEditing] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);

    const missions = useLiveData(
        () => db.missions.where('unitId').equals(unit.id).sortBy('startDate'),
        [unit.id]
    );

    const operations = useLiveData(() => db.operations.toArray(), []);

    const handleCreate = () => {
        setCreating(true);
    };

    const handleEdit = (id: string) => {
        setEditing(id);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Delete this mission?')) {
            await db.missions.delete(id);
        }
    };

    return (
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                    <h3>Mission History</h3>
                    <button onClick={handleCreate}>+ Add Mission</button>
                </div>

                {creating && (
                    <MissionForm
                        unitId={unit.id}
                        operations={operations}
                        onDone={() => setCreating(false)}
                    />
                )}

                <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                    {missions?.map(m => (
                        editing === m.id ? (
                            <MissionForm
                                key={m.id}
                                mission={m}
                                unitId={unit.id}
                                operations={operations}
                                onDone={() => setEditing(null)}
                            />
                        ) : (
                            <MissionCard
                                key={m.id}
                                mission={m}
                                operations={operations}
                                onEdit={() => handleEdit(m.id)}
                                onDelete={() => handleDelete(m.id)}
                            />
                        )
                    ))}

                    {!missions?.length && !creating && (
                        <div style={{
                            textAlign: 'center',
                            padding: 'var(--spacing-2xl)',
                            color: 'var(--color-text-muted)',
                            fontSize: 13
                        }}>
                            No missions recorded
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function MissionCard({ mission, operations, onEdit, onDelete }: any) {
    const duration = mission.endDate
        ? daysBetween(mission.startDate, mission.endDate)
        : daysBetween(mission.startDate, today());

    const isActive = !mission.endDate;
    const linkedOperation = operations?.find((op: any) => op.id === mission.operationId);

    const getTypeColor = (type: string) => {
        const colors: any = {
            'Raid': 'var(--color-status-deployed)',
            'Reconnaissance': 'var(--color-accent-primary)',
            'Support': 'var(--color-status-training)',
            'Training': 'var(--color-status-standby)',
            'Other': 'var(--color-text-muted)'
        };
        return colors[type] || 'var(--color-text-muted)';
    };

    return (
        <div style={{
            padding: 'var(--spacing-md)',
            background: 'var(--color-bg-tertiary)',
            border: isActive ? '1px solid var(--color-accent-primary)' : '1px solid var(--color-border-primary)',
            borderRadius: 'var(--radius-sm)',
            position: 'relative'
        }}>
            {isActive && (
                <div style={{
                    position: 'absolute',
                    top: 'var(--spacing-xs)',
                    right: 'var(--spacing-xs)',
                    padding: '3px 8px',
                    background: 'var(--color-accent-primary)',
                    color: 'var(--color-bg-primary)',
                    fontSize: 10,
                    fontWeight: 600,
                    borderRadius: 'var(--radius-sm)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    Active
                </div>
            )}

            <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xs)' }}>
                    <h3 style={{ fontSize: 14, margin: 0 }}>
                        {mission.name}
                    </h3>
                    <span style={{
                        padding: '2px 6px',
                        background: `${getTypeColor(mission.type)}20`,
                        color: getTypeColor(mission.type),
                        border: `1px solid ${getTypeColor(mission.type)}40`,
                        borderRadius: 'var(--radius-sm)',
                        fontSize: 10,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        {mission.type}
                    </span>
                </div>
                {mission.description && (
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-xs)' }}>
                        {mission.description}
                    </div>
                )}
                {linkedOperation && (
                    <div style={{
                        fontSize: 11,
                        color: 'var(--color-accent-primary)',
                        marginTop: 4
                    }}>
                        Part of: {linkedOperation.name}
                    </div>
                )}
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 'var(--spacing-sm)',
                marginBottom: 'var(--spacing-sm)'
            }}>
                <div>
                    <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 2 }}>
                        Start Date
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                        {mission.startDate}
                    </div>
                </div>
                <div>
                    <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 2 }}>
                        End Date
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                        {mission.endDate || 'Ongoing'}
                    </div>
                </div>
                <div>
                    <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 2 }}>
                        Duration
                    </div>
                    <div style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 12,
                        color: 'var(--color-accent-primary)'
                    }}>
                        {duration} days
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                <button onClick={onEdit} style={{ fontSize: 11, padding: '4px 8px' }}>Edit</button>
                <button
                    onClick={onDelete}
                    style={{
                        fontSize: 11,
                        padding: '4px 8px',
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

function MissionForm({ mission, unitId, operations, onDone }: any) {
    const [name, setName] = useState(mission?.name || '');
    const [type, setType] = useState(mission?.type || 'Raid');
    const [operationId, setOperationId] = useState(mission?.operationId || '');
    const [description, setDescription] = useState(mission?.description || '');
    const [startDate, setStartDate] = useState(mission?.startDate || today());
    const [endDate, setEndDate] = useState(mission?.endDate || '');

    const handleSave = async () => {
        await db.missions.put({
            id: mission?.id || crypto.randomUUID(),
            unitId,
            name,
            type,
            operationId: operationId || undefined,
            description: description || undefined,
            startDate,
            endDate: endDate || undefined
        });
        onDone();
    };

    return (
        <div style={{
            padding: 'var(--spacing-md)',
            background: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border-accent)',
            borderRadius: 'var(--radius-sm)',
            marginBottom: 'var(--spacing-md)'
        }}>
            <h3 style={{ fontSize: 14, marginBottom: 'var(--spacing-md)' }}>
                {mission ? 'Edit Mission' : 'New Mission'}
            </h3>

            <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: 4, fontSize: 11, color: 'var(--color-text-muted)' }}>
                        Mission Name
                    </label>
                    <input
                        className="input"
                        placeholder="e.g., Operation Neptune Spear"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-sm)' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: 4, fontSize: 11, color: 'var(--color-text-muted)' }}>
                            Type
                        </label>
                        <select
                            className="input"
                            value={type}
                            onChange={e => setType(e.target.value)}
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
                        <label style={{ display: 'block', marginBottom: 4, fontSize: 11, color: 'var(--color-text-muted)' }}>
                            Link to Operation
                        </label>
                        <select
                            className="input"
                            value={operationId}
                            onChange={e => setOperationId(e.target.value)}
                            style={{ width: '100%' }}
                        >
                            <option value="">None</option>
                            {operations?.map((op: any) => (
                                <option key={op.id} value={op.id}>
                                    {op.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: 4, fontSize: 11, color: 'var(--color-text-muted)' }}>
                        Description (Optional)
                    </label>
                    <textarea
                        className="input"
                        placeholder="Mission details..."
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        rows={2}
                        style={{ resize: 'vertical' }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-sm)' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: 4, fontSize: 11, color: 'var(--color-text-muted)' }}>
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
                        <label style={{ display: 'block', marginBottom: 4, fontSize: 11, color: 'var(--color-text-muted)' }}>
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

            <div style={{ display: 'flex', gap: 'var(--spacing-xs)', marginTop: 'var(--spacing-md)', justifyContent: 'flex-end' }}>
                <button onClick={onDone} style={{ fontSize: 11, padding: '4px 8px', background: 'var(--color-bg-primary)' }}>
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    style={{
                        fontSize: 11,
                        padding: '4px 8px',
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

import { useState, useEffect } from 'react';
import { db } from '../db';
import { useLiveQuery } from 'dexie-react-hooks';

function inferEchelon(name: string): string {
    const lower = name.toLowerCase();
    if (lower.includes('division') || lower.includes('div')) return 'Division';
    if (lower.includes('brigade') || lower.includes('bde')) return 'Brigade';
    if (lower.includes('regiment') || lower.includes('regt')) return 'Regiment';
    if (lower.includes('battalion') || lower.includes('bn')) return 'Battalion';
    if (lower.includes('squadron') || lower.includes('sqn')) return 'Squadron';
    if (lower.includes('company') || lower.includes('co')) return 'Company';
    return 'Battalion'; // default
}

export default function UnitForm({ unit, onDone }: any) {
    const [name, setName] = useState(unit?.name || '');
    const [type, setType] = useState(unit?.type || 'Ground');
    const [echelon, setEchelon] = useState(unit?.echelon || 'Battalion');
    const [status, setStatus] = useState(unit?.status || 'Standby');
    const [rtb, setRtb] = useState(unit?.lastRTBDate || '');
    const [parentId, setParentId] = useState(unit?.parentId || '');
    const [patch, setPatch] = useState(unit?.patch || '');

    const allUnits = useLiveQuery(() => db.units.toArray(), []);

    useEffect(() => {
        if (!unit && name) {
            setEchelon(inferEchelon(name));
        }
    }, [name, unit]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const maxSize = 200;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxSize) {
                        height *= maxSize / width;
                        width = maxSize;
                    }
                } else {
                    if (height > maxSize) {
                        width *= maxSize / height;
                        height = maxSize;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);
                setPatch(canvas.toDataURL('image/png'));
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    async function save() {
        const now = Date.now();

        await db.units.put({
            id: unit?.id || crypto.randomUUID(),
            name,
            type,
            echelon,
            status,
            parentId: parentId || undefined,
            patch: patch || undefined,
            lastRTBDate: rtb || undefined,
            createdAt: unit?.createdAt || now
        });

        onDone();
    }

    async function remove() {
        if (!unit) return;
        await db.units.delete(unit.id);
        onDone();
    }

    return (
        <div className="card">
            <h2>{unit ? 'Edit Unit' : 'Create Unit'}</h2>

            <div style={{ display: 'grid', gap: 16, marginTop: 16 }}>

                <div>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: 14, color: '#9ca3af' }}>
                        Unit Name
                    </label>
                    <input
                        className="input"
                        placeholder="Enter unit name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: 6, fontSize: 14, color: '#9ca3af' }}>
                            Type
                        </label>
                        <select
                            className="input"
                            value={type}
                            onChange={e => setType(e.target.value)}
                            style={{ width: '100%' }}
                        >
                            <option>Ground</option>
                            <option>Air</option>
                            <option>SOF</option>
                            <option>Support</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: 6, fontSize: 14, color: '#9ca3af' }}>
                            Echelon
                        </label>
                        <select
                            className="input"
                            value={echelon}
                            onChange={e => setEchelon(e.target.value)}
                            style={{ width: '100%' }}
                        >
                            <option>Company</option>
                            <option>Squadron</option>
                            <option>Battalion</option>
                            <option>Regiment</option>
                            <option>Brigade</option>
                            <option>Division</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: 14, color: '#9ca3af' }}>
                        Status
                    </label>
                    <select
                        className="input"
                        value={status}
                        onChange={e => setStatus(e.target.value)}
                        style={{ width: '100%' }}
                    >
                        <option>Standby</option>
                        <option>Deployed</option>
                        <option>Training</option>
                        <option>Reset</option>
                    </select>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: 14, color: '#9ca3af' }}>
                        Parent Unit
                    </label>
                    <select
                        className="input"
                        value={parentId}
                        onChange={e => setParentId(e.target.value)}
                        style={{ width: '100%' }}
                    >
                        <option value="">No Parent (Top Level)</option>
                        {allUnits
                            ?.filter(u => u.id !== unit?.id)
                            .map(u => (
                                <option key={u.id} value={u.id}>
                                    {u.name}
                                </option>
                            ))}
                    </select>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: 14, color: '#9ca3af' }}>
                        Last RTB Date
                    </label>
                    <input
                        className="input"
                        type="date"
                        value={rtb}
                        onChange={e => setRtb(e.target.value)}
                        style={{ width: '100%' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: 14, color: '#9ca3af' }}>
                        Unit Patch
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{
                            padding: 8,
                            border: '1px solid #334155',
                            borderRadius: 6,
                            background: '#020617',
                            color: '#9ca3af',
                            width: '100%',
                            cursor: 'pointer'
                        }}
                    />
                    {patch && (
                        <div style={{
                            marginTop: 12,
                            padding: 12,
                            background: '#020617',
                            borderRadius: 8,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12
                        }}>
                            <img
                                src={patch}
                                alt="Unit patch"
                                style={{
                                    width: 80,
                                    height: 80,
                                    objectFit: 'contain',
                                    borderRadius: 4,
                                    border: '1px solid #334155'
                                }}
                            />
                            <button onClick={() => setPatch('')}>Remove Patch</button>
                        </div>
                    )}
                </div>

            </div>

            <div style={{ marginTop: 20, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button onClick={onDone} style={{ background: '#374151' }}>
                    Cancel
                </button>

                {unit && (
                    <button
                        onClick={remove}
                        style={{ background: '#991b1b', borderColor: '#b91c1c' }}
                    >
                        Delete Unit
                    </button>
                )}

                <button
                    onClick={save}
                    style={{ background: '#1e40af', borderColor: '#2563eb' }}
                >
                    {unit ? 'Save Changes' : 'Create Unit'}
                </button>
            </div>
        </div>
    );
}
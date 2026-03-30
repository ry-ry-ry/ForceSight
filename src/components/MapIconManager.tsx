import { useState, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

interface MapIconManagerProps {
    onClose: () => void;
}

export default function MapIconManager({ onClose }: MapIconManagerProps) {
    const mapIcons = useLiveQuery(() => db.mapIcons.toArray(), []);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');

    const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async () => {
            const img = new Image();
            img.onload = async () => {
                const maxSize = 128;
                let w = img.width, h = img.height;
                if (w > maxSize || h > maxSize) {
                    const scale = maxSize / Math.max(w, h);
                    w = Math.round(w * scale);
                    h = Math.round(h * scale);
                }
                const canvas = document.createElement('canvas');
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d')!;
                ctx.drawImage(img, 0, 0, w, h);
                const base64 = canvas.toDataURL('image/png');

                const name = file.name.replace(/\.[^.]+$/, '') || 'Icon';
                await db.mapIcons.put({
                    id: crypto.randomUUID(),
                    name,
                    image: base64,
                    createdAt: Date.now()
                });
            };
            img.src = reader.result as string;
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    }, []);

    const handleDelete = useCallback(async (id: string) => {
        // Check if any pins use this icon
        const pinsUsing = await db.mapPins.where('iconId').equals(id).count();
        if (pinsUsing > 0) {
            if (!confirm(`${pinsUsing} pin(s) use this icon. They will revert to the default pin. Delete anyway?`)) {
                return;
            }
        }
        await db.mapIcons.delete(id);
    }, []);

    const handleRename = useCallback(async (id: string) => {
        if (!editName.trim()) return;
        await db.mapIcons.update(id, { name: editName.trim() });
        setEditingId(null);
        setEditName('');
    }, [editName]);

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.7)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
            <div className="card" style={{
                maxWidth: 600, width: '90%', maxHeight: '80vh',
                display: 'flex', flexDirection: 'column'
            }}>
                <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', marginBottom: 'var(--spacing-lg)'
                }}>
                    <h2 style={{ margin: 0 }}>Map Icons</h2>
                    <button onClick={onClose} style={{ fontSize: 18, padding: '4px 12px' }}>×</button>
                </div>

                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <label style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-sm)',
                        cursor: 'pointer',
                        padding: '8px 16px',
                        background: 'var(--color-accent-primary)',
                        color: 'var(--color-bg-primary)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: 13,
                        fontWeight: 600
                    }}>
                        + Upload Icon
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleUpload}
                            style={{ display: 'none' }}
                        />
                    </label>
                    <span style={{
                        marginLeft: 'var(--spacing-md)',
                        fontSize: 11,
                        color: 'var(--color-text-muted)'
                    }}>
                        Max 128×128px, PNG recommended
                    </span>
                </div>

                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                    gap: 'var(--spacing-md)'
                }}>
                    {(!mapIcons || mapIcons.length === 0) ? (
                        <div style={{
                            gridColumn: '1 / -1',
                            textAlign: 'center',
                            padding: 'var(--spacing-2xl)',
                            color: 'var(--color-text-muted)',
                            fontSize: 13
                        }}>
                            No custom icons uploaded yet
                        </div>
                    ) : mapIcons.map(icon => (
                        <div key={icon.id} style={{
                            background: 'var(--color-bg-tertiary)',
                            borderRadius: 'var(--radius-md)',
                            padding: 'var(--spacing-md)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 'var(--spacing-sm)',
                            border: '1px solid var(--color-border-primary)'
                        }}>
                            <img
                                src={icon.image}
                                alt={icon.name}
                                style={{
                                    width: 48,
                                    height: 48,
                                    objectFit: 'contain',
                                    borderRadius: 'var(--radius-sm)'
                                }}
                            />
                            {editingId === icon.id ? (
                                <div style={{ width: '100%' }}>
                                    <input
                                        className="input"
                                        value={editName}
                                        onChange={e => setEditName(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleRename(icon.id)}
                                        autoFocus
                                        style={{ fontSize: 11, padding: '2px 4px' }}
                                    />
                                    <div style={{ display: 'flex', gap: 2, marginTop: 4 }}>
                                        <button onClick={() => handleRename(icon.id)} style={{ flex: 1, fontSize: 10, padding: '2px' }}>✓</button>
                                        <button onClick={() => setEditingId(null)} style={{ flex: 1, fontSize: 10, padding: '2px' }}>×</button>
                                    </div>
                                </div>
                            ) : (
                                <div style={{
                                    fontSize: 11,
                                    textAlign: 'center',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    width: '100%'
                                }}>
                                    {icon.name}
                                </div>
                            )}
                            <div style={{ display: 'flex', gap: 4, width: '100%' }}>
                                <button
                                    onClick={() => { setEditingId(icon.id); setEditName(icon.name); }}
                                    style={{ flex: 1, fontSize: 10, padding: '2px 4px' }}
                                >
                                    Rename
                                </button>
                                <button
                                    onClick={() => handleDelete(icon.id)}
                                    style={{ flex: 1, fontSize: 10, padding: '2px 4px', color: 'var(--color-status-deployed)' }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

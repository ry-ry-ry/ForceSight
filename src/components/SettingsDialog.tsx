import { useState, useRef, useCallback, useEffect } from 'react';
import { db, getDb, useLiveData } from '../database/adapter';
import { parseBackup, getBackupSummary } from '../database/parser';
import { getConfig } from '../database/config';
import { themes } from '../theme';

const APP_VERSION = '1.0.0';

const BACKEND_LABELS: Record<string, string> = {
    sqlite: 'SQLite (OPFS)',
    indexeddb: 'IndexedDB',
    mysql: 'MySQL',
};

interface Props {
    open: boolean;
    onClose: () => void;
    currentTheme: string;
    setCurrentTheme: (theme: string) => void;
    onRestoreComplete: () => void;
}

export default function SettingsDialog({
    open, onClose, currentTheme, setCurrentTheme, onRestoreComplete
}: Props) {
    const config = getConfig();
    const backend = config.backend ?? 'indexeddb';
    const supportsNativeBackup = backend === 'sqlite' || backend === 'mysql';

    // File extension and label based on backend type
    const nativeBackupExt = backend === 'mysql' ? 'sql' : 'sqlite';
    const nativeBackupLabel = backend === 'mysql' ? 'SQL Dump' : 'SQLite Database';

    const restoreInputRef = useRef<HTMLInputElement>(null);
    const [restoring, setRestoring] = useState(false);
    const [backingUp, setBackingUp] = useState(false);
    const [statusMsg, setStatusMsg] = useState('');
    const [statusType, setStatusType] = useState<'success' | 'error'>('success');

    // Database size — count records across all tables
    const units = useLiveData(() => db.units.toArray(), []);
    const deployments = useLiveData(() => db.deployments.toArray(), []);
    const operations = useLiveData(() => db.operations.toArray(), []);
    const missions = useLiveData(() => db.missions.toArray(), []);
    const taskForces = useLiveData(() => db.taskForces.toArray(), []);
    const mapIcons = useLiveData(() => db.mapIcons.toArray(), []);
    const mapPins = useLiveData(() => db.mapPins.toArray(), []);
    const mapShapes = useLiveData(() => db.mapShapes.toArray(), []);

    const recordCounts = [
        { label: 'Units', count: units?.length ?? 0 },
        { label: 'Deployments', count: deployments?.length ?? 0 },
        { label: 'Operations', count: operations?.length ?? 0 },
        { label: 'Missions', count: missions?.length ?? 0 },
        { label: 'Task Forces', count: taskForces?.length ?? 0 },
        { label: 'Map Icons', count: mapIcons?.length ?? 0 },
        { label: 'Map Pins', count: mapPins?.length ?? 0 },
        { label: 'Map Shapes', count: mapShapes?.length ?? 0 },
    ];
    const totalRecords = recordCounts.reduce((sum, r) => sum + r.count, 0);

    // Close on Escape
    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [open, onClose]);

    const showStatus = (msg: string, type: 'success' | 'error') => {
        setStatusMsg(msg);
        setStatusType(type);
        setTimeout(() => setStatusMsg(''), 4000);
    };

    const handleBackupJson = async () => {
        setBackingUp(true);
        try {
            const backup = await db.exportAll();
            const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `forcesight-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showStatus('JSON backup downloaded successfully.', 'success');
        } catch {
            showStatus('Failed to create JSON backup.', 'error');
        } finally {
            setBackingUp(false);
        }
    };

    const handleBackupNative = async () => {
        setBackingUp(true);
        try {
            const adapter = getDb();
            if (!adapter.exportRaw) return;
            const raw = await adapter.exportRaw();
            const mimeType = backend === 'mysql' ? 'text/plain' : 'application/x-sqlite3';
            const blob = new Blob([raw.buffer as ArrayBuffer], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `forcesight-${new Date().toISOString().split('T')[0]}.${nativeBackupExt}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showStatus(`${nativeBackupLabel} backup downloaded successfully.`, 'success');
        } catch {
            showStatus(`Failed to create ${nativeBackupLabel} backup.`, 'error');
        } finally {
            setBackingUp(false);
        }
    };

    const handleRestore = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setRestoring(true);

        try {
            const ext = file.name.split('.').pop()?.toLowerCase();

            if (ext === 'sqlite' || ext === 'db' || ext === 'sql') {
                const adapter = getDb();
                if (!adapter.importRaw) {
                    showStatus('Native restore requires SQLite or MySQL backend.', 'error');
                    return;
                }
                const buffer = await file.arrayBuffer();
                await adapter.importRaw(new Uint8Array(buffer));
                showStatus(`${nativeBackupLabel} restored successfully.`, 'success');
            } else {
                const text = await file.text();
                const backup = parseBackup(text);
                const summary = getBackupSummary(backup);
                await db.importAll(backup, 'replace');
                showStatus(`Restored: ${summary.join(', ')}`, 'success');
            }

            onRestoreComplete();
        } catch (err) {
            showStatus('Restore failed: ' + (err as Error).message, 'error');
        } finally {
            setRestoring(false);
        }

        e.target.value = '';
    }, [onRestoreComplete, nativeBackupLabel]);

    if (!open) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.6)',
                    zIndex: 1000,
                    backdropFilter: 'blur(4px)',
                }}
            />

            {/* Dialog */}
            <div style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1001,
                width: 'min(560px, 92vw)',
                maxHeight: '85vh',
                overflowY: 'auto',
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border-accent)',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 'var(--spacing-lg)',
                    borderBottom: '1px solid var(--color-border-primary)',
                    position: 'sticky',
                    top: 0,
                    background: 'var(--color-bg-secondary)',
                    zIndex: 1,
                }}>
                    <h2 style={{ fontSize: 18, margin: 0 }}>Settings</h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            fontSize: 20,
                            cursor: 'pointer',
                            color: 'var(--color-text-muted)',
                            lineHeight: 1,
                            padding: '2px 6px',
                        }}
                    >
                        ×
                    </button>
                </div>

                <div style={{ padding: 'var(--spacing-lg)', display: 'grid', gap: 'var(--spacing-lg)' }}>

                    {/* ── Appearance ─────────────────────────────────────── */}
                    <section>
                        <div style={{
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            color: 'var(--color-accent-primary)',
                            marginBottom: 'var(--spacing-sm)',
                            fontFamily: 'var(--font-mono)',
                        }}>
                            Appearance
                        </div>
                        <div style={{
                            padding: 'var(--spacing-md)',
                            background: 'var(--color-bg-tertiary)',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--color-border-primary)',
                        }}>
                            <label style={{ display: 'block', fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 6 }}>
                                Theme
                            </label>
                            <select
                                className="input"
                                value={currentTheme}
                                onChange={e => setCurrentTheme(e.target.value)}
                                style={{ width: '100%' }}
                            >
                                {themes.map((t: { id: string; name: string }) => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>
                    </section>

                    {/* ── Data ────────────────────────────────────────────── */}
                    <section>
                        <div style={{
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            color: 'var(--color-accent-primary)',
                            marginBottom: 'var(--spacing-sm)',
                            fontFamily: 'var(--font-mono)',
                        }}>
                            Data
                        </div>
                        <div style={{
                            padding: 'var(--spacing-md)',
                            background: 'var(--color-bg-tertiary)',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--color-border-primary)',
                            display: 'grid',
                            gap: 'var(--spacing-sm)',
                        }}>
                            <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 2 }}>
                                Backup
                            </div>
                            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
                                <button
                                    onClick={handleBackupJson}
                                    disabled={backingUp}
                                    style={{
                                        flex: 1,
                                        background: 'var(--color-bg-elevated)',
                                        borderColor: 'var(--color-border-accent)',
                                        fontSize: 12,
                                    }}
                                >
                                    ⬇ Export JSON
                                </button>
                                {supportsNativeBackup && (
                                    <button
                                        onClick={handleBackupNative}
                                        disabled={backingUp}
                                        style={{
                                            flex: 1,
                                            background: 'var(--color-bg-elevated)',
                                            borderColor: 'var(--color-border-accent)',
                                            fontSize: 12,
                                        }}
                                    >
                                        ⬇ Export {nativeBackupLabel}
                                    </button>
                                )}
                            </div>

                            <div style={{ borderTop: '1px solid var(--color-border-primary)', paddingTop: 'var(--spacing-sm)' }}>
                                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-sm)' }}>
                                    Restore
                                </div>
                                <button
                                    onClick={() => restoreInputRef.current?.click()}
                                    disabled={restoring}
                                    style={{
                                        width: '100%',
                                        background: 'var(--color-bg-elevated)',
                                        borderColor: 'var(--color-border-accent)',
                                        fontSize: 12,
                                    }}
                                >
                                    {restoring ? 'Restoring...' : '⬆ Import from Backup'}
                                </button>
                                <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 4 }}>
                                    Accepts .json{supportsNativeBackup && (backend === 'mysql' ? ', .sql' : ', .sqlite, .db')} — replaces current data
                                </div>
                                <input
                                    ref={restoreInputRef}
                                    type="file"
                                    accept=".json,.sqlite,.db"
                                    style={{ display: 'none' }}
                                    onChange={handleRestore}
                                />
                            </div>

                            {/* Status message */}
                            {statusMsg && (
                                <div style={{
                                    padding: '8px 12px',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: 12,
                                    fontWeight: 500,
                                    background: statusType === 'success'
                                        ? 'var(--color-status-standby)15'
                                        : '#dc262615',
                                    border: `1px solid ${statusType === 'success' ? 'var(--color-status-standby)40' : '#dc262640'}`,
                                    color: statusType === 'success'
                                        ? 'var(--color-status-standby)'
                                        : '#dc2626',
                                }}>
                                    {statusMsg}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* ── Database info ────────────────────────────────────── */}
                    <section>
                        <div style={{
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            color: 'var(--color-accent-primary)',
                            marginBottom: 'var(--spacing-sm)',
                            fontFamily: 'var(--font-mono)',
                        }}>
                            Database
                        </div>
                        <div style={{
                            padding: 'var(--spacing-md)',
                            background: 'var(--color-bg-tertiary)',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--color-border-primary)',
                            display: 'grid',
                            gap: 'var(--spacing-sm)',
                        }}>
                            <Row label="Backend" value={BACKEND_LABELS[backend] ?? backend} />
                            {backend === 'mysql' && config.mysqlUrl && (
                                <Row label="Server" value={config.mysqlUrl} mono />
                            )}
                            <Row label="Total Records" value={totalRecords.toLocaleString()} mono />

                            {/* Per-table breakdown */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: 4,
                                paddingTop: 4,
                            }}>
                                {recordCounts.filter(r => r.count > 0).map(r => (
                                    <div key={r.label} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        padding: '4px 8px',
                                        background: 'var(--color-bg-primary)',
                                        borderRadius: 'var(--radius-sm)',
                                        fontSize: 11,
                                    }}>
                                        <span style={{ color: 'var(--color-text-secondary)' }}>{r.label}</span>
                                        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent-primary)' }}>
                                            {r.count}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ── About ─────────────────────────────────────────────── */}
                    <section>
                        <div style={{
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            color: 'var(--color-accent-primary)',
                            marginBottom: 'var(--spacing-sm)',
                            fontFamily: 'var(--font-mono)',
                        }}>
                            About
                        </div>
                        <div style={{
                            padding: 'var(--spacing-md)',
                            background: 'var(--color-bg-tertiary)',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--color-border-primary)',
                            display: 'grid',
                            gap: 'var(--spacing-sm)',
                        }}>
                            <Row label="ForceSight" value={`v${APP_VERSION}`} mono />
                            <Row label="React" value="19" mono />
                            <Row label="Build" value={new Date().toISOString().slice(0, 10)} mono />
                        </div>
                    </section>

                </div>
            </div>
        </>
    );
}

function Row({ label, value, mono }: { label: string; value: string | number; mono?: boolean }) {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '6px 0',
            borderBottom: '1px solid var(--color-border-primary)',
            fontSize: 13,
        }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
            <span style={{
                fontFamily: mono ? 'var(--font-mono)' : undefined,
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                fontSize: mono ? 12 : 13,
            }}>
                {value}
            </span>
        </div>
    );
}

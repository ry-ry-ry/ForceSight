import type { BackendType } from '../../database/types';

interface Props {
    backend: BackendType;
    setBackend: (b: BackendType) => void;
    mysqlUrl: string;
    setMysqlUrl: (url: string) => void;
    onNext: () => void;
}

const backends: { id: BackendType; name: string; description: string; warning?: string }[] = [
    {
        id: 'sqlite',
        name: 'SQLite',
        description: 'Local SQLite database stored in the browser\'s Origin Private File System. Fast, reliable, and resistant to browser cache clearing. Best for most users.',
    },
    {
        id: 'mysql',
        name: 'MySQL',
        description: 'Connect to an external MySQL database via a REST proxy server. Ideal for multi-user deployments or centralised data management.',
    },
    {
        id: 'indexeddb',
        name: 'IndexedDB',
        description: 'Browser\'s built-in IndexedDB storage via Dexie. Simple and requires no setup, but data may be cleared by the browser during storage pressure, cache clearing, or privacy operations.',
        warning: 'Data may be lost if the browser clears site storage. Regular backups are strongly recommended.',
    },
];

export default function StepDatabase({ backend, setBackend, mysqlUrl, setMysqlUrl, onNext }: Props) {
    return (
        <div>
            <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <h2 style={{ fontSize: 20, marginBottom: 'var(--spacing-xs)' }}>
                    Choose Database
                </h2>
                <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-lg)' }}>
                    Select how ForceSight stores your data. You can change this later from settings.
                </p>

                <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                    {backends.map(b => (
                        <div
                            key={b.id}
                            onClick={() => setBackend(b.id)}
                            style={{
                                padding: 'var(--spacing-lg)',
                                background: backend === b.id ? 'var(--color-bg-elevated)' : 'var(--color-bg-tertiary)',
                                border: backend === b.id
                                    ? '2px solid var(--color-accent-primary)'
                                    : '2px solid var(--color-border-primary)',
                                borderRadius: 'var(--radius-md)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={e => {
                                if (backend !== b.id) e.currentTarget.style.borderColor = 'var(--color-border-accent)';
                            }}
                            onMouseLeave={e => {
                                if (backend !== b.id) e.currentTarget.style.borderColor = 'var(--color-border-primary)';
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                                <div style={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: '50%',
                                    border: `2px solid ${backend === b.id ? 'var(--color-accent-primary)' : 'var(--color-border-accent)'}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    transition: 'all 0.2s ease'
                                }}>
                                    {backend === b.id && (
                                        <div style={{
                                            width: 10,
                                            height: 10,
                                            borderRadius: '50%',
                                            background: 'var(--color-accent-primary)'
                                        }} />
                                    )}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>
                                        {b.name}
                                    </div>
                                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                                        {b.description}
                                    </div>
                                    {b.warning && (
                                        <div style={{
                                            marginTop: 8,
                                            padding: '6px 10px',
                                            background: 'var(--color-status-training)15',
                                            border: '1px solid var(--color-status-training)40',
                                            borderRadius: 'var(--radius-sm)',
                                            fontSize: 11,
                                            color: 'var(--color-status-training)',
                                            fontWeight: 500,
                                        }}>
                                            ⚠ {b.warning}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* MySQL URL input */}
                {backend === 'mysql' && (
                    <div style={{ marginTop: 'var(--spacing-lg)' }}>
                        <label style={{ display: 'block', marginBottom: 6, fontSize: 12, color: 'var(--color-text-muted)' }}>
                            MySQL Proxy URL
                        </label>
                        <input
                            className="input"
                            placeholder="http://localhost:3001"
                            value={mysqlUrl}
                            onChange={e => setMysqlUrl(e.target.value)}
                        />
                        <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 6 }}>
                            A ForceSight REST proxy server must be running at this address.
                        </div>
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    onClick={onNext}
                    disabled={backend === 'mysql' && !mysqlUrl}
                    style={{
                        background: 'var(--color-accent-primary)',
                        borderColor: 'var(--color-accent-primary)',
                        color: 'var(--color-bg-primary)',
                        opacity: backend === 'mysql' && !mysqlUrl ? 0.5 : 1,
                        cursor: backend === 'mysql' && !mysqlUrl ? 'not-allowed' : 'pointer',
                        fontSize: 14,
                        padding: '10px 28px'
                    }}
                >
                    Next →
                </button>
            </div>
        </div>
    );
}

interface Props {
    cesiumToken: string;
    setCesiumToken: (token: string) => void;
    onBack: () => void;
    onNext: () => void;
}

export default function StepApiKeys({ cesiumToken, setCesiumToken, onBack, onNext }: Props) {
    return (
        <div>
            <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <h2 style={{ fontSize: 20, marginBottom: 'var(--spacing-xs)' }}>
                    API Keys
                </h2>
                <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-lg)' }}>
                    Configure external service integrations. All keys are optional and can be added later.
                </p>

                <div style={{
                    padding: 'var(--spacing-lg)',
                    background: 'var(--color-bg-tertiary)',
                    border: '1px solid var(--color-border-primary)',
                    borderRadius: 'var(--radius-md)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
                        <span style={{ fontSize: 16 }}>🌐</span>
                        <div>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>Cesium Ion Access Token</div>
                            <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                                Required for 3D globe, satellite imagery, and terrain on the Map page
                            </div>
                        </div>
                    </div>

                    <input
                        className="input"
                        placeholder="Paste your Cesium ion access token..."
                        value={cesiumToken}
                        onChange={e => setCesiumToken(e.target.value)}
                        style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}
                    />

                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 8, lineHeight: 1.5 }}>
                        Get a free token at{' '}
                        <span style={{ color: 'var(--color-accent-primary)', fontWeight: 500 }}>
                            cesium.com/ion
                        </span>
                        . The Map page will prompt for this token if not configured here.
                    </div>
                </div>

                {/* Placeholder for future API keys */}
                <div style={{
                    marginTop: 'var(--spacing-md)',
                    padding: 'var(--spacing-md)',
                    background: 'var(--color-bg-tertiary)',
                    border: '1px dashed var(--color-border-primary)',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center',
                    fontSize: 12,
                    color: 'var(--color-text-muted)',
                }}>
                    Additional integrations will appear here in future updates
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                    onClick={onBack}
                    style={{
                        background: 'var(--color-bg-elevated)',
                        borderColor: 'var(--color-border-accent)',
                        fontSize: 14,
                        padding: '10px 28px'
                    }}
                >
                    ← Back
                </button>
                <button
                    onClick={onNext}
                    style={{
                        background: 'var(--color-accent-primary)',
                        borderColor: 'var(--color-accent-primary)',
                        color: 'var(--color-bg-primary)',
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

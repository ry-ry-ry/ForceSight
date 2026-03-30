import { useState } from 'react';
import { setCesiumToken } from '../utils/cesiumToken';

interface CesiumTokenPromptProps {
    onTokenSet: (token: string) => void;
    currentToken?: string | null;
}

export default function CesiumTokenPrompt({ onTokenSet, currentToken }: CesiumTokenPromptProps) {
    const [token, setToken] = useState(currentToken || '');
    const [error, setError] = useState('');

    const handleSave = () => {
        const trimmed = token.trim();
        if (!trimmed) {
            setError('Token cannot be empty');
            return;
        }
        setCesiumToken(trimmed);
        onTokenSet(trimmed);
        setError('');
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            padding: 'var(--spacing-xl)'
        }}>
            <div className="card" style={{
                maxWidth: 520,
                width: '100%',
                textAlign: 'center'
            }}>
                <div style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: 'var(--color-bg-tertiary)',
                    border: '2px solid var(--color-accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto var(--spacing-lg)',
                    fontSize: 24
                }}>
                    🌐
                </div>

                <h2 style={{ marginBottom: 'var(--spacing-sm)' }}>Cesium Ion Token Required</h2>
                <p style={{
                    color: 'var(--color-text-muted)',
                    fontSize: 13,
                    marginBottom: 'var(--spacing-xl)',
                    lineHeight: 1.6
                }}>
                    ForceSight uses CesiumJS for 3D globe rendering. A free Cesium ion
                    access token is required for terrain and imagery.
                </p>

                <div style={{ textAlign: 'left', marginBottom: 'var(--spacing-lg)' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: 6,
                        fontSize: 12,
                        color: 'var(--color-text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        Access Token
                    </label>
                    <input
                        className="input"
                        type="text"
                        value={token}
                        onChange={e => { setToken(e.target.value); setError(''); }}
                        placeholder="Paste your Cesium ion access token..."
                        style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}
                        onKeyDown={e => e.key === 'Enter' && handleSave()}
                    />
                    {error && (
                        <div style={{
                            color: 'var(--color-status-deployed)',
                            fontSize: 12,
                            marginTop: 'var(--spacing-xs)'
                        }}>
                            {error}
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'center' }}>
                    <button
                        onClick={handleSave}
                        style={{
                            background: 'var(--color-accent-primary)',
                            borderColor: 'var(--color-accent-primary)',
                            color: 'var(--color-bg-primary)',
                            padding: '10px 24px'
                        }}
                    >
                        Save Token
                    </button>
                </div>

                <div style={{
                    marginTop: 'var(--spacing-xl)',
                    padding: 'var(--spacing-md)',
                    background: 'var(--color-bg-tertiary)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 11,
                    color: 'var(--color-text-muted)',
                    lineHeight: 1.6,
                    textAlign: 'left'
                }}>
                    <strong style={{ color: 'var(--color-text-secondary)' }}>How to get a token:</strong>
                    <br />
                    1. Go to <span style={{ color: 'var(--color-accent-primary)' }}>cesium.com/ion</span> and create a free account
                    <br />
                    2. Navigate to Access Tokens in your dashboard
                    <br />
                    3. Copy your default token and paste it above
                </div>
            </div>
        </div>
    );
}

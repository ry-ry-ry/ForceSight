import { useState, useEffect } from 'react';
import { isConfigured, getConfig, resetConfig } from './database/config';
import { initDb } from './database/adapter';
import { applyTheme, getStoredTheme } from './theme';
import SetupWizard from './components/setup/SetupWizard';
import App from './App';

/**
 * AppRoot is the application entry point.
 * It handles the first-run setup wizard gate and database initialisation,
 * then renders the main App once the database is ready.
 */
export default function AppRoot() {
    const [state, setState] = useState<'loading' | 'setup' | 'ready' | 'error'>('loading');
    const [errorMsg, setErrorMsg] = useState('');

    // Apply stored theme on mount
    useEffect(() => {
        applyTheme(getStoredTheme());
    }, []);

    useEffect(() => {
        async function bootstrap() {
            // Not yet configured — show setup wizard
            if (!isConfigured()) {
                setState('setup');
                return;
            }

            // Configured — initialise the database and go straight to app
            try {
                const config = getConfig();
                await initDb(config.backend, config.mysqlUrl);
                setState('ready');
            } catch (err) {
                setErrorMsg((err as Error).message);
                setState('error');
            }
        }

        bootstrap();
    }, []);

    const handleSetupComplete = () => {
        setState('ready');
    };

    if (state === 'loading') {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--color-bg-primary)',
                color: 'var(--color-text-muted)',
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
            }}>
                Starting ForceSight...
            </div>
        );
    }

    if (state === 'error') {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--color-bg-primary)',
                flexDirection: 'column',
                gap: 16,
                padding: 32,
            }}>
                <div style={{ fontSize: 18, fontWeight: 600, color: '#dc2626' }}>
                    Database Initialisation Failed
                </div>
                <div style={{ fontSize: 13, color: 'var(--color-text-muted)', maxWidth: 480, textAlign: 'center' }}>
                    {errorMsg}
                </div>
                <button
                    onClick={() => {
                        resetConfig();
                        window.location.reload();
                    }}
                    style={{
                        background: 'var(--color-accent-primary)',
                        borderColor: 'var(--color-accent-primary)',
                        color: 'var(--color-bg-primary)',
                    }}
                >
                    Re-run Setup
                </button>
            </div>
        );
    }

    if (state === 'setup') {
        return <SetupWizard onComplete={handleSetupComplete} />;
    }

    return <App />;
}

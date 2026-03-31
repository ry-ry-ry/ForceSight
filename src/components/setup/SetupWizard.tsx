import { useState } from 'react';
import type { BackendType } from '../../database/types';
import type { BackupData } from '../../database/types';
import { saveConfig, getConfig } from '../../database/config';
import { initDb } from '../../database/adapter';
import StepDatabase from './StepDatabase';
import StepApiKeys from './StepApiKeys';
import StepImport from './StepImport';

interface Props {
    onComplete: () => void;
}

type Step = 'database' | 'apikeys' | 'import' | 'launching';

export default function SetupWizard({ onComplete }: Props) {
    const [step, setStep] = useState<Step>('database');
    const [backend, setBackend] = useState<BackendType>('sqlite');
    const [mysqlUrl, setMysqlUrl] = useState('');
    const [cesiumToken, setCesiumToken] = useState(getConfig().cesiumToken || '');
    const [importData, setImportData] = useState<BackupData | null>(null);
    const [error, setError] = useState('');

    const handleDatabaseNext = () => {
        setStep('apikeys');
    };

    const handleApiKeysNext = () => {
        setStep('import');
    };

    const handleLaunch = async () => {
        setStep('launching');
        setError('');

        try {
            // Save config
            saveConfig({
                configured: true,
                backend,
                mysqlUrl: backend === 'mysql' ? mysqlUrl : undefined,
                cesiumToken: cesiumToken || undefined,
            });

            // Save Cesium token to localStorage (for cesiumToken.ts compatibility)
            if (cesiumToken) {
                try { localStorage.setItem('forcesight-cesium-token', cesiumToken); } catch {}
            }

            // Initialise database
            const adapter = await initDb(backend, mysqlUrl || undefined);

            // Import data if provided
            if (importData) {
                await adapter.importAll(importData, 'replace');
            }

            // Done
            onComplete();
        } catch (err) {
            setError((err as Error).message);
            setStep('import');
        }
    };

    const steps: { key: Step; label: string }[] = [
        { key: 'database', label: 'Database' },
        { key: 'apikeys', label: 'API Keys' },
        { key: 'import', label: 'Import' },
    ];

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--color-bg-primary)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--spacing-2xl)',
        }}>
            {/* Logo / Header */}
            <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
                <h1 style={{
                    fontSize: 36,
                    fontFamily: 'var(--font-heading)',
                    color: 'var(--color-accent-primary)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    marginBottom: 'var(--spacing-xs)'
                }}>
                    ForceSight
                </h1>
                <div style={{
                    fontSize: 13,
                    color: 'var(--color-text-muted)',
                    fontFamily: 'var(--font-mono)',
                }}>
                    Initial Setup
                </div>
            </div>

            {/* Progress bar */}
            <div style={{
                display: 'flex',
                gap: 'var(--spacing-md)',
                marginBottom: 'var(--spacing-xl)',
                alignItems: 'center'
            }}>
                {steps.map((s, i) => (
                    <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-xs)',
                        }}>
                            <div style={{
                                width: 28,
                                height: 28,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 12,
                                fontWeight: 700,
                                fontFamily: 'var(--font-mono)',
                                background: step === s.key
                                    ? 'var(--color-accent-primary)'
                                    : steps.findIndex(x => x.key === step) > i
                                        ? 'var(--color-status-standby)'
                                        : 'var(--color-bg-elevated)',
                                color: step === s.key || steps.findIndex(x => x.key === step) > i
                                    ? 'var(--color-bg-primary)'
                                    : 'var(--color-text-muted)',
                                border: `2px solid ${step === s.key ? 'var(--color-accent-primary)' : 'var(--color-border-accent)'}`,
                                transition: 'all 0.3s ease'
                            }}>
                                {steps.findIndex(x => x.key === step) > i ? '✓' : i + 1}
                            </div>
                            <span style={{
                                fontSize: 12,
                                fontWeight: step === s.key ? 600 : 400,
                                color: step === s.key ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                            }}>
                                {s.label}
                            </span>
                        </div>
                        {i < steps.length - 1 && (
                            <div style={{
                                width: 40,
                                height: 2,
                                background: steps.findIndex(x => x.key === step) > i
                                    ? 'var(--color-accent-primary)'
                                    : 'var(--color-border-primary)',
                                transition: 'background 0.3s ease'
                            }} />
                        )}
                    </div>
                ))}
            </div>

            {/* Step content */}
            <div style={{
                width: '100%',
                maxWidth: 700,
            }}>
                {step === 'database' && (
                    <StepDatabase
                        backend={backend}
                        setBackend={setBackend}
                        mysqlUrl={mysqlUrl}
                        setMysqlUrl={setMysqlUrl}
                        onNext={handleDatabaseNext}
                    />
                )}

                {step === 'apikeys' && (
                    <StepApiKeys
                        cesiumToken={cesiumToken}
                        setCesiumToken={setCesiumToken}
                        onBack={() => setStep('database')}
                        onNext={handleApiKeysNext}
                    />
                )}

                {step === 'import' && (
                    <StepImport
                        importData={importData}
                        setImportData={setImportData}
                        onBack={() => setStep('apikeys')}
                        onLaunch={handleLaunch}
                        error={error}
                    />
                )}

                {step === 'launching' && (
                    <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>
                            Initialising ForceSight...
                        </div>
                        <div style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>
                            Setting up {backend === 'sqlite' ? 'SQLite' : backend === 'mysql' ? 'MySQL' : 'IndexedDB'} database
                            {importData ? ' and importing data' : ''}...
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

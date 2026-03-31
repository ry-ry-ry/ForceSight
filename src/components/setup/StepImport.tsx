import { useState } from 'react';
import type { BackupData } from '../../database/types';
import { parseBackup, getBackupSummary } from '../../database/parser';

interface Props {
    importData: BackupData | null;
    setImportData: (data: BackupData | null) => void;
    onBack: () => void;
    onLaunch: () => void;
    error: string;
}

export default function StepImport({ importData, setImportData, onBack, onLaunch, error }: Props) {
    const [parseError, setParseError] = useState('');
    const [fileName, setFileName] = useState('');

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        setParseError('');

        try {
            const text = await file.text();
            const data = parseBackup(text);
            setImportData(data);
        } catch (err) {
            setParseError((err as Error).message);
            setImportData(null);
        }

        e.target.value = '';
    };

    const summary = importData ? getBackupSummary(importData) : [];

    return (
        <div>
            <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <h2 style={{ fontSize: 20, marginBottom: 'var(--spacing-xs)' }}>
                    Import Data
                </h2>
                <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-lg)' }}>
                    Optionally import an existing ForceSight backup to pre-populate the database. Supports all backup versions.
                </p>

                {/* File upload area */}
                <div
                    style={{
                        padding: 'var(--spacing-xl)',
                        background: 'var(--color-bg-tertiary)',
                        border: `2px dashed ${importData ? 'var(--color-status-standby)' : 'var(--color-border-accent)'}`,
                        borderRadius: 'var(--radius-md)',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                    }}
                    onClick={() => document.getElementById('setup-import-file')?.click()}
                    onMouseEnter={e => {
                        e.currentTarget.style.borderColor = 'var(--color-accent-primary)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.borderColor = importData ? 'var(--color-status-standby)' : 'var(--color-border-accent)';
                    }}
                >
                    <input
                        id="setup-import-file"
                        type="file"
                        accept=".json"
                        style={{ display: 'none' }}
                        onChange={handleFileUpload}
                    />

                    {importData ? (
                        <>
                            <div style={{
                                fontSize: 24,
                                marginBottom: 'var(--spacing-sm)',
                                color: 'var(--color-status-standby)',
                            }}>
                                ✓
                            </div>
                            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 'var(--spacing-xs)' }}>
                                {fileName}
                            </div>
                            <div style={{
                                fontSize: 12,
                                color: 'var(--color-text-muted)',
                                marginBottom: 'var(--spacing-md)',
                            }}>
                                Backup from {importData.timestamp ? new Date(importData.timestamp).toLocaleDateString() : 'unknown date'}
                            </div>

                            {/* Import preview */}
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 'var(--spacing-xs)',
                                justifyContent: 'center',
                            }}>
                                {summary.map((item, i) => (
                                    <span
                                        key={i}
                                        style={{
                                            padding: '3px 10px',
                                            background: 'var(--color-bg-primary)',
                                            border: '1px solid var(--color-border-accent)',
                                            borderRadius: 'var(--radius-sm)',
                                            fontSize: 11,
                                            fontFamily: 'var(--font-mono)',
                                            color: 'var(--color-accent-primary)',
                                        }}
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setImportData(null);
                                    setFileName('');
                                }}
                                style={{
                                    marginTop: 'var(--spacing-md)',
                                    fontSize: 11,
                                    padding: '4px 12px',
                                    background: 'var(--color-bg-primary)',
                                    borderColor: 'var(--color-border-accent)',
                                }}
                            >
                                Remove
                            </button>
                        </>
                    ) : (
                        <>
                            <div style={{
                                fontSize: 24,
                                marginBottom: 'var(--spacing-sm)',
                                color: 'var(--color-text-muted)',
                            }}>
                                📁
                            </div>
                            <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 4 }}>
                                Click to select a backup file
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                                .json files from ForceSight Backup
                            </div>
                        </>
                    )}
                </div>

                {/* Parse error */}
                {parseError && (
                    <div style={{
                        marginTop: 'var(--spacing-md)',
                        padding: 'var(--spacing-md)',
                        background: '#dc262615',
                        border: '1px solid #dc262640',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: 12,
                        color: '#dc2626',
                    }}>
                        {parseError}
                    </div>
                )}

                {/* Launch error */}
                {error && (
                    <div style={{
                        marginTop: 'var(--spacing-md)',
                        padding: 'var(--spacing-md)',
                        background: '#dc262615',
                        border: '1px solid #dc262640',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: 12,
                        color: '#dc2626',
                    }}>
                        Setup error: {error}
                    </div>
                )}
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
                    onClick={onLaunch}
                    style={{
                        background: 'var(--color-accent-primary)',
                        borderColor: 'var(--color-accent-primary)',
                        color: 'var(--color-bg-primary)',
                        fontSize: 14,
                        padding: '10px 28px',
                        fontWeight: 600,
                    }}
                >
                    {importData ? 'Import & Launch ForceSight' : 'Launch ForceSight'}
                </button>
            </div>
        </div>
    );
}

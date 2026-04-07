import { useState, useEffect } from 'react';
import { getConfig, saveConfig, DEFAULT_ECHELONS, AVAILABLE_COUNTRIES } from '../database/config';
import { ALL_ECHELONS, SIZE_SYMBOLS } from '../nato-symbol-library';

interface Props {
    onClose: () => void;
}

export default function AdminPanel({ onClose }: Props) {
    const config = getConfig();
    const [countryEchelons, setCountryEchelons] = useState<Record<string, string[]>>(
        config.countryEchelons || {}
    );
    const [selectedCountry, setSelectedCountry] = useState<string>('');
    const [hasChanges, setHasChanges] = useState(false);

    // Check for changes
    useEffect(() => {
        const original = JSON.stringify(config.countryEchelons || {});
        const current = JSON.stringify(countryEchelons);
        setHasChanges(original !== current);
    }, [countryEchelons, config.countryEchelons]);

    const handleSave = () => {
        const newConfig = { ...getConfig(), countryEchelons };
        saveConfig(newConfig);
        setHasChanges(false);
    };

    const toggleEchelon = (country: string, echelon: string) => {
        setCountryEchelons(prev => {
            const current = prev[country] || [...DEFAULT_ECHELONS];
            const updated = current.includes(echelon)
                ? current.filter(e => e !== echelon)
                : [...current, echelon];
            return { ...prev, [country]: updated };
        });
    };

    const setAllEchelons = (country: string, enabled: boolean) => {
        setCountryEchelons(prev => ({
            ...prev,
            [country]: enabled ? [...ALL_ECHELONS] : []
        }));
    };

    const resetCountry = (country: string) => {
        setCountryEchelons(prev => {
            const updated = { ...prev };
            delete updated[country];
            return updated;
        });
    };

    const getEchelonsForCountry = (country: string): string[] => {
        return countryEchelons[country] || DEFAULT_ECHELONS;
    };

    const isUsingDefaults = (country: string): boolean => {
        return !countryEchelons[country];
    };

    return (
        <div style={{
            padding: 'var(--spacing-lg)',
            maxWidth: 900,
            margin: '0 auto',
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--spacing-lg)',
            }}>
                <h1 style={{ fontSize: 24, margin: 0 }}>Admin Panel</h1>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                    {hasChanges && (
                        <button onClick={handleSave} style={{ background: 'var(--color-accent-primary)' }}>
                            Save Changes
                        </button>
                    )}
                    <button onClick={onClose} style={{ background: 'var(--color-bg-elevated)' }}>
                        Close
                    </button>
                </div>
            </div>

            <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-xl)', fontSize: 14 }}>
                Configure which echelons are available for each country. Countries without custom settings will use the default echelon list.
            </p>

            {/* Default Echelons Info */}
            <section style={{
                marginBottom: 'var(--spacing-xl)',
                padding: 'var(--spacing-md)',
                background: 'var(--color-bg-tertiary)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border-primary)',
            }}>
                <h3 style={{ fontSize: 14, margin: '0 0 var(--spacing-sm)', color: 'var(--color-accent-primary)' }}>
                    Default Echelons
                </h3>
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: '0 0 var(--spacing-sm)' }}>
                    These echelons are shown when a country has no custom configuration:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {DEFAULT_ECHELONS.map(e => (
                        <span key={e} style={{
                            padding: '4px 10px',
                            background: 'var(--color-bg-elevated)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: 12,
                            fontFamily: 'var(--font-mono)',
                        }}>
                            {SIZE_SYMBOLS[e]?.symbol || ''} {e}
                        </span>
                    ))}
                </div>
            </section>

            {/* Country Configuration */}
            <section>
                <h3 style={{ fontSize: 16, margin: '0 0 var(--spacing-md)' }}>
                    Country Echelon Overrides
                </h3>

                {/* Country Selector */}
                <div style={{
                    display: 'flex',
                    gap: 'var(--spacing-sm)',
                    marginBottom: 'var(--spacing-lg)',
                }}>
                    <select
                        className="input"
                        value={selectedCountry}
                        onChange={e => setSelectedCountry(e.target.value)}
                        style={{ flex: 1 }}
                    >
                        <option value="">Select a country to configure...</option>
                        {AVAILABLE_COUNTRIES.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                {/* Selected Country Config */}
                {selectedCountry && (
                    <div style={{
                        padding: 'var(--spacing-md)',
                        background: 'var(--color-bg-tertiary)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border-accent)',
                        marginBottom: 'var(--spacing-lg)',
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 'var(--spacing-md)',
                        }}>
                            <h4 style={{ fontSize: 14, margin: 0 }}>
                                {selectedCountry}
                                {isUsingDefaults(selectedCountry) && (
                                    <span style={{
                                        marginLeft: 8,
                                        fontSize: 11,
                                        color: 'var(--color-text-muted)',
                                        fontWeight: 'normal',
                                    }}>
                                        (using defaults)
                                    </span>
                                )}
                            </h4>
                            <div style={{ display: 'flex', gap: 6 }}>
                                <button
                                    onClick={() => setAllEchelons(selectedCountry, true)}
                                    style={{ fontSize: 11, padding: '4px 8px' }}
                                >
                                    Select All
                                </button>
                                <button
                                    onClick={() => setAllEchelons(selectedCountry, false)}
                                    style={{ fontSize: 11, padding: '4px 8px' }}
                                >
                                    Clear
                                </button>
                                {!isUsingDefaults(selectedCountry) && (
                                    <button
                                        onClick={() => resetCountry(selectedCountry)}
                                        style={{ fontSize: 11, padding: '4px 8px', background: 'var(--color-bg-elevated)' }}
                                    >
                                        Reset to Default
                                    </button>
                                )}
                            </div>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                            gap: 8,
                        }}>
                            {ALL_ECHELONS.map(echelon => {
                                const isEnabled = getEchelonsForCountry(selectedCountry).includes(echelon);
                                return (
                                    <label
                                        key={echelon}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 8,
                                            padding: '8px 10px',
                                            background: isEnabled ? 'var(--color-bg-primary)' : 'transparent',
                                            borderRadius: 'var(--radius-sm)',
                                            cursor: 'pointer',
                                            fontSize: 12,
                                            border: `1px solid ${isEnabled ? 'var(--color-accent-primary)' : 'var(--color-border-primary)'}`,
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isEnabled}
                                            onChange={() => toggleEchelon(selectedCountry, echelon)}
                                            style={{ margin: 0 }}
                                        />
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14 }}>
                                            {SIZE_SYMBOLS[echelon]?.symbol || ''}
                                        </span>
                                        <span>{echelon}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Configured Countries List */}
                {Object.keys(countryEchelons).length > 0 && (
                    <div>
                        <h4 style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: '0 0 var(--spacing-sm)' }}>
                            Configured Countries
                        </h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {Object.entries(countryEchelons).map(([country, echelons]) => (
                                <div
                                    key={country}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        padding: '6px 12px',
                                        background: 'var(--color-bg-tertiary)',
                                        borderRadius: 'var(--radius-sm)',
                                        border: '1px solid var(--color-border-primary)',
                                    }}
                                >
                                    <span style={{ fontSize: 13 }}>{country}</span>
                                    <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                                        ({echelons.length} echelons)
                                    </span>
                                    <button
                                        onClick={() => {
                                            setSelectedCountry(country);
                                        }}
                                        style={{
                                            fontSize: 10,
                                            padding: '2px 6px',
                                            background: 'var(--color-bg-elevated)',
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => resetCountry(country)}
                                        style={{
                                            fontSize: 10,
                                            padding: '2px 6px',
                                            background: 'transparent',
                                            color: 'var(--color-text-muted)',
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}
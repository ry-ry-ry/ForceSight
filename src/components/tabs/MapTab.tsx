import { useState, useCallback } from 'react';
import { db, useLiveData } from '../../database/adapter';
import CesiumMap from '../CesiumMap';
import CesiumTokenPrompt from '../CesiumTokenPrompt';
import { hasCesiumToken } from '../../utils/cesiumToken';
import { getEffectivePatch } from '../../utils';
import type { Unit } from '../../database/types';

export default function MapTab({ unit }: { unit: Unit }) {
    const [tokenReady, setTokenReady] = useState(hasCesiumToken());
    const [showAll, setShowAll] = useState(false);
    const [darkMode, setDarkMode] = useState(true);
    const [showTerrain, setShowTerrain] = useState(true);
    const [flyToTarget, setFlyToTarget] = useState<{ lat: number; lng: number; altitude?: number } | null>(
        unit.locationLat != null && unit.locationLng != null
            ? { lat: unit.locationLat, lng: unit.locationLng, altitude: 15000 }
            : null
    );

    const allUnits = useLiveData(() => db.units.toArray(), []);

    const handleClickLocation = useCallback(async (lat: number, lng: number) => {
        await db.units.update(unit.id, { locationLat: lat, locationLng: lng });
    }, [unit.id]);

    const handleClearLocation = useCallback(async () => {
        await db.units.update(unit.id, { locationLat: undefined, locationLng: undefined });
    }, [unit.id]);

    const handleCenterOnUnit = useCallback(() => {
        if (unit.locationLat != null && unit.locationLng != null) {
            setFlyToTarget({ lat: unit.locationLat, lng: unit.locationLng, altitude: 15000 });
        }
    }, [unit.locationLat, unit.locationLng]);

    const unitsToShow = showAll
        ? allUnits?.filter(u => u.locationLat != null && u.locationLng != null) || []
        : (unit.locationLat != null ? [unit] : []);

    if (!tokenReady) {
        return <CesiumTokenPrompt onTokenSet={() => setTokenReady(true)} />;
    }

    return (
        <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
            {/* Controls */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                flexWrap: 'wrap'
            }}>
                <button onClick={handleCenterOnUnit} style={{ fontSize: 12, padding: '4px 10px' }}>
                    Center on Unit
                </button>
                <button onClick={handleClearLocation} style={{ fontSize: 12, padding: '4px 10px' }}>
                    Clear Location
                </button>

                <div style={{ flex: 1 }} />

                <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, cursor: 'pointer' }}>
                    <input type="checkbox" checked={darkMode} onChange={e => setDarkMode(e.target.checked)} style={{ accentColor: 'var(--color-accent-primary)' }} />
                    Dark
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, cursor: 'pointer' }}>
                    <input type="checkbox" checked={showTerrain} onChange={e => setShowTerrain(e.target.checked)} style={{ accentColor: 'var(--color-accent-primary)' }} />
                    Terrain
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, cursor: 'pointer' }}>
                    <input type="checkbox" checked={showAll} onChange={e => setShowAll(e.target.checked)} style={{ accentColor: 'var(--color-accent-primary)' }} />
                    Show All Units
                </label>
            </div>

            {/* Map */}
            <div style={{
                height: 500,
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                border: '1px solid var(--color-border-primary)'
            }}>
                <CesiumMap
                    units={unitsToShow}
                    allUnits={allUnits}
                    selectedUnitId={unit.id}
                    onClickLocation={handleClickLocation}
                    flyToTarget={flyToTarget}
                    showTerrain={showTerrain}
                    darkMode={darkMode}
                />
            </div>

            {/* Location info */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 'var(--spacing-sm) var(--spacing-md)',
                background: 'var(--color-bg-tertiary)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 12
            }}>
                <span style={{ color: 'var(--color-text-muted)' }}>
                    Click on the map to set unit location
                </span>
                {unit.locationLat != null && unit.locationLng != null ? (
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent-primary)' }}>
                        {unit.locationLat.toFixed(6)}, {unit.locationLng.toFixed(6)}
                    </span>
                ) : (
                    <span style={{ color: 'var(--color-text-muted)' }}>No location set</span>
                )}
            </div>

            {/* Units with locations list */}
            {showAll && allUnits && (
                <div className="card" style={{ padding: 'var(--spacing-md)' }}>
                    <h3 style={{ margin: 0, marginBottom: 'var(--spacing-sm)', fontSize: 14 }}>Units with Locations</h3>
                    <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                        {allUnits
                            .filter(u => u.locationLat != null && u.locationLng != null)
                            .map(u => (
                                <div
                                    key={u.id}
                                    onClick={() => setFlyToTarget({ lat: u.locationLat!, lng: u.locationLng!, altitude: 15000 })}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--spacing-sm)',
                                        padding: 'var(--spacing-xs) var(--spacing-sm)',
                                        cursor: 'pointer',
                                        borderRadius: 'var(--radius-sm)',
                                        fontSize: 12,
                                        background: u.id === unit.id ? 'var(--color-bg-elevated)' : 'transparent',
                                        border: u.id === unit.id ? '1px solid var(--color-accent-primary)' : '1px solid transparent'
                                    }}
                                    onMouseEnter={e => { if (u.id !== unit.id) e.currentTarget.style.background = 'var(--color-bg-tertiary)'; }}
                                    onMouseLeave={e => { if (u.id !== unit.id) e.currentTarget.style.background = 'transparent'; }}
                                >
                                    {getEffectivePatch(u, allUnits) && <img src={getEffectivePatch(u, allUnits)} alt="" style={{ width: 20, height: 20, borderRadius: 2, objectFit: 'contain' }} />}
                                    <span style={{ flex: 1 }}>{u.name}</span>
                                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', fontSize: 10 }}>
                                        {u.locationLat!.toFixed(4)}, {u.locationLng!.toFixed(4)}
                                    </span>
                                </div>
                            ))
                        }
                    </div>
                </div>
            )}
        </div>
    );
}

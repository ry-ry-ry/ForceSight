import { useState, useCallback, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import CesiumMap from './CesiumMap';
import CesiumTokenPrompt from './CesiumTokenPrompt';
import MapSidebar from './map/MapSidebar';
import MapIconManager from './MapIconManager';
import { hasCesiumToken } from '../utils/cesiumToken';
import { exportMapData, importMapData } from '../utils/mapExport';
import { importGeoFile } from '../utils/importHandler';
import { serializeCoordinates, serializeShapeStyle, DEFAULT_SHAPE_STYLE } from '../utils/mapDataHelpers';

export default function MapPage({ onSelectUnit }: { onSelectUnit?: (u: any) => void }) {
    const [tokenReady, setTokenReady] = useState(hasCesiumToken());
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [flyToTarget, setFlyToTarget] = useState<{ lat: number; lng: number; altitude?: number } | null>(null);
    const [drawingMode, setDrawingMode] = useState<'none' | 'polygon' | 'polyline'>('none');
    const [placingPin, setPlacingPin] = useState(false);
    const [showIconManager, setShowIconManager] = useState(false);
    const [drawingCoords, setDrawingCoords] = useState<[number, number][]>([]);

    // Pin creation dialog state
    const [pendingPinLocation, setPendingPinLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [newPinName, setNewPinName] = useState('');

    // Shape creation dialog state
    const [pendingShapeCoords, setPendingShapeCoords] = useState<[number, number][] | null>(null);
    const [newShapeName, setNewShapeName] = useState('');
    const [newShapeColor, setNewShapeColor] = useState(DEFAULT_SHAPE_STYLE.color);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const mapImportRef = useRef<HTMLInputElement>(null);

    const [layers, setLayers] = useState({
        terrain: true,
        darkMode: true,
        buildings: false,
        showUnits: true,
        showPins: true,
        showShapes: true
    });

    const allUnits = useLiveQuery(() => db.units.toArray(), []);
    const mapPins = useLiveQuery(() => db.mapPins.toArray(), []);
    const mapShapes = useLiveQuery(() => db.mapShapes.toArray(), []);
    const mapIcons = useLiveQuery(() => db.mapIcons.toArray(), []);

    const handleLayerToggle = useCallback((key: string, value: boolean) => {
        setLayers(prev => ({ ...prev, [key]: value }));
    }, []);

    const handleMapClick = useCallback((lat: number, lng: number) => {
        if (placingPin) {
            setPendingPinLocation({ lat, lng });
            setNewPinName('');
            setPlacingPin(false);
        } else if (drawingMode !== 'none') {
            setDrawingCoords(prev => [...prev, [lng, lat]]);
        }
    }, [placingPin, drawingMode]);

    const finishDrawing = useCallback(() => {
        if (drawingCoords.length >= 2) {
            // Convert [lng, lat] back to [lat, lng] for storage
            const coords: [number, number][] = drawingCoords.map(([lng, lat]) => [lat, lng]);
            setPendingShapeCoords(coords);
            setNewShapeName('');
            setNewShapeColor(DEFAULT_SHAPE_STYLE.color);
        }
        setDrawingCoords([]);
        setDrawingMode('none');
    }, [drawingCoords]);

    const handleSavePin = useCallback(async () => {
        if (!pendingPinLocation || !newPinName.trim()) return;
        await db.mapPins.put({
            id: crypto.randomUUID(),
            name: newPinName.trim(),
            lat: pendingPinLocation.lat,
            lng: pendingPinLocation.lng,
            createdAt: Date.now()
        });
        setPendingPinLocation(null);
        setNewPinName('');
    }, [pendingPinLocation, newPinName]);

    const handleSaveShape = useCallback(async () => {
        if (!pendingShapeCoords || !newShapeName.trim()) return;
        await db.mapShapes.put({
            id: crypto.randomUUID(),
            name: newShapeName.trim(),
            type: pendingShapeCoords.length >= 3 ? 'polygon' : 'polyline',
            coordinates: serializeCoordinates(pendingShapeCoords),
            style: serializeShapeStyle({ ...DEFAULT_SHAPE_STYLE, color: newShapeColor }),
            createdAt: Date.now()
        });
        setPendingShapeCoords(null);
        setNewShapeName('');
    }, [pendingShapeCoords, newShapeName, newShapeColor]);

    const handleGeoFileImport = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files?.length) return;
        try {
            const result = await importGeoFile(Array.from(files));
            alert(`Imported ${result.pins} pins and ${result.shapes} shapes`);
        } catch (err) {
            alert('Import failed: ' + (err as Error).message);
        }
        e.target.value = '';
    }, []);

    const handleMapDataImport = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const result = await importMapData(file);
            alert(`Imported ${result.icons} icons, ${result.pins} pins, ${result.shapes} shapes`);
        } catch (err) {
            alert('Import failed: ' + (err as Error).message);
        }
        e.target.value = '';
    }, []);

    if (!tokenReady) {
        return (
            <div style={{ height: '100%' }}>
                <CesiumTokenPrompt onTokenSet={() => setTokenReady(true)} />
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', height: '100%', position: 'relative' }}>
            <MapSidebar
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                onFlyTo={(lat, lng, alt) => setFlyToTarget({ lat, lng, altitude: alt })}
                onSelectUnit={u => onSelectUnit?.(u)}
                drawingMode={drawingMode}
                onDrawingModeChange={mode => {
                    setDrawingMode(mode);
                    setDrawingCoords([]);
                }}
                placingPin={placingPin}
                onPlacingPinChange={setPlacingPin}
                layerToggles={layers}
                onLayerToggle={handleLayerToggle}
                onShowIconManager={() => setShowIconManager(true)}
                onImportFile={() => fileInputRef.current?.click()}
                onExportMap={exportMapData}
                onImportMap={() => mapImportRef.current?.click()}
            />

            <div style={{ flex: 1, position: 'relative' }}>
                <CesiumMap
                    units={layers.showUnits ? allUnits : undefined}
                    mapPins={layers.showPins ? mapPins : undefined}
                    mapShapes={layers.showShapes ? mapShapes : undefined}
                    mapIcons={mapIcons}
                    onClickLocation={handleMapClick}
                    flyToTarget={flyToTarget}
                    showTerrain={layers.terrain}
                    darkMode={layers.darkMode}
                    show3DBuildings={layers.buildings}
                />

                {/* Drawing mode indicator */}
                {drawingMode !== 'none' && (
                    <div style={{
                        position: 'absolute',
                        top: 12,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'var(--color-bg-secondary)',
                        border: '1px solid var(--color-accent-primary)',
                        borderRadius: 'var(--radius-md)',
                        padding: '8px 16px',
                        fontSize: 12,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-sm)',
                        zIndex: 10
                    }}>
                        <span style={{ color: 'var(--color-accent-primary)' }}>
                            Drawing {drawingMode} ({drawingCoords.length} points)
                        </span>
                        <button onClick={finishDrawing} style={{ fontSize: 11, padding: '2px 8px' }}>Finish</button>
                        <button onClick={() => { setDrawingMode('none'); setDrawingCoords([]); }} style={{ fontSize: 11, padding: '2px 8px' }}>Cancel</button>
                    </div>
                )}

                {/* Placing pin indicator */}
                {placingPin && (
                    <div style={{
                        position: 'absolute',
                        top: 12,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'var(--color-bg-secondary)',
                        border: '1px solid var(--color-accent-primary)',
                        borderRadius: 'var(--radius-md)',
                        padding: '8px 16px',
                        fontSize: 12,
                        zIndex: 10,
                        color: 'var(--color-accent-primary)'
                    }}>
                        Click on the map to place a pin
                    </div>
                )}
            </div>

            {/* Pin creation dialog */}
            {pendingPinLocation && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.7)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="card" style={{ maxWidth: 400, width: '90%' }}>
                        <h3>New Pin</h3>
                        <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-md)' }}>
                            {pendingPinLocation.lat.toFixed(6)}, {pendingPinLocation.lng.toFixed(6)}
                        </div>
                        <input
                            className="input"
                            placeholder="Pin name..."
                            value={newPinName}
                            onChange={e => setNewPinName(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSavePin()}
                            autoFocus
                        />
                        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-md)', justifyContent: 'flex-end' }}>
                            <button onClick={() => setPendingPinLocation(null)}>Cancel</button>
                            <button onClick={handleSavePin} style={{
                                background: 'var(--color-accent-primary)',
                                color: 'var(--color-bg-primary)'
                            }}>Save Pin</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Shape creation dialog */}
            {pendingShapeCoords && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.7)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="card" style={{ maxWidth: 400, width: '90%' }}>
                        <h3>New Shape</h3>
                        <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-md)' }}>
                            {pendingShapeCoords.length} vertices
                        </div>
                        <input
                            className="input"
                            placeholder="Shape name..."
                            value={newShapeName}
                            onChange={e => setNewShapeName(e.target.value)}
                            style={{ marginBottom: 'var(--spacing-sm)' }}
                            autoFocus
                        />
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                            <label style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Color</label>
                            <input
                                type="color"
                                value={newShapeColor}
                                onChange={e => setNewShapeColor(e.target.value)}
                                style={{ width: 36, height: 28, border: '1px solid var(--color-border-primary)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', padding: 2 }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-md)', justifyContent: 'flex-end' }}>
                            <button onClick={() => setPendingShapeCoords(null)}>Cancel</button>
                            <button onClick={handleSaveShape} style={{
                                background: 'var(--color-accent-primary)',
                                color: 'var(--color-bg-primary)'
                            }}>Save Shape</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Icon manager modal */}
            {showIconManager && (
                <MapIconManager onClose={() => setShowIconManager(false)} />
            )}

            {/* Hidden file inputs */}
            <input ref={fileInputRef} type="file" accept=".kml,.kmz,.shp,.dbf,.shx" multiple style={{ display: 'none' }} onChange={handleGeoFileImport} />
            <input ref={mapImportRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleMapDataImport} />
        </div>
    );
}

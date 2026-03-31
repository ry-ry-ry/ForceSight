import { useState, useCallback } from 'react';
import { db, useLiveData } from '../../database/adapter';

interface MapSidebarProps {
    collapsed: boolean;
    onToggle: () => void;
    onFlyTo: (lat: number, lng: number, altitude?: number) => void;
    onSelectUnit: (unit: { id: string; name: string; locationLat?: number; locationLng?: number }) => void;
    drawingMode: 'none' | 'polygon' | 'polyline';
    onDrawingModeChange: (mode: 'none' | 'polygon' | 'polyline') => void;
    placingPin: boolean;
    onPlacingPinChange: (placing: boolean) => void;
    layerToggles: {
        terrain: boolean;
        darkMode: boolean;
        buildings: boolean;
        showUnits: boolean;
        showPins: boolean;
        showShapes: boolean;
    };
    onLayerToggle: (key: string, value: boolean) => void;
    onShowIconManager: () => void;
    onImportFile: () => void;
    onExportMap: () => void;
    onImportMap: () => void;
}

export default function MapSidebar({
    collapsed,
    onToggle,
    onFlyTo,
    onSelectUnit,
    drawingMode,
    onDrawingModeChange,
    placingPin,
    onPlacingPinChange,
    layerToggles,
    onLayerToggle,
    onShowIconManager,
    onImportFile,
    onExportMap,
    onImportMap
}: MapSidebarProps) {
    const [expandedPanel, setExpandedPanel] = useState<string>('layers');

    const allUnits = useLiveData(() => db.units.toArray(), []);
    const mapPins = useLiveData(() => db.mapPins.toArray(), []);
    const mapShapes = useLiveData(() => db.mapShapes.toArray(), []);

    const unitsWithLocation = allUnits?.filter(u => u.locationLat != null && u.locationLng != null) || [];

    const togglePanel = (panel: string) => {
        setExpandedPanel(expandedPanel === panel ? '' : panel);
    };

    const handleDeletePin = useCallback(async (id: string) => {
        await db.mapPins.delete(id);
    }, []);

    const handleDeleteShape = useCallback(async (id: string) => {
        await db.mapShapes.delete(id);
    }, []);

    if (collapsed) {
        return (
            <div style={{
                width: 40,
                background: 'var(--color-bg-secondary)',
                borderRight: '1px solid var(--color-border-primary)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingTop: 'var(--spacing-sm)',
                flexShrink: 0
            }}>
                <button
                    onClick={onToggle}
                    style={{ padding: '4px 6px', fontSize: 14 }}
                    title="Expand sidebar"
                >
                    ▶
                </button>
            </div>
        );
    }

    const panelHeaderStyle = (panel: string): React.CSSProperties => ({
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'var(--spacing-sm) var(--spacing-md)',
        cursor: 'pointer',
        background: expandedPanel === panel ? 'var(--color-bg-tertiary)' : 'transparent',
        borderBottom: '1px solid var(--color-border-primary)',
        fontSize: 12,
        fontWeight: 600,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.5px',
        color: expandedPanel === panel ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)'
    });

    const panelContentStyle: React.CSSProperties = {
        padding: 'var(--spacing-sm)',
        borderBottom: '1px solid var(--color-border-primary)',
        maxHeight: 300,
        overflowY: 'auto'
    };

    return (
        <div style={{
            width: 300,
            background: 'var(--color-bg-secondary)',
            borderRight: '1px solid var(--color-border-primary)',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            overflowY: 'auto'
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 'var(--spacing-sm) var(--spacing-md)',
                borderBottom: '1px solid var(--color-border-primary)',
                background: 'var(--color-bg-tertiary)'
            }}>
                <h3 style={{ margin: 0, fontSize: 14 }}>Map Controls</h3>
                <button onClick={onToggle} style={{ padding: '2px 6px', fontSize: 12 }}>◀</button>
            </div>

            {/* Layers Panel */}
            <div onClick={() => togglePanel('layers')} style={panelHeaderStyle('layers')}>
                <span>◈ Layers</span>
                <span>{expandedPanel === 'layers' ? '▾' : '▸'}</span>
            </div>
            {expandedPanel === 'layers' && (
                <div style={panelContentStyle}>
                    <div style={{ display: 'grid', gap: 'var(--spacing-xs)' }}>
                        {[
                            { key: 'darkMode', label: 'Dark Map' },
                            { key: 'terrain', label: 'Terrain' },
                            { key: 'buildings', label: '3D Buildings' },
                            { key: 'showUnits', label: 'Show Units' },
                            { key: 'showPins', label: 'Show Pins' },
                            { key: 'showShapes', label: 'Show Shapes' }
                        ].map(item => (
                            <label key={item.key} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-sm)',
                                padding: 'var(--spacing-xs)',
                                fontSize: 12,
                                cursor: 'pointer'
                            }}>
                                <input
                                    type="checkbox"
                                    checked={(layerToggles as Record<string, boolean>)[item.key]}
                                    onChange={e => onLayerToggle(item.key, e.target.checked)}
                                    style={{ accentColor: 'var(--color-accent-primary)' }}
                                />
                                {item.label}
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Units Panel */}
            <div onClick={() => togglePanel('units')} style={panelHeaderStyle('units')}>
                <span>◉ Units ({unitsWithLocation.length})</span>
                <span>{expandedPanel === 'units' ? '▾' : '▸'}</span>
            </div>
            {expandedPanel === 'units' && (
                <div style={panelContentStyle}>
                    {unitsWithLocation.length === 0 ? (
                        <div style={{ fontSize: 11, color: 'var(--color-text-muted)', textAlign: 'center', padding: 'var(--spacing-md)' }}>
                            No units with locations
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: 2 }}>
                            {unitsWithLocation.map(unit => (
                                <div
                                    key={unit.id}
                                    onClick={() => {
                                        onFlyTo(unit.locationLat!, unit.locationLng!, 15000);
                                        onSelectUnit(unit);
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--spacing-sm)',
                                        padding: 'var(--spacing-xs) var(--spacing-sm)',
                                        borderRadius: 'var(--radius-sm)',
                                        cursor: 'pointer',
                                        fontSize: 12,
                                        transition: 'background 0.15s'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg-tertiary)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    {unit.patch && (
                                        <img src={unit.patch} alt="" style={{ width: 20, height: 20, borderRadius: 2, objectFit: 'contain' }} />
                                    )}
                                    <div style={{ flex: 1, overflow: 'hidden' }}>
                                        <div style={{ fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{unit.name}</div>
                                        <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>
                                            {unit.locationLat!.toFixed(4)}, {unit.locationLng!.toFixed(4)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Pins Panel */}
            <div onClick={() => togglePanel('pins')} style={panelHeaderStyle('pins')}>
                <span>📌 Pins ({mapPins?.length || 0})</span>
                <span>{expandedPanel === 'pins' ? '▾' : '▸'}</span>
            </div>
            {expandedPanel === 'pins' && (
                <div style={panelContentStyle}>
                    <div style={{ display: 'flex', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-sm)' }}>
                        <button
                            onClick={() => onPlacingPinChange(!placingPin)}
                            style={{
                                flex: 1,
                                fontSize: 11,
                                padding: '4px 8px',
                                background: placingPin ? 'var(--color-accent-primary)' : 'var(--color-bg-elevated)',
                                color: placingPin ? 'var(--color-bg-primary)' : 'var(--color-text-primary)'
                            }}
                        >
                            {placingPin ? '✓ Click Map to Place' : '+ Add Pin'}
                        </button>
                        <button onClick={onShowIconManager} style={{ fontSize: 11, padding: '4px 8px' }}>
                            Icons
                        </button>
                    </div>
                    {mapPins?.map(pin => (
                        <div key={pin.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: 'var(--spacing-xs) var(--spacing-sm)',
                            fontSize: 11,
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer'
                        }}
                        onClick={() => onFlyTo(pin.lat, pin.lng, 5000)}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg-tertiary)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                            <span>{pin.name}</span>
                            <button onClick={e => { e.stopPropagation(); handleDeletePin(pin.id); }} style={{ fontSize: 10, padding: '2px 4px', color: 'var(--color-status-deployed)' }}>×</button>
                        </div>
                    ))}
                </div>
            )}

            {/* Shapes Panel */}
            <div onClick={() => togglePanel('shapes')} style={panelHeaderStyle('shapes')}>
                <span>▬ Shapes ({mapShapes?.length || 0})</span>
                <span>{expandedPanel === 'shapes' ? '▾' : '▸'}</span>
            </div>
            {expandedPanel === 'shapes' && (
                <div style={panelContentStyle}>
                    <div style={{ display: 'flex', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-sm)' }}>
                        <button
                            onClick={() => onDrawingModeChange(drawingMode === 'polygon' ? 'none' : 'polygon')}
                            style={{
                                flex: 1,
                                fontSize: 11,
                                padding: '4px 8px',
                                background: drawingMode === 'polygon' ? 'var(--color-accent-primary)' : 'var(--color-bg-elevated)',
                                color: drawingMode === 'polygon' ? 'var(--color-bg-primary)' : 'var(--color-text-primary)'
                            }}
                        >
                            {drawingMode === 'polygon' ? '✓ Drawing...' : '▭ Polygon'}
                        </button>
                        <button
                            onClick={() => onDrawingModeChange(drawingMode === 'polyline' ? 'none' : 'polyline')}
                            style={{
                                flex: 1,
                                fontSize: 11,
                                padding: '4px 8px',
                                background: drawingMode === 'polyline' ? 'var(--color-accent-primary)' : 'var(--color-bg-elevated)',
                                color: drawingMode === 'polyline' ? 'var(--color-bg-primary)' : 'var(--color-text-primary)'
                            }}
                        >
                            {drawingMode === 'polyline' ? '✓ Drawing...' : '╱ Line'}
                        </button>
                    </div>
                    {mapShapes?.map(shape => (
                        <div key={shape.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: 'var(--spacing-xs) var(--spacing-sm)',
                            fontSize: 11,
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg-tertiary)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <span style={{ color: 'var(--color-accent-primary)' }}>{shape.type === 'polygon' ? '▭' : '╱'}</span>
                                {shape.name}
                            </span>
                            <button onClick={e => { e.stopPropagation(); handleDeleteShape(shape.id); }} style={{ fontSize: 10, padding: '2px 4px', color: 'var(--color-status-deployed)' }}>×</button>
                        </div>
                    ))}
                </div>
            )}

            {/* Import / Export Panel */}
            <div onClick={() => togglePanel('io')} style={panelHeaderStyle('io')}>
                <span>⬡ Import / Export</span>
                <span>{expandedPanel === 'io' ? '▾' : '▸'}</span>
            </div>
            {expandedPanel === 'io' && (
                <div style={panelContentStyle}>
                    <div style={{ display: 'grid', gap: 'var(--spacing-xs)' }}>
                        <button onClick={onImportFile} style={{ fontSize: 11, padding: '6px 8px', textAlign: 'left' }}>
                            📂 Import KML / KMZ / Shapefile
                        </button>
                        <button onClick={onExportMap} style={{ fontSize: 11, padding: '6px 8px', textAlign: 'left' }}>
                            ⬇ Export Map Data (JSON)
                        </button>
                        <button onClick={onImportMap} style={{ fontSize: 11, padding: '6px 8px', textAlign: 'left' }}>
                            ⬆ Import Map Data (JSON)
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import type { LeafletMouseEvent, LatLngExpression } from 'leaflet';
import { useState, useEffect } from 'react';
import { db } from '../../db';
import { useLiveQuery } from 'dexie-react-hooks';
import 'leaflet/dist/leaflet.css';

function Click({ setLoc }: { setLoc: (latlng: { lat: number; lng: number }) => void }) {
    useMapEvents({
        click(e: LeafletMouseEvent) {
            setLoc(e.latlng);
        }
    });
    return null;
}

function MapController({ center, zoom }: { center: LatLngExpression; zoom: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

export default function MapTab({ unit }: any) {
    const [mapStyle, setMapStyle] = useState<'street' | 'satellite' | 'terrain' | 'dark'>('street');
    const [showAllUnits, setShowAllUnits] = useState(false);
    const [zoom, setZoom] = useState(unit?.locationLat ? 6 : 2);
    const [center, setCenter] = useState<LatLngExpression>(
        unit?.locationLat && unit?.locationLng
            ? [unit.locationLat, unit.locationLng]
            : [20, 0]
    );

    const allUnits = useLiveQuery(() => db.units.toArray(), []);
    const unitsWithLocation = allUnits?.filter(u => u.locationLat && u.locationLng) || [];

    async function updateLocation(data: any) {
        await db.units.update(unit.id, data);
    }

    const getTileLayer = () => {
        switch (mapStyle) {
            case 'satellite':
                return {
                    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                    attribution: 'Tiles &copy; Esri'
                };
            case 'terrain':
                return {
                    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
                    attribution: 'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap'
                };
            case 'dark':
                return {
                    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
                    attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
                };
            default:
                return {
                    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    attribution: '&copy; OpenStreetMap contributors'
                };
        }
    };

    const tileLayer = getTileLayer();

    const handleCenterOnUnit = () => {
        if (unit?.locationLat && unit?.locationLng) {
            setCenter([unit.locationLat, unit.locationLng]);
            setZoom(8);
        }
    };

    const handleClearLocation = async () => {
        if (confirm('Clear this unit\'s location?')) {
            await db.units.update(unit.id, { locationLat: undefined, locationLng: undefined });
        }
    };

    return (
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                    <h3>Unit Location</h3>
                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
                        <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                            Click map to set location
                        </span>
                    </div>
                </div>

                {/* Map Controls */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 'var(--spacing-sm)',
                    marginBottom: 'var(--spacing-lg)'
                }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: 4, fontSize: 11, color: 'var(--color-text-muted)' }}>
                            Map Style
                        </label>
                        <select
                            className="input"
                            value={mapStyle}
                            onChange={e => setMapStyle(e.target.value as any)}
                            style={{ width: '100%' }}
                        >
                            <option value="street">Street Map</option>
                            <option value="satellite">Satellite</option>
                            <option value="terrain">Terrain</option>
                            <option value="dark">Dark Mode</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: 4, fontSize: 11, color: 'var(--color-text-muted)' }}>
                            Zoom Level
                        </label>
                        <input
                            type="range"
                            min="2"
                            max="18"
                            value={zoom}
                            onChange={e => setZoom(Number(e.target.value))}
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: 'var(--spacing-xs)', alignItems: 'flex-end' }}>
                        <button
                            onClick={handleCenterOnUnit}
                            disabled={!unit?.locationLat}
                            style={{
                                fontSize: 11,
                                padding: '6px 10px',
                                opacity: unit?.locationLat ? 1 : 0.5
                            }}
                        >
                            Center on Unit
                        </button>
                        <button
                            onClick={handleClearLocation}
                            disabled={!unit?.locationLat}
                            style={{
                                fontSize: 11,
                                padding: '6px 10px',
                                background: 'var(--color-bg-primary)',
                                opacity: unit?.locationLat ? 1 : 0.5
                            }}
                        >
                            Clear Location
                        </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-xs)',
                            cursor: 'pointer',
                            fontSize: 12
                        }}>
                            <input
                                type="checkbox"
                                checked={showAllUnits}
                                onChange={e => setShowAllUnits(e.target.checked)}
                            />
                            Show All Units ({unitsWithLocation.length})
                        </label>
                    </div>
                </div>

                {/* Current Location Info */}
                {unit?.locationLat && unit?.locationLng && (
                    <div style={{
                        padding: 'var(--spacing-sm)',
                        background: 'var(--color-bg-tertiary)',
                        borderRadius: 'var(--radius-sm)',
                        marginBottom: 'var(--spacing-lg)',
                        fontSize: 12,
                        fontFamily: 'JetBrains Mono'
                    }}>
                        <span style={{ color: 'var(--color-text-muted)' }}>Current Position:</span>{' '}
                        <span style={{ color: 'var(--color-accent-primary)' }}>
                            {unit.locationLat.toFixed(6)}, {unit.locationLng.toFixed(6)}
                        </span>
                    </div>
                )}

                {/* Map */}
                <div style={{
                    height: '600px',
                    width: '100%',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    border: '2px solid var(--color-border-primary)'
                }}>
                    <MapContainer
                        center={center}
                        zoom={zoom}
                        scrollWheelZoom={true}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            attribution={tileLayer.attribution}
                            url={tileLayer.url}
                        />

                        <MapController center={center} zoom={zoom} />

                        {/* Current unit marker */}
                        {unit?.locationLat && unit?.locationLng && (
                            <Marker position={[unit.locationLat, unit.locationLng] as LatLngExpression} />
                        )}

                        {/* All units markers */}
                        {showAllUnits && unitsWithLocation.map(u => (
                            u.id !== unit.id && (
                                <Marker
                                    key={u.id}
                                    position={[u.locationLat!, u.locationLng!] as LatLngExpression}
                                />
                            )
                        ))}

                        <Click setLoc={(p) => updateLocation({ locationLat: p.lat, locationLng: p.lng })} />
                    </MapContainer>
                </div>

                {/* Units List */}
                {showAllUnits && unitsWithLocation.length > 0 && (
                    <div style={{ marginTop: 'var(--spacing-lg)' }}>
                        <h3 style={{ fontSize: 14, marginBottom: 'var(--spacing-sm)' }}>
                            Units with Locations ({unitsWithLocation.length})
                        </h3>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                            gap: 'var(--spacing-sm)',
                            maxHeight: '200px',
                            overflowY: 'auto'
                        }}>
                            {unitsWithLocation.map(u => (
                                <div
                                    key={u.id}
                                    onClick={() => {
                                        setCenter([u.locationLat!, u.locationLng!]);
                                        setZoom(8);
                                    }}
                                    style={{
                                        padding: 'var(--spacing-sm)',
                                        background: u.id === unit.id ? 'var(--color-bg-elevated)' : 'var(--color-bg-tertiary)',
                                        border: u.id === unit.id ? '1px solid var(--color-accent-primary)' : '1px solid var(--color-border-primary)',
                                        borderRadius: 'var(--radius-sm)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        fontSize: 12
                                    }}
                                    onMouseEnter={(e) => {
                                        if (u.id !== unit.id) {
                                            e.currentTarget.style.background = 'var(--color-bg-elevated)';
                                            e.currentTarget.style.borderColor = 'var(--color-accent-primary)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (u.id !== unit.id) {
                                            e.currentTarget.style.background = 'var(--color-bg-tertiary)';
                                            e.currentTarget.style.borderColor = 'var(--color-border-primary)';
                                        }
                                    }}
                                >
                                    <div style={{ fontWeight: 600, marginBottom: 2 }}>{u.name}</div>
                                    <div style={{ fontSize: 10, color: 'var(--color-text-muted)', fontFamily: 'JetBrains Mono' }}>
                                        {u.locationLat!.toFixed(4)}, {u.locationLng!.toFixed(4)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import type { LeafletMouseEvent, LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

function Click({ setLoc }: { setLoc: (latlng: { lat: number; lng: number }) => void }) {
    useMapEvents({
        click(e: LeafletMouseEvent) {
            setLoc(e.latlng);
        }
    });
    return null;
}

export default function MapView({ unit, update }: any) {
    const center: LatLngExpression = [20, 0];

    return (
        <div style={{ height: '250px', width: '100%' }}>
            <MapContainer
                center={center}
                zoom={2}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {unit?.locationLat && unit?.locationLng && (
                    <Marker position={[unit.locationLat, unit.locationLng] as LatLngExpression} />
                )}

                <Click
                    setLoc={(p) =>
                        update({ locationLat: p.lat, locationLng: p.lng })
                    }
                />
            </MapContainer>
        </div>
    );
}
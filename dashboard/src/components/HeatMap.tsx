import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { fetchHeatmapData } from '../services/api';

interface HeatPoint {
    centroid: { lat: number; lng: number };
    incidentCount: number;
}

const HeatMap: React.FC = () => {
    const [points, setPoints] = useState<HeatPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchHeatmapData();
                setPoints(Array.isArray(data) ? data : []);
            } catch {
                setError('Failed to load heatmap data');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) return <div>Loading heat map...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div>
            <h3>Disease Outbreak Heat Map</h3>
            <MapContainer center={[0, 30]} zoom={3} style={{ height: 400, width: '100%', borderRadius: 8 }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                {points.map((p, i) => (
                    <CircleMarker
                        key={i}
                        center={[p.centroid.lat, p.centroid.lng]}
                        radius={Math.min(p.incidentCount * 5, 30)}
                        pathOptions={{ color: '#f44336', fillColor: '#f44336', fillOpacity: 0.5 }}
                    >
                        <Popup>{p.incidentCount} incidents in this area</Popup>
                    </CircleMarker>
                ))}
            </MapContainer>
        </div>
    );
};

export default HeatMap;
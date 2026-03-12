import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Popup, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { fetchIncidents, fetchQuarantineZones } from '../services/api';
import 'leaflet/dist/leaflet.css';

/* Fly to a position when it changes */
const FlyTo: React.FC<{ position: [number, number] | null }> = ({ position }) => {
    const map = useMap();
    useEffect(() => {
        if (position) map.flyTo(position, 10, { duration: 1.2 });
    }, [position, map]);
    return null;
};

const statusColors: Record<string, string> = {
    confirmed_outbreak: '#e94e4e',
    under_investigation: '#f59e0b',
    reported: '#3b82f6',
    resolved: '#10b981',
};

const statusLabel = (s: string) => (s || 'reported').replace(/_/g, ' ');

const OutbreakMap: React.FC = () => {
    const [incidents, setIncidents]     = useState<any[]>([]);
    const [zones, setZones]             = useState<any[]>([]);
    const [flyTarget, setFlyTarget]     = useState<[number, number] | null>(null);
    const [selectedId, setSelectedId]   = useState<string | null>(null);
    const [showList, setShowList]       = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const [incData, zoneData] = await Promise.all([fetchIncidents(), fetchQuarantineZones()]);
                setIncidents(Array.isArray(incData) ? incData : incData.data ?? []);
                setZones(Array.isArray(zoneData) ? zoneData : zoneData.data ?? []);
            } catch (err) { console.error('Map load error:', err); }
        })();
    }, []);

    const incidentsWithCoords = incidents.filter((i) => i.gpsLocation?.coordinates);
    const zonesWithCoords     = zones.filter((z) => z.centerPoint?.coordinates);

    const getFarmName = (inc: any) =>
        typeof inc.farmId === 'object' && inc.farmId?.name ? inc.farmId.name : 'Unknown farm';

    const handleFocus = (inc: any) => {
        const [lng, lat] = inc.gpsLocation.coordinates;
        setFlyTarget([lat, lng]);
        setSelectedId(inc._id);
    };

    return (
        <div className="app-content">
            {/* Toggle incidents list — visible on mobile */}
            <button
                type="button"
                className="btn btn-secondary map-toggle-btn"
                onClick={() => setShowList(!showList)}
            >
                {showList ? '🗺 Hide list' : '📋 Show incidents'}
                <span style={{ marginLeft: 4, fontSize: 11, color: '#888' }}>
                    ({incidentsWithCoords.length})
                </span>
            </button>

            <div className="map-outer-layout">
                {/* ── Incident list panel ── */}
                <div className={`map-list-panel${showList ? '' : ' hidden'}`}>
                    <div className="map-list-panel-head">
                        <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a2e' }}>Active Incidents</div>
                        <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>
                            {incidentsWithCoords.length} with GPS location
                        </div>
                    </div>

                    <div className="map-list-panel-body">
                        {incidentsWithCoords.length === 0 ? (
                            <div style={{ padding: 16, color: '#888', fontSize: 13 }}>
                                No incidents with GPS data.
                            </div>
                        ) : (
                            incidentsWithCoords.map((inc) => {
                                const s = (inc.status || 'reported').toLowerCase();
                                const color = statusColors[s] || '#888';
                                const isSel = inc._id === selectedId;
                                return (
                                    <button
                                        key={inc._id}
                                        type="button"
                                        className={`incident-list-btn${isSel ? ' selected' : ''}`}
                                        style={{ borderLeftColor: isSel ? color : 'transparent' }}
                                        onClick={() => handleFocus(inc)}
                                    >
                                        <div style={{ fontWeight: 600, fontSize: 13, color: '#1a1a2e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {getFarmName(inc)}
                                        </div>
                                        <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>
                                            {inc.species}&nbsp;·&nbsp;
                                            <span style={{ color }}>{statusLabel(inc.status)}</span>
                                        </div>
                                        <div style={{ fontSize: 10, color: '#aaa', marginTop: 1 }}>
                                            {inc.createdAt
                                                ? new Date(inc.createdAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })
                                                : ''}
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>

                    <div className="map-list-panel-foot">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            style={{ width: '100%', fontSize: 12 }}
                            onClick={() => navigate('/incidents')}
                        >
                            Manage Incidents
                        </button>
                    </div>
                </div>

                {/* ── Map panel ── */}
                <div className="map-container-panel">
                    <div className="map-toolbar">
                        <div>
                            <span style={{ fontWeight: 700, fontSize: 15, color: '#1a1a2e' }}>Outbreak Map</span>
                            <span style={{ fontSize: 12, color: '#888', marginLeft: 8 }}>Geographic disease surveillance</span>
                        </div>
                        <div className="map-legend">
                            {Object.entries(statusColors).map(([k, c]) => (
                                <span key={k} className="map-legend-item">
                                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: c, display: 'inline-block', flexShrink: 0 }} />
                                    {statusLabel(k)}
                                </span>
                            ))}
                            <span className="map-legend-item">
                                <span style={{ width: 8, height: 8, background: '#e94e4e', opacity: 0.4, display: 'inline-block', flexShrink: 0 }} />
                                Quarantine zone
                            </span>
                        </div>
                    </div>

                    <MapContainer
                        center={[-29.0, 25.0]}
                        zoom={6}
                        style={{ flex: 1, minHeight: 300, width: '100%' }}
                    >
                        <FlyTo position={flyTarget} />
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />

                        {incidentsWithCoords.map((inc) => {
                            const [lng, lat] = inc.gpsLocation.coordinates;
                            const s = (inc.status || 'reported').toLowerCase();
                            const color = statusColors[s] || '#888';
                            const isSel = inc._id === selectedId;
                            return (
                                <Circle
                                    key={inc._id}
                                    center={[lat, lng]}
                                    radius={4000}
                                    pathOptions={{
                                        color,
                                        fillColor: color,
                                        fillOpacity: isSel ? 0.35 : 0.18,
                                        weight: isSel ? 2.5 : 1.5,
                                    }}
                                >
                                    <Popup>
                                        <strong>{getFarmName(inc)}</strong><br />
                                        Status: <b>{statusLabel(inc.status)}</b><br />
                                        Species: {inc.species}<br />
                                        {inc.description && <em>{inc.description}</em>}
                                    </Popup>
                                </Circle>
                            );
                        })}

                        {zonesWithCoords.map((z) => (
                            <Circle
                                key={z._id}
                                center={[z.centerPoint.coordinates[1], z.centerPoint.coordinates[0]]}
                                radius={(z.radiusKm || 5) * 1000}
                                pathOptions={{ color: '#e94e4e', fillColor: '#e94e4e', fillOpacity: 0.08, dashArray: '6 4', weight: 1.5 }}
                            >
                                <Popup>
                                    <strong>Quarantine: {z.name}</strong><br />
                                    Radius: {z.radiusKm} km · Status: {z.status}
                                </Popup>
                            </Circle>
                        ))}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};

export default OutbreakMap;

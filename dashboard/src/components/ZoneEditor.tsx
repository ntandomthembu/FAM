import React, { useState, useEffect } from 'react';
import { fetchQuarantineZones, updateQuarantineZone, liftQuarantineZone } from '../services/api';

interface Zone {
    _id: string;
    name: string;
    status: string;
    radiusKm: number;
}

const ZoneEditor: React.FC = () => {
    const [zones, setZones] = useState<Zone[]>([]);
    const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
    const [zoneName, setZoneName] = useState('');
    const [radiusKm, setRadiusKm] = useState(0);
    const [saving, setSaving] = useState(false);

    const loadZones = async () => {
        try {
            const data = await fetchQuarantineZones();
            const items = Array.isArray(data) ? data : data.data || [];
            setZones(items);
        } catch {
            // silent
        }
    };

    useEffect(() => { loadZones(); }, []);

    const handleZoneSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const zone = zones.find((z) => z._id === e.target.value);
        if (zone) {
            setSelectedZone(zone);
            setZoneName(zone.name);
            setRadiusKm(zone.radiusKm);
        }
    };

    const handleUpdate = async () => {
        if (!selectedZone) return;
        setSaving(true);
        try {
            await updateQuarantineZone(selectedZone._id, { name: zoneName, radiusKm });
            setSelectedZone(null);
            setZoneName('');
            await loadZones();
        } catch {
            alert('Failed to update zone');
        } finally {
            setSaving(false);
        }
    };

    const handleLift = async () => {
        if (!selectedZone) return;
        setSaving(true);
        try {
            await liftQuarantineZone(selectedZone._id);
            setSelectedZone(null);
            await loadZones();
        } catch {
            alert('Failed to lift quarantine');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <h3>Zone Editor</h3>
            <select onChange={handleZoneSelect} value={selectedZone?._id || ''} style={{ padding: 8, minWidth: 220 }}>
                <option value="">Select a quarantine zone</option>
                {zones.map((zone) => (
                    <option key={zone._id} value={zone._id}>
                        {zone.name} ({zone.status})
                    </option>
                ))}
            </select>
            {selectedZone && (
                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 300 }}>
                    <label>Name</label>
                    <input type="text" value={zoneName} onChange={(e) => setZoneName(e.target.value)} style={{ padding: 6 }} />
                    <label>Radius (km)</label>
                    <input type="number" value={radiusKm} onChange={(e) => setRadiusKm(Number(e.target.value))} style={{ padding: 6 }} />
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                        <button onClick={handleUpdate} disabled={saving} style={{ padding: '6px 16px' }}>
                            Update Zone
                        </button>
                        {selectedZone.status === 'active' && (
                            <button onClick={handleLift} disabled={saving} style={{ padding: '6px 16px', background: '#4caf50', color: '#fff', border: 'none', borderRadius: 4 }}>
                                Lift Quarantine
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ZoneEditor;
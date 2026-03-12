import React, { useEffect, useState, useCallback } from 'react';
import { fetchQuarantineZones, createQuarantineZone, liftQuarantineZone, fetchIncidents } from '../services/api';

type ToastItem = { id: number; message: string; type: 'success' | 'error' };

const QuarantineZones: React.FC = () => {
    const [zones, setZones] = useState<any[]>([]);
    const [incidents, setIncidents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [locating, setLocating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({ name: '', lat: '', lng: '', radiusKm: '10', linkedIncidentId: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    let tc = 0;
    const pushToast = useCallback((message: string, type: 'success' | 'error') => {
        setToasts((p) => [...p, { id: Date.now() + (tc++), message, type }]);
    }, []);
    const dismissToast = useCallback((id: number) => setToasts((p) => p.filter((t) => t.id !== id)), []);

    const load = async () => {
        try {
            const data = await fetchQuarantineZones();
            setZones(Array.isArray(data) ? data : data.data || []);
            setError(null);
        } catch { setError('Failed to load quarantine zones'); } finally { setLoading(false); }
    };

    const loadIncidents = async () => {
        try {
            const data = await fetchIncidents();
            setIncidents(Array.isArray(data) ? data : data.data || []);
        } catch { setIncidents([]); }
    };

    useEffect(() => { load(); loadIncidents(); }, []);

    /* Auto-fill coords from a linked incident */
    const handleLinkIncident = (incidentId: string) => {
        const inc = incidents.find((i) => i._id === incidentId);
        if (inc?.gpsLocation?.coordinates) {
            const [lng, lat] = inc.gpsLocation.coordinates;
            setForm((f) => ({ ...f, linkedIncidentId: incidentId, lat: String(lat), lng: String(lng) }));
        } else {
            setForm((f) => ({ ...f, linkedIncidentId: incidentId }));
        }
    };

    /* Use device GPS */
    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) { pushToast('Geolocation not supported by this browser', 'error'); return; }
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                setForm((f) => ({ ...f, lat: coords.latitude.toFixed(6), lng: coords.longitude.toFixed(6) }));
                pushToast('Location captured', 'success');
                setLocating(false);
            },
            () => { pushToast('Unable to capture location', 'error'); setLocating(false); },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await createQuarantineZone({
                name: form.name,
                centerPoint: { type: 'Point', coordinates: [parseFloat(form.lng), parseFloat(form.lat)] },
                radiusKm: parseFloat(form.radiusKm),
                linkedIncidentId: form.linkedIncidentId || undefined,
            });
            pushToast('Quarantine zone created', 'success');
            setModalOpen(false);
            setForm({ name: '', lat: '', lng: '', radiusKm: '10', linkedIncidentId: '' });
            await load();
        } catch { pushToast('Failed to create zone', 'error'); }
        finally { setSubmitting(false); }
    };

    const handleLift = async (id: string) => {
        try { await liftQuarantineZone(id); pushToast('Quarantine lifted', 'success'); await load(); }
        catch { pushToast('Failed to lift quarantine', 'error'); }
    };

    const filtered = zones.filter((z) => {
        if (statusFilter !== 'all' && z.status !== statusFilter) return false;
        if (searchTerm && !(z.name || '').toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
    });

    if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 10, color: '#888' }}><div className="loading-spinner" /><span>Loading zones…</span></div>;
    if (error) return <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 10 }}><p style={{ color: '#c62828' }}>{error}</p><button className="btn btn-primary" onClick={() => { setError(null); setLoading(true); load(); }}>Retry</button></div>;

    return (
        <>
            {toasts.length > 0 && <div className="toast-container">{toasts.map((t) => <ToastMsg key={t.id} toast={t} onDismiss={dismissToast} />)}</div>}

            {modalOpen && (
                <div className="modal-backdrop" onClick={() => !submitting && setModalOpen(false)}>
                    <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div><h2 className="modal-title">Create Quarantine Zone</h2><p className="modal-subtitle">Define a restricted area around a disease hotspot.</p></div>
                            <button className="modal-close" onClick={() => setModalOpen(false)}><svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button>
                        </div>
                        <form onSubmit={handleCreate} className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Zone Name <span className="form-required">*</span></label>
                                <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Capricorn Ring 1" />
                            </div>

                            {/* Link to an existing incident — auto-fills GPS */}
                            <div className="form-group">
                                <label className="form-label">Link to Incident <span style={{ fontWeight: 400, color: '#888', fontSize: 12 }}>(auto-fills location)</span></label>
                                <select className="form-input" value={form.linkedIncidentId} onChange={(e) => handleLinkIncident(e.target.value)}>
                                    <option value="">None — set location manually</option>
                                    {incidents.map((i) => {
                                        const farmName = typeof i.farmId === 'object' ? i.farmId?.name : i.farmId || 'Unknown farm';
                                        return (
                                            <option key={i._id} value={i._id}>
                                                {farmName} — {i.species} ({(i.status || '').replace(/_/g, ' ')})
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            {/* Location row */}
                            <div className="form-group">
                                <label className="form-label">Zone Centre Location <span className="form-required">*</span></label>
                                <button type="button" className="btn btn-secondary" onClick={handleUseCurrentLocation} disabled={locating} style={{ marginBottom: 8, width: '100%' }}>
                                    {locating ? 'Detecting location...' : 'Use My Current Location'}
                                </button>
                                <div className="form-row-2">
                                    <div className="form-group" style={{ margin: 0 }}>
                                        <label className="form-label" style={{ fontSize: 12 }}>Latitude</label>
                                        <input className="form-input" type="number" step="any" value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} required placeholder="-25.7" />
                                    </div>
                                    <div className="form-group" style={{ margin: 0 }}>
                                        <label className="form-label" style={{ fontSize: 12 }}>Longitude</label>
                                        <input className="form-input" type="number" step="any" value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} required placeholder="28.2" />
                                    </div>
                                </div>
                                {form.lat && form.lng && <span className="form-hint" style={{ color: '#2e7d32' }}>Location set: {parseFloat(form.lat).toFixed(4)}, {parseFloat(form.lng).toFixed(4)}</span>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Radius (km)</label>
                                <input className="form-input" type="number" value={form.radiusKm} onChange={(e) => setForm({ ...form, radiusKm: e.target.value })} required />
                                <span className="form-hint">Area within which movement will be restricted.</span>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)} disabled={submitting}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Creating…' : 'Create zone'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div>
                <div className="page-header">
                    <div><h1 className="page-title">Quarantine Zones</h1><div className="record-count">{zones.length} zones</div></div>
                    <div className="header-actions"><button className="btn btn-primary" onClick={() => setModalOpen(true)}>Create zone</button></div>
                </div>

                <div className="tabs-bar">
                    <button className={`tab-item${statusFilter === 'all' ? ' active' : ''}`} onClick={() => setStatusFilter('all')}>All zones</button>
                    <button className={`tab-item${statusFilter === 'active' ? ' active' : ''}`} onClick={() => setStatusFilter('active')}>Active</button>
                    <button className={`tab-item${statusFilter === 'lifted' ? ' active' : ''}`} onClick={() => setStatusFilter('lifted')}>Lifted</button>
                </div>

                <div className="search-row">
                    <div className="table-search"><svg width="12" height="12" fill="none" viewBox="0 0 16 16"><circle cx="6.5" cy="6.5" r="5" stroke="#888" strokeWidth="1.5"/><path d="M10.5 10.5l3 3" stroke="#888" strokeWidth="1.5" strokeLinecap="round"/></svg><input placeholder="Search zones…" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
                </div>

                {filtered.length === 0 ? (
                    <div className="empty-state"><div className="empty-state-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/><path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg></div><h3>No quarantine zones</h3><p>Create your first quarantine zone to restrict movement in affected areas.</p><button className="btn btn-primary" onClick={() => setModalOpen(true)}>Create zone</button></div>
                ) : (
                    <table className="data-table">
                        <thead><tr><th><div className="th-inner">NAME <span className="sort-icon">⇅</span></div></th><th><div className="th-inner">RADIUS (KM)</div></th><th><div className="th-inner">STATUS</div></th><th><div className="th-inner">CREATED</div></th><th><div className="th-inner">ACTIONS</div></th></tr></thead>
                        <tbody>
                            {filtered.map((z) => (
                                <tr key={z._id}>
                                    <td><div className="cell-name"><div className="cell-avatar av-red">Q</div>{z.name || z._id?.slice(-6)}</div></td>
                                    <td>{z.radiusKm ?? '—'}</td>
                                    <td><span className={`cell-badge ${z.status === 'active' ? 'badge-red' : 'badge-green'}`}>{z.status || 'active'}</span></td>
                                    <td>{z.createdAt ? new Date(z.createdAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</td>
                                    <td><div className="cell-actions">{z.status !== 'lifted' && <button className="btn btn-sm btn-success-outline" title="Lift quarantine" onClick={() => handleLift(z._id)}>Lift</button>}</div></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
};

const ToastMsg: React.FC<{ toast: ToastItem; onDismiss: (id: number) => void }> = ({ toast, onDismiss }) => {
    useEffect(() => { const t = setTimeout(() => onDismiss(toast.id), 4500); return () => clearTimeout(t); }, [toast.id, onDismiss]);
    return (
        <div className={`toast-item toast-${toast.type}`}>
            <span className="toast-icon-circle">{toast.type === 'success' ? <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> : <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>}</span>
            <span className="toast-text">{toast.message}</span>
            <button className="toast-dismiss" onClick={() => onDismiss(toast.id)}>×</button>
        </div>
    );
};

export default QuarantineZones;

import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchFarms, fetchIncidents, reportIncident, updateIncidentStatus, deleteIncident } from '../services/api';

type SeverityLevel = 'critical' | 'warning' | 'resolved';
type ToastItem = { id: number; message: string; type: 'success' | 'error' };

interface IncidentItem {
    _id: string;
    description?: string;
    additionalNotes?: string;
    status?: string;
    createdAt?: string;
    farmId?: string | { name?: string; province?: string; district?: string };
    assignedVetId?: string | { username?: string; email?: string };
    species?: string;
}

interface FarmOption {
    _id: string;
    name?: string;
    province?: string;
    district?: string;
}

/* ── Toast ── */
const Toast: React.FC<{ toast: ToastItem; onDismiss: (id: number) => void }> = ({ toast, onDismiss }) => {
    useEffect(() => {
        const t = setTimeout(() => onDismiss(toast.id), 4500);
        return () => clearTimeout(t);
    }, [toast.id, onDismiss]);

    return (
        <div className={`toast-item toast-${toast.type}`}>
            <span className="toast-icon-circle">
                {toast.type === 'success' ? (
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                ) : (
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                )}
            </span>
            <span className="toast-text">{toast.message}</span>
            <button className="toast-dismiss" onClick={() => onDismiss(toast.id)}>×</button>
        </div>
    );
};

/* ── Main ── */
const IncidentManagement: React.FC = () => {
    const [incidents, setIncidents] = useState<IncidentItem[]>([]);
    const [farms, setFarms] = useState<FarmOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({ description: '', farmId: '', species: 'cattle', symptoms: '', numberOfAnimalsAffected: 1 });
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [toasts, setToasts] = useState<ToastItem[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const navigate = useNavigate();

    let toastCounter = 0;
    const pushToast = useCallback((message: string, type: 'success' | 'error') => {
        setToasts((prev) => [...prev, { id: Date.now() + (toastCounter++), message, type }]);
    }, []);
    const dismissToast = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const normalizeList = (data: any) => {
        if (Array.isArray(data)) return data;
        if (Array.isArray(data?.incidents)) return data.incidents;
        if (Array.isArray(data?.farms)) return data.farms;
        if (Array.isArray(data?.data)) return data.data;
        return [];
    };

    const load = async () => {
        try {
            const data = await fetchIncidents();
            setIncidents(normalizeList(data));
            setError(null);
        } catch {
            setError('Unable to reach the server.');
        } finally {
            setLoading(false);
        }
    };

    const loadFarms = async () => {
        try {
            const data = await fetchFarms();
            setFarms(normalizeList(data));
        } catch { setFarms([]); }
    };

    useEffect(() => { load(); loadFarms(); }, []);

    const openModal = () => {
        setForm({ description: '', farmId: '', species: 'cattle', symptoms: '', numberOfAnimalsAffected: 1 });
        setModalOpen(true);
    };
    const closeModal = () => { if (!submitting) setModalOpen(false); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await reportIncident({
                farmId: form.farmId,
                species: form.species,
                numberOfAnimalsAffected: Number(form.numberOfAnimalsAffected),
                symptoms: form.symptoms.split(',').map((s) => s.trim()).filter(Boolean),
                description: form.description,
            });
            pushToast('Incident reported successfully', 'success');
            setModalOpen(false);
            await load();
        } catch (err: any) {
            pushToast(err?.response?.data?.message || err?.response?.data?.error || 'Failed to report incident', 'error');
        } finally { setSubmitting(false); }
    };

    const handleStatusChange = async (id: string, status: string) => {
        try {
            await updateIncidentStatus(id, status);
            pushToast(`Status updated to ${status.replace(/_/g, ' ')}`, 'success');
            await load();
        } catch { pushToast('Failed to update status', 'error'); }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteIncident(id);
            pushToast('Incident deleted', 'success');
            await load();
        } catch { pushToast('Failed to delete', 'error'); }
    };

    const getSeverity = (i: IncidentItem): SeverityLevel => {
        const s = (i.status || '').toLowerCase();
        if (s.includes('confirmed') || s.includes('outbreak')) return 'critical';
        if (s.includes('resolved') || s.includes('false')) return 'resolved';
        return 'warning';
    };

    const getRegion = (i: IncidentItem) =>
        typeof i.farmId === 'object' && i.farmId?.province ? i.farmId.province : '—';

    const getFarmName = (i: IncidentItem) =>
        typeof i.farmId === 'object' && i.farmId?.name ? i.farmId.name : '—';

    const getVet = (i: IncidentItem) =>
        typeof i.assignedVetId === 'object'
            ? i.assignedVetId.username || i.assignedVetId.email || '—'
            : '—';

    const filtered = incidents.filter((i) => {
        const statusVal = i.status || 'reported';
        if (statusFilter !== 'all' && statusVal !== statusFilter) return false;
        if (searchTerm) {
            const q = searchTerm.toLowerCase();
            const desc = (i.description || i.additionalNotes || '').toLowerCase();
            const farm = getFarmName(i).toLowerCase();
            if (!desc.includes(q) && !farm.includes(q)) return false;
        }
        return true;
    });

    const toggleSelect = (id: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    const toggleAll = () => {
        if (selectedIds.size === filtered.length) setSelectedIds(new Set());
        else setSelectedIds(new Set(filtered.map((i) => i._id)));
    };

    const total = incidents.length;
    const activeCount = incidents.filter((i) => ['reported', 'under_investigation', 'confirmed_outbreak'].includes((i.status || '').toLowerCase())).length;

    const severityLabel = (s: SeverityLevel) => s === 'critical' ? 'Critical' : s === 'resolved' ? 'Resolved' : 'Warning';
    const severityClass = (s: SeverityLevel) => s === 'critical' ? 'badge-red' : s === 'resolved' ? 'badge-green' : 'badge-amber';

    /* ── Loading / Error ── */
    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 10, color: '#888' }}>
                <div className="loading-spinner" />
                <span>Loading incidents…</span>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 10 }}>
                <p style={{ color: '#c62828' }}>{error}</p>
                <button className="btn btn-primary" onClick={() => { setError(null); setLoading(true); load(); }}>Retry</button>
            </div>
        );
    }

    return (
        <>
            {/* Toasts */}
            {toasts.length > 0 && (
                <div className="toast-container">
                    {toasts.map((t) => <Toast key={t.id} toast={t} onDismiss={dismissToast} />)}
                </div>
            )}

            {/* Modal */}
            {modalOpen && (
                <div className="modal-backdrop" onClick={closeModal}>
                    <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div>
                                <h2 className="modal-title">Report New Incident</h2>
                                <p className="modal-subtitle">Fill in the details to log a disease incident for triage.</p>
                            </div>
                            <button className="modal-close" onClick={closeModal} aria-label="Close">
                                <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Farm <span className="form-required">*</span></label>
                                <select className="form-select" value={form.farmId} onChange={(e) => setForm({ ...form, farmId: e.target.value })} required>
                                    <option value="">Select a farm…</option>
                                    {farms.map((f) => (
                                        <option key={f._id} value={f._id}>{f.name || f._id}{f.province ? ` — ${f.province}` : ''}</option>
                                    ))}
                                </select>
                                {farms.length === 0 && <span className="form-hint error">No farms available. Register a farm first.</span>}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description <span className="form-required">*</span></label>
                                <textarea className="form-textarea" placeholder="Describe the symptoms observed…" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
                            </div>
                            <div className="form-row-2">
                                <div className="form-group">
                                    <label className="form-label">Species</label>
                                    <select className="form-select" value={form.species} onChange={(e) => setForm({ ...form, species: e.target.value })}>
                                        <option value="cattle">Cattle</option>
                                        <option value="sheep">Sheep</option>
                                        <option value="goat">Goat</option>
                                        <option value="pig">Pig</option>
                                        <option value="buffalo">Buffalo</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Animals Affected</label>
                                    <input className="form-input" type="number" min={1} value={form.numberOfAnimalsAffected} onChange={(e) => setForm({ ...form, numberOfAnimalsAffected: Number(e.target.value || 1) })} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Symptoms</label>
                                <input className="form-input" placeholder="e.g. blisters, fever, lameness" value={form.symptoms} onChange={(e) => setForm({ ...form, symptoms: e.target.value })} />
                                <span className="form-hint">Separate multiple symptoms with commas</span>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal} disabled={submitting}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={submitting || farms.length === 0}>
                                    {submitting ? 'Submitting…' : 'Create incident'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Page ── */}
            <div>
                {/* Page Header */}
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Incidents</h1>
                        <div className="record-count">{total} records · {activeCount} active</div>
                    </div>
                    <div className="header-actions">
                        <button className="btn btn-outline-blue" type="button">Import</button>
                        <button className="btn btn-primary" type="button" onClick={openModal}>Create incident</button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="tabs-bar">
                    <button className={`tab-item${statusFilter === 'all' ? ' active' : ''}`} onClick={() => setStatusFilter('all')}>All incidents</button>
                    <button className={`tab-item${statusFilter === 'reported' ? ' active' : ''}`} onClick={() => setStatusFilter('reported')}>Reported</button>
                    <button className={`tab-item${statusFilter === 'under_investigation' ? ' active' : ''}`} onClick={() => setStatusFilter('under_investigation')}>Under Investigation</button>
                    <button className={`tab-item${statusFilter === 'confirmed_outbreak' ? ' active' : ''}`} onClick={() => setStatusFilter('confirmed_outbreak')}>Confirmed Outbreak</button>
                    <button className={`tab-item${statusFilter === 'resolved' ? ' active' : ''}`} onClick={() => setStatusFilter('resolved')}>Resolved</button>
                </div>

                {/* Search row */}
                <div className="search-row">
                    <div className="table-search">
                        <svg width="12" height="12" fill="none" viewBox="0 0 16 16"><circle cx="6.5" cy="6.5" r="5" stroke="#888" strokeWidth="1.5"/><path d="M10.5 10.5l3 3" stroke="#888" strokeWidth="1.5" strokeLinecap="round"/></svg>
                        <input placeholder="Search description, farm…" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <div className="table-actions">
                        <button className="btn btn-secondary btn-sm" type="button">Export</button>
                    </div>
                </div>

                {/* Table */}
                {filtered.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                        <h3>No incidents found</h3>
                        <p>Create your first incident report to start tracking disease outbreaks.</p>
                        <button className="btn btn-primary" onClick={openModal}>Create incident</button>
                    </div>
                ) : (
                    <>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th style={{ width: 28 }}><input type="checkbox" className="chk" checked={selectedIds.size === filtered.length && filtered.length > 0} onChange={toggleAll} /></th>
                                    <th><div className="th-inner">DESCRIPTION <span className="sort-icon">⇅</span></div></th>
                                    <th><div className="th-inner">FARM <span className="sort-icon">⇅</span></div></th>
                                    <th><div className="th-inner">REGION <span className="sort-icon">⇅</span></div></th>
                                    <th><div className="th-inner">SPECIES <span className="sort-icon">⇅</span></div></th>
                                    <th><div className="th-inner">STATUS <span className="sort-icon">⇅</span></div></th>
                                    <th><div className="th-inner">SEVERITY</div></th>
                                    <th><div className="th-inner">VET</div></th>
                                    <th><div className="th-inner">DATE</div></th>
                                    <th><div className="th-inner">ACTIONS</div></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((incident) => {
                                    const sev = getSeverity(incident);
                                    const title = incident.description || incident.additionalNotes || 'Untitled';
                                    const initials = title.split(/\s+/).map((w) => w[0]?.toUpperCase()).join('').slice(0, 2);

                                    return (
                                        <tr key={incident._id}>
                                            <td><input type="checkbox" className="chk" checked={selectedIds.has(incident._id)} onChange={() => toggleSelect(incident._id)} /></td>
                                            <td>
                                                <div className="cell-name">
                                                    <div className={`cell-avatar ${sev === 'critical' ? 'av-red' : sev === 'resolved' ? 'av-green' : 'av-amber'}`}>{initials}</div>
                                                    {title.length > 40 ? title.slice(0, 40) + '…' : title}
                                                </div>
                                            </td>
                                            <td><span className="cell-link">{getFarmName(incident)}</span></td>
                                            <td>{getRegion(incident)}</td>
                                            <td>{incident.species || '—'}</td>
                                            <td>
                                                <span className={`cell-badge ${sev === 'critical' ? 'badge-red' : sev === 'resolved' ? 'badge-green' : 'badge-amber'}`}>
                                                    {(incident.status || 'reported').replace(/_/g, ' ')}
                                                </span>
                                            </td>
                                            <td><span className={`severity-badge ${sev}`}>{severityLabel(sev)}</span></td>
                                            <td>{getVet(incident)}</td>
                                            <td>{incident.createdAt ? new Date(incident.createdAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</td>
                                            <td>
                                                <div className="cell-actions">
                                                    <button className="btn btn-sm btn-outline" title="Investigate" onClick={() => handleStatusChange(incident._id, 'under_investigation')}>
                                                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.4"/><path d="M10.5 10.5l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                                                    </button>
                                                    <button className="btn btn-sm btn-success-outline" title="Resolve" onClick={() => handleStatusChange(incident._id, 'resolved')}>
                                                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                                    </button>
                                                    <button className="btn btn-sm btn-danger-outline" title="Delete" onClick={() => handleDelete(incident._id)}>
                                                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                                                    </button>
                                                    <button className="btn btn-sm btn-outline-blue" title="View on Outbreak Map" onClick={() => navigate('/outbreak-map')} style={{ fontSize: 11, padding: '3px 7px' }}>Map</button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        <div className="pagination">
                            <span className="page-btn">‹ Prev</span>
                            <span className="page-btn active">1</span>
                            <span className="page-btn">Next ›</span>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default IncidentManagement;

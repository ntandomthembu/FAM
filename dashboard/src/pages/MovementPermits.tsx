import React, { useEffect, useState, useCallback } from 'react';
import { fetchPermits, requestPermit, approvePermit, denyPermit, fetchFarms, fetchLivestockByFarm } from '../services/api';

type ToastItem = { id: number; message: string; type: 'success' | 'error' };

const MovementPermits: React.FC = () => {
    const [permits, setPermits] = useState<any[]>([]);
    const [farms, setFarms] = useState<any[]>([]);
    const [farmLivestock, setFarmLivestock] = useState<any[]>([]);
    const [loadingLivestock, setLoadingLivestock] = useState(false);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [denyModal, setDenyModal] = useState<{ id: string } | null>(null);
    const [denyReason, setDenyReason] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({ originFarmId: '', destinationFarmId: '', selectedLivestockIds: [] as string[], reason: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    let tc = 0;
    const pushToast = useCallback((m: string, t: 'success' | 'error') => setToasts((p) => [...p, { id: Date.now() + (tc++), message: m, type: t }]), []);
    const dismissToast = useCallback((id: number) => setToasts((p) => p.filter((x) => x.id !== id)), []);

    const load = async () => {
        try { const d = await fetchPermits(); setPermits(Array.isArray(d) ? d : d.data || []); } catch {} finally { setLoading(false); }
    };

    const loadFarms = async () => {
        try {
            const d = await fetchFarms();
            setFarms(Array.isArray(d) ? d : d.farms || d.data || []);
        } catch { setFarms([]); }
    };

    useEffect(() => { load(); loadFarms(); }, []);

    /* When origin farm is chosen, load its registered animals */
    const handleOriginFarmChange = async (farmId: string) => {
        setForm((f) => ({ ...f, originFarmId: farmId, selectedLivestockIds: [] }));
        if (!farmId) { setFarmLivestock([]); return; }
        setLoadingLivestock(true);
        try {
            const d = await fetchLivestockByFarm(farmId);
            setFarmLivestock(Array.isArray(d) ? d : d.data || []);
        } catch { setFarmLivestock([]); }
        finally { setLoadingLivestock(false); }
    };

    const toggleAnimal = (id: string) => {
        setForm((f) => ({
            ...f,
            selectedLivestockIds: f.selectedLivestockIds.includes(id)
                ? f.selectedLivestockIds.filter((x) => x !== id)
                : [...f.selectedLivestockIds, id],
        }));
    };

    const openModal = () => {
        setForm({ originFarmId: '', destinationFarmId: '', selectedLivestockIds: [], reason: '' });
        setFarmLivestock([]);
        setModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.selectedLivestockIds.length === 0) {
            pushToast('Select at least one animal to move', 'error');
            return;
        }
        setSubmitting(true);
        try {
            await requestPermit({
                originFarmId: form.originFarmId,
                destinationFarmId: form.destinationFarmId,
                livestockIds: form.selectedLivestockIds,
                reason: form.reason,
            });
            pushToast('Permit requested', 'success');
            setModalOpen(false);
            setForm({ originFarmId: '', destinationFarmId: '', selectedLivestockIds: [], reason: '' });
            setFarmLivestock([]);
            await load();
        } catch { pushToast('Failed to request permit', 'error'); }
        finally { setSubmitting(false); }
    };

    const handleApprove = async (id: string) => {
        try { await approvePermit(id); pushToast('Permit approved', 'success'); await load(); }
        catch { pushToast('Failed to approve', 'error'); }
    };

    const handleDeny = async () => {
        if (!denyModal || !denyReason.trim()) return;
        try { await denyPermit(denyModal.id, denyReason); pushToast('Permit denied', 'success'); setDenyModal(null); setDenyReason(''); await load(); }
        catch { pushToast('Failed to deny', 'error'); }
    };

    /* Resolve farm name from an ID stored on a permit */
    const resolveFarmName = (id: string) => {
        if (!id) return '—';
        const f = farms.find((x) => x._id === id);
        return f ? f.name : id.slice(-6);
    };

    const filtered = permits.filter((p) => {
        if (statusFilter !== 'all' && p.status !== statusFilter) return false;
        if (searchTerm && !(p.reason || '').toLowerCase().includes(searchTerm.toLowerCase()) && !(p._id || '').includes(searchTerm)) return false;
        return true;
    });

    if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 10, color: '#888' }}><div className="loading-spinner" /><span>Loading permits...</span></div>;

    return (
        <>
            {toasts.length > 0 && <div className="toast-container">{toasts.map((t) => <Toast key={t.id} toast={t} onDismiss={dismissToast} />)}</div>}

            {/* Request Permit Modal */}
            {modalOpen && (
                <div className="modal-backdrop" onClick={() => !submitting && setModalOpen(false)}>
                    <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div>
                                <h2 className="modal-title">Request Movement Permit</h2>
                                <p className="modal-subtitle">Apply for livestock transport clearance.</p>
                            </div>
                            <button className="modal-close" onClick={() => setModalOpen(false)}>
                                <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Origin Farm <span className="form-required">*</span></label>
                                <select className="form-input" value={form.originFarmId} onChange={(e) => handleOriginFarmChange(e.target.value)} required>
                                    <option value="">Select origin farm...</option>
                                    {farms.map((f) => (
                                        <option key={f._id} value={f._id}>{f.name} — {f.province}</option>
                                    ))}
                                </select>
                                {farms.length === 0 && <span className="form-hint">No farms registered yet — add one in Farm Management first.</span>}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Destination Farm <span className="form-required">*</span></label>
                                <select className="form-input" value={form.destinationFarmId} onChange={(e) => setForm({ ...form, destinationFarmId: e.target.value })} required disabled={!form.originFarmId}>
                                    <option value="">Select destination farm...</option>
                                    {farms.filter((f) => f._id !== form.originFarmId).map((f) => (
                                        <option key={f._id} value={f._id}>{f.name} — {f.province}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">
                                    Animals to Move <span className="form-required">*</span>
                                    {form.selectedLivestockIds.length > 0 && (
                                        <span style={{ fontWeight: 400, color: '#0073ae', marginLeft: 6 }}>{form.selectedLivestockIds.length} selected</span>
                                    )}
                                </label>
                                {!form.originFarmId ? (
                                    <p className="form-hint" style={{ margin: '6px 0' }}>Select an origin farm above to see available animals.</p>
                                ) : loadingLivestock ? (
                                    <p className="form-hint" style={{ margin: '6px 0' }}>Loading animals...</p>
                                ) : farmLivestock.length === 0 ? (
                                    <p className="form-hint" style={{ margin: '6px 0' }}>No registered animals on this farm.</p>
                                ) : (
                                    <div style={{ border: '1px solid #e5e7eb', borderRadius: 6, maxHeight: 170, overflowY: 'auto', padding: '6px 12px', background: '#fafbfc' }}>
                                        {farmLivestock.map((l) => (
                                            <label key={l._id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '5px 0', cursor: 'pointer', fontSize: 13 }}>
                                                <input type="checkbox" checked={form.selectedLivestockIds.includes(l._id)} onChange={() => toggleAnimal(l._id)} style={{ accentColor: '#0073ae' }} />
                                                <span style={{ fontWeight: 600 }}>{l.tagNumber}</span>
                                                <span style={{ color: '#666' }}>{l.species}{l.breed ? ` · ${l.breed}` : ''}</span>
                                                <span className={`cell-badge ${(l.healthStatus || '').toLowerCase().includes('healthy') ? 'badge-green' : 'badge-amber'}`} style={{ marginLeft: 'auto', fontSize: 11 }}>{l.healthStatus || 'Unknown'}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Reason for Movement <span className="form-required">*</span></label>
                                <textarea className="form-textarea" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} required rows={2} placeholder="e.g. Transfer to certified auction facility, seasonal grazing..." />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)} disabled={submitting}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Submitting...' : 'Request permit'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Deny Modal */}
            {denyModal && (
                <div className="modal-backdrop" onClick={() => setDenyModal(null)}>
                    <div className="modal-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 400 }}>
                        <div className="modal-header">
                            <div><h2 className="modal-title">Deny Permit</h2></div>
                            <button className="modal-close" onClick={() => setDenyModal(null)}><svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Reason for denial <span className="form-required">*</span></label>
                                <textarea className="form-textarea" value={denyReason} onChange={(e) => setDenyReason(e.target.value)} rows={3} placeholder="Explain why this permit is being denied..." />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setDenyModal(null)}>Cancel</button>
                                <button type="button" className="btn btn-primary" onClick={handleDeny} disabled={!denyReason.trim()} style={{ background: '#e94e4e', borderColor: '#e94e4e' }}>Deny</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div>
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Movement Permits</h1>
                        <div className="record-count">{permits.length} permits</div>
                    </div>
                    <div className="header-actions">
                        <button className="btn btn-primary" onClick={openModal}>Request permit</button>
                    </div>
                </div>

                <div className="tabs-bar">
                    {(['all', 'pending', 'approved', 'denied'] as const).map((s) => (
                        <button key={s} className={`tab-item${statusFilter === s ? ' active' : ''}`} onClick={() => setStatusFilter(s)}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="search-row">
                    <div className="table-search">
                        <svg width="12" height="12" fill="none" viewBox="0 0 16 16"><circle cx="6.5" cy="6.5" r="5" stroke="#888" strokeWidth="1.5"/><path d="M10.5 10.5l3 3" stroke="#888" strokeWidth="1.5" strokeLinecap="round"/></svg>
                        <input placeholder="Search permits..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                        <h3>No permits found</h3>
                        <p>Request a permit to transport livestock between farms.</p>
                        <button className="btn btn-primary" onClick={openModal}>Request permit</button>
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th><div className="th-inner">PERMIT ID</div></th>
                                <th><div className="th-inner">FROM</div></th>
                                <th><div className="th-inner">TO</div></th>
                                <th><div className="th-inner">STATUS</div></th>
                                <th><div className="th-inner">REASON</div></th>
                                <th><div className="th-inner">VALID UNTIL</div></th>
                                <th><div className="th-inner">REQUESTED</div></th>
                                <th><div className="th-inner">ACTIONS</div></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((p) => {
                                const s = (p.status || 'pending').toLowerCase();
                                const cls = s === 'approved' ? 'badge-green' : s === 'denied' ? 'badge-red' : 'badge-amber';
                                return (
                                    <tr key={p._id}>
                                        <td><span className="cell-link">{p._id?.slice(-8) || '—'}</span></td>
                                        <td>{resolveFarmName(p.originFarmId)}</td>
                                        <td>{resolveFarmName(p.destinationFarmId)}</td>
                                        <td><span className={`cell-badge ${cls}`}>{s}</span></td>
                                        <td>{p.reason || '—'}</td>
                                        <td>{p.validUntil ? new Date(p.validUntil).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</td>
                                        <td>{p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</td>
                                        <td>
                                            <div className="cell-actions">
                                                {s === 'pending' && <button className="btn btn-sm btn-success-outline" onClick={() => handleApprove(p._id)}>Approve</button>}
                                                {s === 'pending' && <button className="btn btn-sm btn-danger-outline" onClick={() => { setDenyModal({ id: p._id }); setDenyReason(''); }}>Deny</button>}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
};

const Toast: React.FC<{ toast: ToastItem; onDismiss: (id: number) => void }> = ({ toast, onDismiss }) => {
    useEffect(() => { const t = setTimeout(() => onDismiss(toast.id), 4500); return () => clearTimeout(t); }, [toast.id, onDismiss]);
    return (
        <div className={`toast-item toast-${toast.type}`}>
            <span className="toast-icon-circle">
                {toast.type === 'success'
                    ? <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    : <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>}
            </span>
            <span className="toast-text">{toast.message}</span>
            <button className="toast-dismiss" onClick={() => onDismiss(toast.id)}>x</button>
        </div>
    );
};

export default MovementPermits;

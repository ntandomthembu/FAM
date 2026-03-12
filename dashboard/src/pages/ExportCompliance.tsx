import React, { useEffect, useState, useCallback } from 'react';
import { fetchCertificates, generateCertificate, approveCertificate, revokeCertificate, fetchFarms, fetchLivestockByFarm } from '../services/api';

type ToastItem = { id: number; message: string; type: 'success' | 'error' };

const EXPORT_COUNTRIES = [
    'Botswana', 'Namibia', 'Zimbabwe', 'Mozambique', 'Swaziland', 'Lesotho',
    'Zambia', 'Malawi', 'Tanzania', 'Kenya', 'Angola', 'Other',
];

const ExportCompliance: React.FC = () => {
    const [certificates, setCertificates] = useState<any[]>([]);
    const [farms, setFarms] = useState<any[]>([]);
    const [farmLivestock, setFarmLivestock] = useState<any[]>([]);
    const [loadingLivestock, setLoadingLivestock] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({ farmId: '', destinationCountry: '', selectedLivestockIds: [] as string[] });
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    let tc = 0;
    const pushToast = useCallback((m: string, t: 'success' | 'error') => setToasts((p) => [...p, { id: Date.now() + (tc++), message: m, type: t }]), []);
    const dismissToast = useCallback((id: number) => setToasts((p) => p.filter((x) => x.id !== id)), []);

    const load = async () => {
        try { const d = await fetchCertificates(); setCertificates(Array.isArray(d) ? d : d.data || []); setError(null); }
        catch { setError('Failed to load certificates'); }
        finally { setLoading(false); }
    };

    const loadFarms = async () => {
        try {
            const d = await fetchFarms();
            setFarms(Array.isArray(d) ? d : d.farms || d.data || []);
        } catch { setFarms([]); }
    };

    useEffect(() => { load(); loadFarms(); }, []);

    const handleFarmChange = async (farmId: string) => {
        setForm((f) => ({ ...f, farmId, selectedLivestockIds: [] }));
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
        setForm({ farmId: '', destinationCountry: '', selectedLivestockIds: [] });
        setFarmLivestock([]);
        setModalOpen(true);
    };

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.selectedLivestockIds.length === 0) {
            pushToast('Select at least one animal for the certificate', 'error');
            return;
        }
        setSubmitting(true);
        try {
            await generateCertificate({
                farmId: form.farmId,
                destinationCountry: form.destinationCountry,
                livestockIds: form.selectedLivestockIds,
            });
            pushToast('Certificate generated', 'success');
            setModalOpen(false);
            setForm({ farmId: '', destinationCountry: '', selectedLivestockIds: [] });
            setFarmLivestock([]);
            await load();
        } catch { pushToast('Failed to generate certificate', 'error'); }
        finally { setSubmitting(false); }
    };

    const handleApprove = async (id: string) => {
        try { await approveCertificate(id); pushToast('Certificate approved', 'success'); await load(); }
        catch { pushToast('Failed to approve', 'error'); }
    };

    const handleRevoke = async (id: string) => {
        try { await revokeCertificate(id); pushToast('Certificate revoked', 'success'); await load(); }
        catch { pushToast('Failed to revoke', 'error'); }
    };

    const resolveFarmName = (id: string) => {
        if (!id) return '—';
        const f = farms.find((x) => x._id === id);
        return f ? f.name : id.slice(-6);
    };

    const filtered = certificates.filter((c) => {
        if (statusFilter !== 'all' && c.status !== statusFilter) return false;
        if (searchTerm && !(c.destinationCountry || '').toLowerCase().includes(searchTerm.toLowerCase()) && !(c._id || '').includes(searchTerm)) return false;
        return true;
    });

    if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 10, color: '#888' }}><div className="loading-spinner" /><span>Loading certificates...</span></div>;
    if (error) return <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 10 }}><p style={{ color: '#c62828' }}>{error}</p><button className="btn btn-primary" onClick={() => { setError(null); setLoading(true); load(); }}>Retry</button></div>;

    return (
        <>
            {toasts.length > 0 && <div className="toast-container">{toasts.map((t) => <Toast key={t.id} toast={t} onDismiss={dismissToast} />)}</div>}

            {/* Generate Certificate Modal */}
            {modalOpen && (
                <div className="modal-backdrop" onClick={() => !submitting && setModalOpen(false)}>
                    <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div>
                                <h2 className="modal-title">Generate Export Certificate</h2>
                                <p className="modal-subtitle">Create a veterinary export clearance document.</p>
                            </div>
                            <button className="modal-close" onClick={() => setModalOpen(false)}>
                                <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                            </button>
                        </div>
                        <form onSubmit={handleGenerate} className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Exporting Farm <span className="form-required">*</span></label>
                                <select className="form-input" value={form.farmId} onChange={(e) => handleFarmChange(e.target.value)} required>
                                    <option value="">Select farm...</option>
                                    {farms.map((f) => (
                                        <option key={f._id} value={f._id}>{f.name} — {f.province}</option>
                                    ))}
                                </select>
                                {farms.length === 0 && <span className="form-hint">No farms registered yet — add one in Farm Management first.</span>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Destination Country <span className="form-required">*</span></label>
                                <select className="form-input" value={form.destinationCountry} onChange={(e) => setForm({ ...form, destinationCountry: e.target.value })} required>
                                    <option value="">Select country...</option>
                                    {EXPORT_COUNTRIES.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Animals for Export <span className="form-required">*</span>
                                    {form.selectedLivestockIds.length > 0 && (
                                        <span style={{ fontWeight: 400, color: '#0073ae', marginLeft: 6 }}>{form.selectedLivestockIds.length} selected</span>
                                    )}
                                </label>
                                {!form.farmId ? (
                                    <p className="form-hint" style={{ margin: '6px 0' }}>Select a farm above to see available animals.</p>
                                ) : loadingLivestock ? (
                                    <p className="form-hint" style={{ margin: '6px 0' }}>Loading animals...</p>
                                ) : farmLivestock.length === 0 ? (
                                    <p className="form-hint" style={{ margin: '6px 0' }}>No registered animals on this farm.</p>
                                ) : (
                                    <div style={{ border: '1px solid #e5e7eb', borderRadius: 6, maxHeight: 170, overflowY: 'auto', padding: '6px 12px', background: '#fafbfc' }}>
                                        {farmLivestock.map((l) => {
                                            const healthy = (l.healthStatus || '').toLowerCase().includes('healthy');
                                            const vaccinated = (l.vaccinationStatus || '').toLowerCase().includes('up');
                                            return (
                                                <label key={l._id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '5px 0', cursor: 'pointer', fontSize: 13 }}>
                                                    <input type="checkbox" checked={form.selectedLivestockIds.includes(l._id)} onChange={() => toggleAnimal(l._id)} style={{ accentColor: '#0073ae' }} />
                                                    <span style={{ fontWeight: 600 }}>{l.tagNumber}</span>
                                                    <span style={{ color: '#666' }}>{l.species}{l.breed ? ` · ${l.breed}` : ''}</span>
                                                    <span className={`cell-badge ${healthy ? 'badge-green' : 'badge-red'}`} style={{ marginLeft: 'auto', fontSize: 11, flexShrink: 0 }}>{healthy ? 'Healthy' : 'At risk'}</span>
                                                    <span className={`cell-badge ${vaccinated ? 'badge-green' : 'badge-amber'}`} style={{ fontSize: 11, flexShrink: 0 }}>{vaccinated ? 'Vaccinated' : 'Unvaccinated'}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                )}
                                {!loadingLivestock && farmLivestock.some((l) => !(l.vaccinationStatus || '').toLowerCase().includes('up')) && (
                                    <span className="form-hint" style={{ color: '#f57c00' }}>Some animals may not meet export vaccination requirements.</span>
                                )}
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)} disabled={submitting}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Generating...' : 'Generate'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div>
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Export Compliance</h1>
                        <div className="record-count">{certificates.length} certificates</div>
                    </div>
                    <div className="header-actions">
                        <button className="btn btn-primary" onClick={openModal}>Generate certificate</button>
                    </div>
                </div>

                <div className="tabs-bar">
                    {(['all', 'pending', 'approved', 'revoked'] as const).map((s) => (
                        <button key={s} className={`tab-item${statusFilter === s ? ' active' : ''}`} onClick={() => setStatusFilter(s)}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="search-row">
                    <div className="table-search">
                        <svg width="12" height="12" fill="none" viewBox="0 0 16 16"><circle cx="6.5" cy="6.5" r="5" stroke="#888" strokeWidth="1.5"/><path d="M10.5 10.5l3 3" stroke="#888" strokeWidth="1.5" strokeLinecap="round"/></svg>
                        <input placeholder="Search by country..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="empty-state">
                        <h3>No certificates found</h3>
                        <p>Generate an export certificate to begin.</p>
                        <button className="btn btn-primary" onClick={openModal}>Generate certificate</button>
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th><div className="th-inner">CERT ID</div></th>
                                <th><div className="th-inner">FARM</div></th>
                                <th><div className="th-inner">DESTINATION</div></th>
                                <th><div className="th-inner">STATUS</div></th>
                                <th><div className="th-inner">ISSUED</div></th>
                                <th><div className="th-inner">EXPIRES</div></th>
                                <th><div className="th-inner">ACTIONS</div></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((c) => {
                                const s = (c.status || 'pending').toLowerCase();
                                const cls = s === 'approved' ? 'badge-green' : s === 'revoked' ? 'badge-red' : 'badge-amber';
                                return (
                                    <tr key={c._id}>
                                        <td><span className="cell-link">{c._id?.slice(-8) || '—'}</span></td>
                                        <td>{resolveFarmName(c.farmId)}</td>
                                        <td>{c.destinationCountry || '—'}</td>
                                        <td><span className={`cell-badge ${cls}`}>{s}</span></td>
                                        <td>{c.issuedDate ? new Date(c.issuedDate).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</td>
                                        <td>{c.expiryDate ? new Date(c.expiryDate).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</td>
                                        <td>
                                            <div className="cell-actions">
                                                {s === 'pending' && <button className="btn btn-sm btn-success-outline" onClick={() => handleApprove(c._id)}>Approve</button>}
                                                {s !== 'revoked' && <button className="btn btn-sm btn-danger-outline" onClick={() => handleRevoke(c._id)}>Revoke</button>}
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

export default ExportCompliance;

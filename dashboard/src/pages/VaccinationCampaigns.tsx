import React, { useEffect, useState, useCallback } from 'react';
import { fetchVaccinationCampaigns, createCampaign, fetchVaccineStock } from '../services/api';
import VaccinationProgress from '../components/VaccinationProgress';

const SA_PROVINCES = [
    'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal',
    'Limpopo', 'Mpumalanga', 'Northern Cape', 'North West', 'Western Cape', 'National',
];

const FMD_VACCINE_TYPES = [
    'FMD Polyvalent (O, A, SAT1, SAT2, SAT3)',
    'FMD Bivalent (O, A)',
    'FMD Trivalent (O, A, SAT2)',
    'FMD SAT1',
    'FMD SAT2',
    'FMD SAT3',
    'FMD Type O',
    'FMD Type A',
];

type ToastItem = { id: number; message: string; type: 'success' | 'error' };

const VaccinationCampaigns: React.FC = () => {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [stock, setStock] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({ name: '', vaccineType: '', targetCount: '', targetArea: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [tabView, setTabView] = useState<'campaigns' | 'stock'>('campaigns');
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    let tc = 0;
    const pushToast = useCallback((m: string, t: 'success' | 'error') => setToasts((p) => [...p, { id: Date.now() + (tc++), message: m, type: t }]), []);
    const dismissToast = useCallback((id: number) => setToasts((p) => p.filter((x) => x.id !== id)), []);

    const load = async () => {
        try {
            const [cData, sData] = await Promise.all([fetchVaccinationCampaigns(), fetchVaccineStock()]);
            setCampaigns(Array.isArray(cData) ? cData : cData.data || []);
            setStock(Array.isArray(sData) ? sData : sData.data || []);
        } catch { setError('Failed to load vaccination data'); }
        finally { setLoading(false); }
    };

    useEffect(() => { load(); }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await createCampaign({ name: form.name, vaccineType: form.vaccineType, targetCount: parseInt(form.targetCount, 10), targetArea: form.targetArea });
            pushToast('Campaign created', 'success');
            setModalOpen(false);
            setForm({ name: '', vaccineType: '', targetCount: '', targetArea: '' });
            await load();
        } catch { pushToast('Failed to create campaign', 'error'); }
        finally { setSubmitting(false); }
    };

    const filteredCampaigns = campaigns.filter((c) => !searchTerm || (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredStock = stock.filter((s) => !searchTerm || (s.vaccineType || '').toLowerCase().includes(searchTerm.toLowerCase()));

    if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 10, color: '#888' }}><div className="loading-spinner" /><span>Loading campaigns…</span></div>;
    if (error) return <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 10 }}><p style={{ color: '#c62828' }}>{error}</p><button className="btn btn-primary" onClick={() => { setError(null); setLoading(true); load(); }}>Retry</button></div>;

    return (
        <>
            {toasts.length > 0 && <div className="toast-container">{toasts.map((t) => <Toast key={t.id} toast={t} onDismiss={dismissToast} />)}</div>}

            {modalOpen && (
                <div className="modal-backdrop" onClick={() => !submitting && setModalOpen(false)}>
                    <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header"><div><h2 className="modal-title">New Vaccination Campaign</h2><p className="modal-subtitle">Set up a regional vaccination drive.</p></div><button className="modal-close" onClick={() => setModalOpen(false)}><svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button></div>
                        <form onSubmit={handleCreate} className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Campaign Name <span className="form-required">*</span></label>
                                <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Northern Cattle Shield 2026" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Vaccine Type <span className="form-required">*</span></label>
                                <select className="form-input" value={form.vaccineType} onChange={(e) => setForm({ ...form, vaccineType: e.target.value })} required>
                                    <option value="">Select vaccine type...</option>
                                    {FMD_VACCINE_TYPES.map((v) => (
                                        <option key={v} value={v}>{v}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-row-2">
                                <div className="form-group">
                                    <label className="form-label">Target Animal Count <span className="form-required">*</span></label>
                                    <input className="form-input" type="number" min="1" value={form.targetCount} onChange={(e) => setForm({ ...form, targetCount: e.target.value })} required placeholder="e.g. 1200" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Target Province</label>
                                    <select className="form-input" value={form.targetArea} onChange={(e) => setForm({ ...form, targetArea: e.target.value })}>
                                        <option value="">All provinces</option>
                                        {SA_PROVINCES.map((p) => (
                                            <option key={p} value={p}>{p}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)} disabled={submitting}>Cancel</button><button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Creating…' : 'Create campaign'}</button></div>
                        </form>
                    </div>
                </div>
            )}

            <div>
                <div className="page-header">
                    <div><h1 className="page-title">Vaccination Campaigns</h1><div className="record-count">{campaigns.length} campaigns · {stock.length} stock items</div></div>
                    <div className="header-actions"><button className="btn btn-primary" onClick={() => setModalOpen(true)}>New campaign</button></div>
                </div>

                <div className="panel" style={{ marginBottom: 16 }}><VaccinationProgress /></div>

                <div className="tabs-bar">
                    <button className={`tab-item${tabView === 'campaigns' ? ' active' : ''}`} onClick={() => setTabView('campaigns')}>Campaigns</button>
                    <button className={`tab-item${tabView === 'stock' ? ' active' : ''}`} onClick={() => setTabView('stock')}>Vaccine Stock</button>
                </div>

                <div className="search-row">
                    <div className="table-search"><svg width="12" height="12" fill="none" viewBox="0 0 16 16"><circle cx="6.5" cy="6.5" r="5" stroke="#888" strokeWidth="1.5"/><path d="M10.5 10.5l3 3" stroke="#888" strokeWidth="1.5" strokeLinecap="round"/></svg><input placeholder="Search…" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
                </div>

                {tabView === 'campaigns' ? (
                    filteredCampaigns.length === 0 ? (
                        <div className="empty-state"><h3>No campaigns</h3><p>Create a new vaccination campaign to get started.</p><button className="btn btn-primary" onClick={() => setModalOpen(true)}>New campaign</button></div>
                    ) : (
                        <table className="data-table">
                            <thead><tr><th><div className="th-inner">CAMPAIGN <span className="sort-icon">⇅</span></div></th><th><div className="th-inner">VACCINE</div></th><th><div className="th-inner">TARGET</div></th><th><div className="th-inner">VACCINATED</div></th><th><div className="th-inner">STATUS</div></th></tr></thead>
                            <tbody>
                                {filteredCampaigns.map((c) => {
                                    const s = (c.status || 'planned').toLowerCase();
                                    const cls = s.includes('complet') ? 'badge-green' : s.includes('active') || s.includes('progress') ? 'badge-blue' : 'badge-amber';
                                    return (
                                        <tr key={c._id}>
                                            <td><div className="cell-name"><div className="cell-avatar av-green">V</div>{c.name || '—'}</div></td>
                                            <td>{c.vaccineType || '—'}</td>
                                            <td>{c.targetCount ?? '—'}</td>
                                            <td>{c.vaccinatedCount ?? 0}</td>
                                            <td><span className={`cell-badge ${cls}`}>{s}</span></td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )
                ) : (
                    filteredStock.length === 0 ? (
                        <div className="empty-state"><h3>No vaccine stock</h3><p>Stock data will appear here.</p></div>
                    ) : (
                        <table className="data-table">
                            <thead><tr><th><div className="th-inner">TYPE</div></th><th><div className="th-inner">MANUFACTURER</div></th><th><div className="th-inner">BATCH</div></th><th><div className="th-inner">QTY</div></th><th><div className="th-inner">EXPIRES</div></th></tr></thead>
                            <tbody>
                                {filteredStock.map((s, i) => (
                                    <tr key={s._id || i}>
                                        <td>{s.vaccineType || '—'}</td>
                                        <td>{s.manufacturer || '—'}</td>
                                        <td>{s.batchNumber || '—'}</td>
                                        <td>{s.quantity ?? '—'}</td>
                                        <td>{s.expiryDate ? new Date(s.expiryDate).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )
                )}
            </div>
        </>
    );
};

const Toast: React.FC<{ toast: ToastItem; onDismiss: (id: number) => void }> = ({ toast, onDismiss }) => {
    useEffect(() => { const t = setTimeout(() => onDismiss(toast.id), 4500); return () => clearTimeout(t); }, [toast.id, onDismiss]);
    return (
        <div className={`toast-item toast-${toast.type}`}>
            <span className="toast-icon-circle">{toast.type === 'success' ? <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> : <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>}</span>
            <span className="toast-text">{toast.message}</span><button className="toast-dismiss" onClick={() => onDismiss(toast.id)}>×</button>
        </div>
    );
};

export default VaccinationCampaigns;

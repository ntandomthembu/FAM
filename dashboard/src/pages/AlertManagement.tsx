import React, { useState, useCallback, useEffect } from 'react';
import { sendProximityAlert, sendOutbreakAlert, sendVaccinationReminder } from '../services/api';

type ToastItem = { id: number; message: string; type: 'success' | 'error' };

const AlertManagement: React.FC = () => {
    const [alertType, setAlertType] = useState<'proximity' | 'outbreak' | 'vaccination'>('proximity');
    const [form, setForm] = useState<any>({});
    const [sending, setSending] = useState(false);
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    let tc = 0;
    const pushToast = useCallback((m: string, t: 'success' | 'error') => setToasts((p) => [...p, { id: Date.now() + (tc++), message: m, type: t }]), []);
    const dismissToast = useCallback((id: number) => setToasts((p) => p.filter((x) => x.id !== id)), []);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        try {
            if (alertType === 'proximity') {
                await sendProximityAlert({ lat: parseFloat(form.lat), lng: parseFloat(form.lng), radiusKm: parseFloat(form.radiusKm || '10'), message: form.message });
            } else if (alertType === 'outbreak') {
                await sendOutbreakAlert(form.incidentId);
            } else {
                await sendVaccinationReminder({ campaignId: form.campaignId, message: form.message });
            }
            pushToast('Alert sent successfully', 'success');
            setForm({});
        } catch { pushToast('Failed to send alert', 'error'); }
        finally { setSending(false); }
    };

    return (
        <>
            {toasts.length > 0 && <div className="toast-container">{toasts.map((t) => <Toast key={t.id} toast={t} onDismiss={dismissToast} />)}</div>}

            <div>
                <div className="page-header">
                    <div><h1 className="page-title">Alert Management</h1><div className="record-count">Send notifications to farmers and field teams</div></div>
                </div>

                <div className="tabs-bar">
                    <button className={`tab-item${alertType === 'proximity' ? ' active' : ''}`} onClick={() => { setAlertType('proximity'); setForm({}); }}>Proximity Alert</button>
                    <button className={`tab-item${alertType === 'outbreak' ? ' active' : ''}`} onClick={() => { setAlertType('outbreak'); setForm({}); }}>Outbreak Alert</button>
                    <button className={`tab-item${alertType === 'vaccination' ? ' active' : ''}`} onClick={() => { setAlertType('vaccination'); setForm({}); }}>Vaccination Reminder</button>
                </div>

                <div className="panel" style={{ maxWidth: 520 }}>
                    <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {alertType === 'proximity' && (
                            <>
                                <div className="form-row-2">
                                    <div className="form-group"><label className="form-label">Latitude <span className="form-required">*</span></label><input className="form-input" type="number" step="any" value={form.lat || ''} onChange={(e) => setForm({ ...form, lat: e.target.value })} required /></div>
                                    <div className="form-group"><label className="form-label">Longitude <span className="form-required">*</span></label><input className="form-input" type="number" step="any" value={form.lng || ''} onChange={(e) => setForm({ ...form, lng: e.target.value })} required /></div>
                                </div>
                                <div className="form-group"><label className="form-label">Radius (km)</label><input className="form-input" type="number" value={form.radiusKm || ''} onChange={(e) => setForm({ ...form, radiusKm: e.target.value })} /></div>
                                <div className="form-group"><label className="form-label">Alert Message <span className="form-required">*</span></label><textarea className="form-textarea" rows={3} value={form.message || ''} onChange={(e) => setForm({ ...form, message: e.target.value })} required /></div>
                            </>
                        )}
                        {alertType === 'outbreak' && (
                            <div className="form-group"><label className="form-label">Incident ID <span className="form-required">*</span></label><input className="form-input" value={form.incidentId || ''} onChange={(e) => setForm({ ...form, incidentId: e.target.value })} required /><span className="form-hint">Enter the incident ID associated with the outbreak</span></div>
                        )}
                        {alertType === 'vaccination' && (
                            <>
                                <div className="form-group"><label className="form-label">Campaign ID <span className="form-required">*</span></label><input className="form-input" value={form.campaignId || ''} onChange={(e) => setForm({ ...form, campaignId: e.target.value })} required /></div>
                                <div className="form-group"><label className="form-label">Reminder Message <span className="form-required">*</span></label><textarea className="form-textarea" rows={3} value={form.message || ''} onChange={(e) => setForm({ ...form, message: e.target.value })} required /></div>
                            </>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 8 }}>
                            <button type="submit" className="btn btn-primary" disabled={sending} style={{ background: '#e94e4e', borderColor: '#e94e4e' }}>{sending ? 'Sending…' : 'Send Alert'}</button>
                        </div>
                    </form>
                </div>
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

export default AlertManagement;

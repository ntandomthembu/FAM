import React, { useEffect, useState } from 'react';
import { fetchAssignedIncidents, fetchInvestigationDetails } from '../services/api';

const VeterinaryInvestigations: React.FC = () => {
    const [incidents, setIncidents] = useState<any[]>([]);
    const [selectedDetail, setSelectedDetail] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchAssignedIncidents();
                setIncidents(Array.isArray(data) ? data : data.data || []);
            } catch { setError('Failed to load investigations'); }
            finally { setLoading(false); }
        };
        load();
    }, []);

    const viewDetails = async (id: string) => {
        try { const detail = await fetchInvestigationDetails(id); setSelectedDetail(detail); }
        catch { setSelectedDetail({ error: 'Failed to load investigation details' }); }
    };

    const filtered = incidents.filter((i) => {
        if (!searchTerm) return true;
        const q = searchTerm.toLowerCase();
        return (i.description || '').toLowerCase().includes(q) || (i.species || '').toLowerCase().includes(q);
    });

    if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 10, color: '#888' }}><div className="loading-spinner" /><span>Loading investigations…</span></div>;
    if (error) return <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 10 }}><p style={{ color: '#c62828' }}>{error}</p></div>;

    return (
        <>
            {selectedDetail && (
                <div className="modal-backdrop" onClick={() => setSelectedDetail(null)}>
                    <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header"><div><h2 className="modal-title">Investigation Details</h2></div><button className="modal-close" onClick={() => setSelectedDetail(null)}><svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button></div>
                        <div className="modal-body"><pre style={{ fontSize: 12, background: '#fafbfc', padding: 12, borderRadius: 4, overflow: 'auto', maxHeight: 400, border: '1px solid #eee' }}>{JSON.stringify(selectedDetail, null, 2)}</pre></div>
                    </div>
                </div>
            )}

            <div>
                <div className="page-header">
                    <div><h1 className="page-title">Veterinary Investigations</h1><div className="record-count">{incidents.length} assigned incidents</div></div>
                </div>

                <div className="search-row">
                    <div className="table-search"><svg width="12" height="12" fill="none" viewBox="0 0 16 16"><circle cx="6.5" cy="6.5" r="5" stroke="#888" strokeWidth="1.5"/><path d="M10.5 10.5l3 3" stroke="#888" strokeWidth="1.5" strokeLinecap="round"/></svg><input placeholder="Search investigations…" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
                </div>

                {filtered.length === 0 ? (
                    <div className="empty-state"><h3>No investigations</h3><p>Assigned incidents for investigation will appear here.</p></div>
                ) : (
                    <table className="data-table">
                        <thead><tr><th><div className="th-inner">INCIDENT ID</div></th><th><div className="th-inner">DESCRIPTION <span className="sort-icon">⇅</span></div></th><th><div className="th-inner">SPECIES</div></th><th><div className="th-inner">STATUS</div></th><th><div className="th-inner">REPORTED</div></th><th><div className="th-inner">ACTIONS</div></th></tr></thead>
                        <tbody>
                            {filtered.map((i) => {
                                const s = (i.status || 'reported').toLowerCase();
                                const cls = s.includes('confirmed') || s.includes('outbreak') ? 'badge-red' : s.includes('resolved') ? 'badge-green' : 'badge-amber';
                                return (
                                    <tr key={i._id}>
                                        <td><span className="cell-link">{i._id?.slice(-8) || '—'}</span></td>
                                        <td>{(i.description || '—').slice(0, 50)}{(i.description || '').length > 50 ? '…' : ''}</td>
                                        <td>{i.species || '—'}</td>
                                        <td><span className={`cell-badge ${cls}`}>{s.replace(/_/g, ' ')}</span></td>
                                        <td>{i.createdAt ? new Date(i.createdAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</td>
                                        <td><button className="btn btn-sm btn-outline-blue" onClick={() => viewDetails(i._id)}>View</button></td>
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

export default VeterinaryInvestigations;

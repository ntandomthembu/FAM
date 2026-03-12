import React, { useEffect, useState } from 'react';
import { fetchTraceabilityData, traceLivestock } from '../services/api';

const LivestockTraceability: React.FC = () => {
    const [livestock, setLivestock] = useState<any[]>([]);
    const [traceResult, setTraceResult] = useState<any>(null);
    const [traceId, setTraceId] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchTraceabilityData();
                setLivestock(Array.isArray(data) ? data : data.data || []);
            } catch { setError('Failed to fetch livestock data'); }
            finally { setLoading(false); }
        };
        load();
    }, []);

    const handleTrace = async () => {
        if (!traceId.trim()) return;
        try { const result = await traceLivestock(traceId); setTraceResult(result); }
        catch { setTraceResult({ error: 'Failed to trace livestock' }); }
    };

    const handleTraceFromRow = async (id: string, label: string) => {
        setTraceId(id);
        try { const result = await traceLivestock(id); setTraceResult({ ...result, _label: label }); }
        catch { setTraceResult({ error: 'Failed to trace livestock' }); }
    };

    const filtered = livestock.filter((l) => {
        if (!searchTerm) return true;
        const q = searchTerm.toLowerCase();
        return (l.tagNumber || '').toLowerCase().includes(q) || (l.species || '').toLowerCase().includes(q) || (l.breed || '').toLowerCase().includes(q);
    });

    if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 10, color: '#888' }}><div className="loading-spinner" /><span>Loading livestock…</span></div>;
    if (error) return <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 10 }}><p style={{ color: '#c62828' }}>{error}</p></div>;

    return (
        <>
            {/* Trace Result Modal */}
            {traceResult && (
                <div className="modal-backdrop" onClick={() => setTraceResult(null)}>
                    <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div><h2 className="modal-title">Trace Result</h2><p className="modal-subtitle">Movement history for {traceResult?._label || livestock.find((l) => l._id === traceId)?.tagNumber || traceId}</p></div>
                            <button className="modal-close" onClick={() => setTraceResult(null)}><svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button>
                        </div>
                        <div className="modal-body"><pre style={{ fontSize: 12, background: '#fafbfc', padding: 12, borderRadius: 4, overflow: 'auto', maxHeight: 300, border: '1px solid #eee' }}>{JSON.stringify(traceResult, null, 2)}</pre></div>
                    </div>
                </div>
            )}

            <div>
                <div className="page-header">
                    <div><h1 className="page-title">Livestock Traceability</h1><div className="record-count">{livestock.length} registered animals</div></div>
                </div>

                {/* Trace bar — select by tag number */}
                <div className="panel" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, padding: '12px 16px', flexWrap: 'wrap' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="#0073ae" strokeWidth="1.5"/><path d="M10.5 10.5l4 4" stroke="#0073ae" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    <select
                        className="form-input"
                        style={{ maxWidth: 320, margin: 0 }}
                        value={traceId}
                        onChange={(e) => setTraceId(e.target.value)}
                    >
                        <option value="">Select animal by tag number...</option>
                        {livestock.map((l) => (
                            <option key={l._id} value={l._id}>
                                {l.tagNumber} — {l.species}{l.breed ? ` (${l.breed})` : ''}
                            </option>
                        ))}
                    </select>
                    <button className="btn btn-outline-blue" onClick={handleTrace} disabled={!traceId}>Trace History</button>
                    {traceId && <button className="btn btn-secondary" onClick={() => setTraceId('')} style={{ padding: '4px 10px' }}>Clear</button>}
                </div>

                <div className="search-row">
                    <div className="table-search"><svg width="12" height="12" fill="none" viewBox="0 0 16 16"><circle cx="6.5" cy="6.5" r="5" stroke="#888" strokeWidth="1.5"/><path d="M10.5 10.5l3 3" stroke="#888" strokeWidth="1.5" strokeLinecap="round"/></svg><input placeholder="Search livestock…" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
                </div>

                {filtered.length === 0 ? (
                    <div className="empty-state"><h3>No livestock found</h3><p>Registered animals will appear here.</p></div>
                ) : (
                    <table className="data-table">
                        <thead><tr><th><div className="th-inner">TAG NUMBER <span className="sort-icon">⇅</span></div></th><th><div className="th-inner">SPECIES</div></th><th><div className="th-inner">BREED</div></th><th><div className="th-inner">HEALTH</div></th><th><div className="th-inner">VACCINATION</div></th></tr></thead>
                        <tbody>
                            {filtered.map((l, i) => {
                                const h = (l.healthStatus || '').toLowerCase();
                                const hCls = h.includes('healthy') ? 'badge-green' : h.includes('sick') || h.includes('infected') ? 'badge-red' : 'badge-amber';
                                const v = (l.vaccinationStatus || '').toLowerCase();
                                const vCls = v.includes('up') || v.includes('compl') || v.includes('yes') ? 'badge-green' : v.includes('none') || v.includes('no') ? 'badge-red' : 'badge-amber';
                                return (
                                    <tr key={l._id || i} style={{ cursor: 'pointer' }} onClick={() => handleTraceFromRow(l._id, l.tagNumber)} title="Click to view movement history">
                                        <td><div className="cell-name"><div className="cell-avatar av-blue">L</div>{l.tagNumber || '—'}</div></td>
                                        <td>{l.species || '—'}</td>
                                        <td>{l.breed || '—'}</td>
                                        <td><span className={`cell-badge ${hCls}`}>{l.healthStatus || '—'}</span></td>
                                        <td><span className={`cell-badge ${vCls}`}>{l.vaccinationStatus || '—'}</span></td>
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

export default LivestockTraceability;

import React, { useEffect, useState } from 'react';
import { fetchFarms } from '../services/api';

const UserManagement: React.FC = () => {
    const [farms, setFarms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchFarms();
                setFarms(Array.isArray(data) ? data : data.data || []);
            } catch { setError('Failed to load data'); }
            finally { setLoading(false); }
        };
        load();
    }, []);

    const filtered = farms.filter((f) => {
        if (!searchTerm) return true;
        const q = searchTerm.toLowerCase();
        return (f.name || '').toLowerCase().includes(q) || (f.province || '').toLowerCase().includes(q) || (f.district || '').toLowerCase().includes(q);
    });

    if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 10, color: '#888' }}><div className="loading-spinner" /><span>Loading…</span></div>;
    if (error) return <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 10 }}><p style={{ color: '#c62828' }}>{error}</p></div>;

    return (
        <div>
            <div className="page-header">
                <div><h1 className="page-title">Farm & User Management</h1><div className="record-count">{farms.length} registered farms</div></div>
            </div>

            <div className="search-row">
                <div className="table-search"><svg width="12" height="12" fill="none" viewBox="0 0 16 16"><circle cx="6.5" cy="6.5" r="5" stroke="#888" strokeWidth="1.5"/><path d="M10.5 10.5l3 3" stroke="#888" strokeWidth="1.5" strokeLinecap="round"/></svg><input placeholder="Search farms…" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
            </div>

            {filtered.length === 0 ? (
                <div className="empty-state"><h3>No farms found</h3><p>Registered farms and their associated users will appear here.</p></div>
            ) : (
                <table className="data-table">
                    <thead><tr><th><div className="th-inner">FARM NAME <span className="sort-icon">⇅</span></div></th><th><div className="th-inner">REGISTRATION #</div></th><th><div className="th-inner">DISTRICT</div></th><th><div className="th-inner">PROVINCE</div></th><th><div className="th-inner">BIOSECURITY</div></th><th><div className="th-inner">QUARANTINED</div></th></tr></thead>
                    <tbody>
                        {filtered.map((f, i) => {
                            const q = f.isQuarantined;
                            return (
                                <tr key={f._id || i}>
                                    <td><div className="cell-name"><div className="cell-avatar av-blue">F</div>{f.name || '—'}</div></td>
                                    <td>{f.registrationNumber || '—'}</td>
                                    <td>{f.district || '—'}</td>
                                    <td>{f.province || '—'}</td>
                                    <td><span className={`cell-badge ${f.biosecurityLevel === 'high' ? 'badge-green' : f.biosecurityLevel === 'low' ? 'badge-red' : 'badge-amber'}`}>{f.biosecurityLevel || '—'}</span></td>
                                    <td><span className={`cell-badge ${q ? 'badge-red' : 'badge-green'}`}>{q ? 'Yes' : 'No'}</span></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default UserManagement;

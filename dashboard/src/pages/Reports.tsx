import React, { useEffect, useState } from 'react';
import { fetchDashboardData, fetchIncidentStats, fetchVaccinationStats } from '../services/api';
import StatCard from '../components/StatCard';

const Reports: React.FC = () => {
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [incidentStats, setIncidentStats] = useState<any>(null);
    const [vaccinationStats, setVaccinationStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tabView, setTabView] = useState<'overview' | 'incidents' | 'vaccination'>('overview');

    useEffect(() => {
        const load = async () => {
            try {
                const [dash, inc, vac] = await Promise.all([
                    fetchDashboardData().catch(() => null),
                    fetchIncidentStats().catch(() => null),
                    fetchVaccinationStats().catch(() => null),
                ]);
                setDashboardData(dash);
                setIncidentStats(inc);
                setVaccinationStats(vac);
            } catch { setError('Failed to load reports'); }
            finally { setLoading(false); }
        };
        load();
    }, []);

    if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 10, color: '#888' }}><div className="loading-spinner" /><span>Loading reports…</span></div>;
    if (error) return <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 10 }}><p style={{ color: '#c62828' }}>{error}</p></div>;

    const summary = dashboardData?.summary || {};

    const renderKV = (obj: any) => {
        if (!obj) return <p style={{ color: '#888', fontSize: 13 }}>No data available.</p>;
        const entries = Object.entries(obj).filter(([k]) => !k.startsWith('_'));
        if (entries.length === 0) return <p style={{ color: '#888', fontSize: 13 }}>No data available.</p>;
        return (
            <table className="data-table">
                <thead><tr><th><div className="th-inner">METRIC</div></th><th><div className="th-inner">VALUE</div></th></tr></thead>
                <tbody>
                    {entries.map(([key, val]) => (
                        <tr key={key}>
                            <td style={{ fontWeight: 500 }}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}</td>
                            <td>{typeof val === 'object' ? JSON.stringify(val) : String(val)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div>
            <div className="page-header">
                <div><h1 className="page-title">Reports & Analytics</h1><div className="record-count">Platform-wide statistics</div></div>
                <div className="header-actions"><button className="btn btn-secondary">Export PDF</button></div>
            </div>

            <div className="stats-grid">
                <StatCard title="Total Incidents" value={summary.totalIncidents ?? 0} color="#e94e4e" />
                <StatCard title="Active Quarantine" value={summary.activeQuarantineZones ?? 0} color="#f5a623" />
                <StatCard title="Pending Permits" value={summary.pendingPermits ?? 0} color="#0073ae" />
                <StatCard title="Total Livestock" value={summary.totalLivestock ?? 0} color="#00bda5" />
            </div>

            <div className="tabs-bar">
                <button className={`tab-item${tabView === 'overview' ? ' active' : ''}`} onClick={() => setTabView('overview')}>Overview</button>
                <button className={`tab-item${tabView === 'incidents' ? ' active' : ''}`} onClick={() => setTabView('incidents')}>Incident Stats</button>
                <button className={`tab-item${tabView === 'vaccination' ? ' active' : ''}`} onClick={() => setTabView('vaccination')}>Vaccination Stats</button>
            </div>

            <div className="panel">
                {tabView === 'overview' && (
                    <div><div className="panel-title">Summary Overview</div>{renderKV(summary)}</div>
                )}
                {tabView === 'incidents' && (
                    <div><div className="panel-title">Incident Statistics</div>{renderKV(incidentStats)}</div>
                )}
                {tabView === 'vaccination' && (
                    <div><div className="panel-title">Vaccination Statistics</div>{renderKV(vaccinationStats)}</div>
                )}
            </div>
        </div>
    );
};

export default Reports;

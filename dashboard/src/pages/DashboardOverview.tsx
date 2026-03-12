import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDashboardData } from '../services/api';
import StatCard from '../components/StatCard';
import VaccinationProgress from '../components/VaccinationProgress';
import OutbreakClusterPanel from '../components/OutbreakClusterPanel';
import CaseTimeline from '../components/CaseTimeline';

const QUICK_ACTIONS = [
    { icon: '⚠', label: 'Report Incident',        hint: 'Log suspected FMD case',            route: '/incidents' },
    { icon: '◉', label: 'Outbreak Map',            hint: 'View live disease hotspots',         route: '/outbreak-map' },
    { icon: '⌂', label: 'Farm Management',         hint: 'Register or update a farm',          route: '/farms' },
    { icon: '♞', label: 'Livestock Traceability',   hint: 'Trace animal movement history',      route: '/livestock' },
    { icon: '▣', label: 'Quarantine Zones',         hint: 'Manage restricted areas',            route: '/quarantine' },
    { icon: '☰', label: 'Movement Permits',         hint: 'Request or approve transport',       route: '/permits' },
    { icon: '✚', label: 'Vaccination Campaigns',    hint: 'Plan and track immunisation',        route: '/vaccination' },
    { icon: '✎', label: 'Export Compliance',        hint: 'Generate veterinary certificates',   route: '/export' },
];

const DashboardOverview: React.FC = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const result = await fetchDashboardData();
                setData(result);
            } catch {
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 10, color: '#888' }}><div className="loading-spinner" /><span>Loading dashboard…</span></div>;
    if (error) return <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 10 }}><p style={{ color: '#c62828' }}>{error}</p></div>;

    const summary = data?.summary || {};

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Operations Overview</h1>
                    <div className="record-count">Live surveillance, control, and response metrics</div>
                </div>
                <div className="header-actions">
                    <button className="btn btn-secondary" type="button">This Month</button>
                    <button className="btn btn-secondary" type="button">All Provinces</button>
                </div>
            </div>

            <div className="stats-grid">
                <StatCard title="Active Incidents" value={summary.activeIncidents ?? 0} description="Requiring immediate monitoring" />
                <StatCard title="Quarantine Zones" value={summary.activeQuarantineZones ?? 0} description="Currently in force" />
                <StatCard title="Active Campaigns" value={summary.activeCampaigns ?? 0} description="Vaccination in progress" />
                <StatCard title="Total Livestock" value={summary.totalLivestock ?? 0} description="Registered in system" />
            </div>

            {/* Quick Actions */}
            <section className="panel" style={{ marginBottom: 20 }}>
                <div className="panel-title">Quick Actions</div>
                <div className="quick-actions-grid">
                    {QUICK_ACTIONS.map((a) => (
                        <button
                            key={a.route}
                            type="button"
                            className="quick-action-card"
                            onClick={() => navigate(a.route)}
                        >
                            <div className="quick-action-icon">{a.icon}</div>
                            <div className="quick-action-label">{a.label}</div>
                            <div className="quick-action-hint">{a.hint}</div>
                        </button>
                    ))}
                </div>
            </section>

            <div className="content-grid-two">
                <section className="panel">
                    <VaccinationProgress />
                </section>
                <section className="panel">
                    <OutbreakClusterPanel />
                </section>
            </div>

            <section className="panel">
                <CaseTimeline />
            </section>
        </div>
    );
};

export default DashboardOverview;
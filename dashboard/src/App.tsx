import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from './components/Sidebar';
import DashboardOverview from './pages/DashboardOverview';
import IncidentManagement from './pages/IncidentManagement';
import FarmManagement from './pages/FarmManagement';
import OutbreakMap from './pages/OutbreakMap';
import VeterinaryInvestigations from './pages/VeterinaryInvestigations';
import LivestockTraceability from './pages/LivestockTraceability';
import QuarantineZones from './pages/QuarantineZones';
import VaccinationCampaigns from './pages/VaccinationCampaigns';
import AlertManagement from './pages/AlertManagement';
import MovementPermits from './pages/MovementPermits';
import ExportCompliance from './pages/ExportCompliance';
import Reports from './pages/Reports';
import UserManagement from './pages/UserManagement';
import Login from './pages/Login';
import { RootState, logout } from './store';

const ProtectedLayout: React.FC = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const initials = (user?.username || user?.email || 'U')
        .split(/[\s@]+/)
        .map((w: string) => w[0]?.toUpperCase() || '')
        .join('')
        .slice(0, 2);

    return (
        <div className="app-shell">
            {/* ── TOP BAR ── */}
            <header className="app-topbar">
                <div className="app-topbar-left">
                    <button
                        className="menu-btn"
                        type="button"
                        onClick={() => setSidebarOpen((v) => !v)}
                        aria-label="Toggle navigation"
                    >
                        ☰
                    </button>
                    <div className="topbar-logo">F</div>
                    <div className="topbar-search">
                        <svg className="search-icon" width="13" height="13" fill="none" viewBox="0 0 16 16">
                            <circle cx="6.5" cy="6.5" r="5" stroke="#888" strokeWidth="1.5"/>
                            <path d="M10.5 10.5l3 3" stroke="#888" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        <input placeholder="Search FMD Ops" />
                        <span className="kbd">⌘K</span>
                    </div>
                </div>

                <div className="topbar-spacer" />

                <div className="app-topbar-actions">
                    <div className="topbar-icon-btn" title="Notifications">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                            <path d="M8 2a5 5 0 00-5 5v3l-1 1h12l-1-1V7a5 5 0 00-5-5z" stroke="#555" strokeWidth="1.2" strokeLinecap="round"/>
                            <path d="M6.5 13a1.5 1.5 0 003 0" stroke="#555" strokeWidth="1.2"/>
                        </svg>
                    </div>
                    <div className="topbar-icon-btn" title="Help">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="8" r="6.5" stroke="#555" strokeWidth="1.2"/>
                            <path d="M5.5 6c.5-1.5 4.5-1.5 5 0 .7 2-2.5 2-2.5 3" stroke="#555" strokeWidth="1.2" strokeLinecap="round"/>
                            <circle cx="8" cy="12" r="0.5" fill="#555"/>
                        </svg>
                    </div>
                    <div className="topbar-user">
                        <div className="topbar-avatar">{initials}</div>
                        <span className="topbar-user-name">{user?.username || user?.email || 'User'}</span>
                        <span className="topbar-user-role">{user?.role || 'user'}</span>
                    </div>
                    <button className="topbar-sign-out" type="button" onClick={() => dispatch(logout())}>
                        Sign Out
                    </button>
                </div>
            </header>

            {/* ── BODY: SIDEBAR + MAIN ── */}
            <div className="app-layout">
                <Sidebar isOpen={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
                {sidebarOpen && (
                    <button
                        className="app-overlay"
                        onClick={() => setSidebarOpen(false)}
                        aria-label="Close navigation"
                    />
                )}
                <main className="app-main">
                    <div className="app-content">
                        <Routes>
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/dashboard" element={<DashboardOverview />} />
                            <Route path="/incidents" element={<IncidentManagement />} />
                            <Route path="/farms" element={<FarmManagement />} />
                            <Route path="/outbreak-map" element={<OutbreakMap />} />
                            <Route path="/veterinary" element={<VeterinaryInvestigations />} />
                            <Route path="/livestock" element={<LivestockTraceability />} />
                            <Route path="/quarantine" element={<QuarantineZones />} />
                            <Route path="/vaccination" element={<VaccinationCampaigns />} />
                            <Route path="/alerts" element={<AlertManagement />} />
                            <Route path="/permits" element={<MovementPermits />} />
                            <Route path="/export" element={<ExportCompliance />} />
                            <Route path="/reports" element={<Reports />} />
                            <Route path="/users" element={<UserManagement />} />
                            <Route path="*" element={<Navigate to="/dashboard" replace />} />
                        </Routes>
                    </div>
                </main>
            </div>
        </div>
    );
};

const App: React.FC = () => {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
                />
                <Route
                    path="*"
                    element={isAuthenticated ? <ProtectedLayout /> : <Navigate to="/login" replace />}
                />
            </Routes>
        </BrowserRouter>
    );
};

export default App;

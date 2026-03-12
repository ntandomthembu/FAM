import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
    {
        path: '/dashboard',
        label: 'Dashboard',
        icon: (
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="1" width="6" height="6" rx="1" fill="currentColor" opacity="0.7"/>
                <rect x="9" y="1" width="6" height="6" rx="1" fill="currentColor" opacity="0.7"/>
                <rect x="1" y="9" width="6" height="6" rx="1" fill="currentColor" opacity="0.7"/>
                <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" opacity="0.7"/>
            </svg>
        ),
    },
    {
        path: '/outbreak-map',
        label: 'Outbreak Map',
        icon: (
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="7" r="5" stroke="currentColor" strokeWidth="1.3"/>
                <circle cx="8" cy="7" r="2" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M8 12v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
        ),
    },
    {
        path: '/incidents',
        label: 'Incidents',
        icon: (
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <path d="M8 2l6 10H2L8 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                <path d="M8 6v3M8 11v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
        ),
    },
    {
        path: '/farms',
        label: 'Farms',
        icon: (
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <path d="M2 10h12v3a1 1 0 01-1 1H3a1 1 0 01-1-1v-3z" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M8 3v7M3 6h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                <path d="M4 6l4-3 4 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        ),
    },
    {
        path: '/vet-investigations',
        label: 'Vet Investigations',
        icon: (
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <path d="M9 5H7a2 2 0 00-2 2v6a1 1 0 001 1h4a1 1 0 001-1V7a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M6 5V3.5A1.5 1.5 0 017.5 2h1A1.5 1.5 0 0110 3.5V5" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M5 8h6M8 8v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
        ),
    },
    {
        path: '/quarantine',
        label: 'Quarantine Zones',
        icon: (
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
        ),
    },
    {
        path: '/permits',
        label: 'Movement Permits',
        icon: (
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <path d="M3 3h7l3 3v7a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M10 3v3h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                <path d="M5 9h6M5 11.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
        ),
    },
    {
        path: '/vaccination',
        label: 'Vaccination',
        icon: (
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <path d="M4 12l8-8M12 4l-2 2M6 10l2-2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                <circle cx="4" cy="12" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M12 2v4h-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        ),
    },
    {
        path: '/livestock',
        label: 'Livestock',
        icon: (
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <ellipse cx="8" cy="9" rx="5" ry="3.5" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M4 6.5c0-2.5 1.8-4 4-4s4 1.5 4 4" stroke="currentColor" strokeWidth="1.2"/>
                <circle cx="6.5" cy="8.5" r="0.8" fill="currentColor"/>
                <circle cx="9.5" cy="8.5" r="0.8" fill="currentColor"/>
            </svg>
        ),
    },
    {
        path: '/export',
        label: 'Export Compliance',
        icon: (
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M2 6h12" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M8 9v3M6 11l2 2 2-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        ),
    },
    {
        path: '/alerts',
        label: 'Alerts',
        icon: (
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <path d="M8 2a5 5 0 00-5 5v3l-1 1h12l-1-1V7a5 5 0 00-5-5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                <path d="M6.5 13a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.2"/>
            </svg>
        ),
    },
    {
        path: '/reports',
        label: 'Reports',
        icon: (
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <path d="M13 13H3a1 1 0 01-1-1V4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                <path d="M5 10l3-4 3 3 3-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        ),
    },
    {
        path: '/users',
        label: 'Users',
        icon: (
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M3 14c0-2.5 2.2-4.5 5-4.5s5 2 5 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
        ),
    },
];

interface SidebarProps {
    isOpen: boolean;
    onNavigate: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onNavigate }) => {
    return (
        <nav className={`sidebar${isOpen ? ' open' : ''}`}>
            <div className="sidebar-section-label">Operations</div>
            {navItems.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                        `sidebar-icon-link${isActive ? ' active' : ''}`
                    }
                    title={item.label}
                >
                    {item.icon}
                    <span className="sidebar-label">{item.label}</span>
                </NavLink>
            ))}
        </nav>
    );
};

export default Sidebar;

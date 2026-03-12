import React from 'react';

interface StatCardProps {
    title: string;
    value: number | string;
    description?: string;
    icon?: string;
    color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon, color = '#0f6cbd' }) => {
    return (
        <article className="stat-card" style={{ borderTop: `3px solid ${color}` }}>
            <div className="stat-card-label">{title}</div>
            {icon && <div className="stat-card-icon">{icon}</div>}
            <div className="stat-card-value">{value}</div>
            {description && <div className="stat-card-meta">{description}</div>}
            <div className="stat-card-trend">Updated just now</div>
        </article>
    );
};

export default StatCard;
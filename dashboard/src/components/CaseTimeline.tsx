import React, { useEffect, useState } from 'react';
import { fetchIncidents } from '../services/api';

interface IncidentEntry {
    _id: string;
    title?: string;
    description: string;
    status: string;
    createdAt: string;
}

const CaseTimeline: React.FC = () => {
    const [cases, setCases] = useState<IncidentEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchIncidents({ limit: 20 });
                const items = Array.isArray(data) ? data : data.data || [];
                setCases(items);
            } catch {
                // silent
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) return <div className="mini-state">Loading timeline...</div>;
    if (cases.length === 0) return <p className="mini-state">No cases to display.</p>;

    const statusColor: Record<string, string> = {
        reported: '#ff9800',
        under_investigation: '#2196f3',
        confirmed: '#f44336',
        resolved: '#4caf50',
    };

    return (
        <div>
            <div className="panel-title">Case Timeline</div>
            <div className="timeline-list">
                {cases.map((c) => (
                    <div key={c._id} className="timeline-row">
                        <div className="timeline-dot" style={{ background: statusColor[c.status] || '#999' }} />
                        <div className="timeline-content">
                            <div className="timeline-title">{c.title || c.description?.slice(0, 72) || 'Incident Update'}</div>
                            <div className="timeline-meta">
                                <span className="timeline-status" style={{ color: statusColor[c.status] || '#999' }}>{c.status}</span>
                                <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CaseTimeline;
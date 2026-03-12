import React, { useEffect, useState } from 'react';
import { fetchVaccinationCampaigns } from '../services/api';

interface Campaign {
    _id: string;
    name: string;
    targetCount: number;
    vaccinatedCount: number;
    status: string;
}

const VaccinationProgress: React.FC = () => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchVaccinationCampaigns();
                setCampaigns(Array.isArray(data) ? data : data.data || []);
            } catch {
                setError('Failed to load vaccination data');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) return <div className="mini-state">Loading vaccination progress...</div>;
    if (error) return <div className="mini-state error">{error}</div>;
    if (campaigns.length === 0) return <p className="mini-state">No campaigns found.</p>;

    return (
        <div>
            <div className="panel-title">Vaccination Campaign Progress</div>
            {campaigns.map((c) => {
                const pct = c.targetCount > 0 ? Math.round((c.vaccinatedCount / c.targetCount) * 100) : 0;
                return (
                    <div key={c._id} className="progress-row">
                        <div className="progress-row-head">
                            <span className="progress-name">{c.name}</span>
                            <span className="progress-values">{c.vaccinatedCount}/{c.targetCount} ({pct}%)</span>
                        </div>
                        <div className="progress-track">
                            <div
                                className="progress-fill"
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default VaccinationProgress;
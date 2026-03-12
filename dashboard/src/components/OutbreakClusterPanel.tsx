import React, { useEffect, useState } from 'react';
import { fetchHeatmapData } from '../services/api';

interface Cluster {
    centroid: { lat: number; lng: number };
    incidentCount: number;
    farmIds: string[];
}

const OutbreakClusterPanel: React.FC = () => {
    const [clusters, setClusters] = useState<Cluster[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchHeatmapData();
                setClusters(Array.isArray(data) ? data : []);
            } catch {
                setError('Failed to fetch outbreak clusters');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) return <div className="mini-state">Loading outbreak clusters...</div>;
    if (error) return <div className="mini-state error">{error}</div>;
    if (clusters.length === 0) return <p className="mini-state">No active outbreak clusters detected.</p>;

    return (
        <div>
            <div className="panel-title">Outbreak Clusters</div>
            <div className="cluster-grid">
                {clusters.map((cluster, i) => (
                    <div key={i} className="cluster-card">
                        <div className="cluster-title">
                            Cluster #{i + 1} — {cluster.incidentCount} incidents
                        </div>
                        <div className="cluster-meta">
                            Location: {cluster.centroid.lat.toFixed(4)}, {cluster.centroid.lng.toFixed(4)}
                        </div>
                        <div className="cluster-meta">
                            Affected farms: {cluster.farmIds?.length || 0}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OutbreakClusterPanel;
import React, { useEffect, useState } from 'react';
import { fetchTraceabilityData } from '../services/api';

interface TraceRecord {
    _id: string;
    tagNumber: string;
    species: string;
    farmId: string;
    movements?: number;
}

const TraceabilityGraph: React.FC = () => {
    const [data, setData] = useState<TraceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const result = await fetchTraceabilityData();
                const items = Array.isArray(result) ? result : result.data || [];
                setData(items);
            } catch {
                setError('Failed to load traceability data');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) return <div>Loading traceability data...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;
    if (data.length === 0) return <p style={{ color: '#999' }}>No traceability data available.</p>;

    return (
        <div>
            <h3>Livestock Traceability Overview</h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {data.slice(0, 20).map((item) => (
                    <div key={item._id} style={{
                        padding: '8px 14px',
                        background: '#e3f2fd',
                        borderRadius: 6,
                        fontSize: 13,
                    }}>
                        <strong>{item.tagNumber}</strong>
                        <div style={{ color: '#555' }}>{item.species}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TraceabilityGraph;
import React from 'react';

interface DataTableProps {
    data: any[];
    columns?: { key: string; label: string }[];
    onRowClick?: (row: any) => void;
}

const DataTable: React.FC<DataTableProps> = ({ data, columns, onRowClick }) => {
    if (!data || data.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-state-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3>No data available</h3>
                <p>Records will appear here once data is added.</p>
            </div>
        );
    }

    const cols = columns || Object.keys(data[0])
        .filter((k) => k !== '__v')
        .slice(0, 8)
        .map((k) => ({ key: k, label: k.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()) }));

    return (
        <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
                <thead>
                    <tr>
                        {cols.map((col) => (
                            <th key={col.key}>
                                <div className="th-inner">{col.label.toUpperCase()} <span className="sort-icon">⇅</span></div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, i) => (
                        <tr
                            key={row._id || row.id || i}
                            onClick={() => onRowClick?.(row)}
                            style={onRowClick ? { cursor: 'pointer' } : undefined}
                        >
                            {cols.map((col) => (
                                <td key={col.key}>
                                    {formatCell(row[col.key], col.key)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

function formatCell(value: any, key?: string): React.ReactNode {
    if (value == null) return <span className="cell-dash">—</span>;
    if (typeof value === 'boolean') return value ? <span className="cell-badge badge-green">Yes</span> : <span className="cell-badge badge-gray">No</span>;
    if (value instanceof Date) return value.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
        return new Date(value).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    if (key === 'status') {
        const s = String(value).toLowerCase();
        const cls = s.includes('active') || s.includes('approved') || s.includes('resolved') ? 'badge-green'
            : s.includes('pending') || s.includes('under') ? 'badge-amber'
            : s.includes('denied') || s.includes('expired') || s.includes('revoked') || s.includes('confirmed') ? 'badge-red'
            : 'badge-blue';
        return <span className={`cell-badge ${cls}`}>{String(value).replace(/_/g, ' ')}</span>;
    }
    if (typeof value === 'object') {
        if (value.name) return value.name;
        if (value.username) return value.username;
        return JSON.stringify(value);
    }
    return String(value);
}

export default DataTable;
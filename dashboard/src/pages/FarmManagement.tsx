import React, { useEffect, useState, useCallback } from 'react';
import { fetchFarms, createFarm, updateFarm, deleteFarm } from '../services/api';

const SA_PROVINCES = [
    'Eastern Cape',
    'Free State',
    'Gauteng',
    'KwaZulu-Natal',
    'Limpopo',
    'Mpumalanga',
    'Northern Cape',
    'North West',
    'Western Cape',
];

type ToastItem = { id: number; message: string; type: 'success' | 'error' };

interface FarmItem {
    _id: string;
    name: string;
    address: string;
    province: string;
    district: string;
    contactNumber: string;
    contactEmail?: string;
    numberOfAnimals: number;
    species: string[];
    biosecurityLevel: 'low' | 'medium' | 'high';
    isQuarantined: boolean;
    lastInspectionDate?: string;
    createdAt: string;
    location?: { type?: string; coordinates?: number[] };
}

/* ── Toast ── */
const Toast: React.FC<{ toast: ToastItem; onDismiss: (id: number) => void }> = ({ toast, onDismiss }) => {
    useEffect(() => {
        const t = setTimeout(() => onDismiss(toast.id), 4500);
        return () => clearTimeout(t);
    }, [toast.id, onDismiss]);

    return (
        <div className={`toast-item toast-${toast.type}`}>
            <span className="toast-icon-circle">
                {toast.type === 'success' ? (
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                ) : (
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                )}
            </span>
            <span className="toast-text">{toast.message}</span>
            <button className="toast-dismiss" onClick={() => onDismiss(toast.id)}>×</button>
        </div>
    );
};

/* ── BiosecurityBadge ── */
const BiosecurityBadge: React.FC<{ level: string }> = ({ level }) => {
    const bgMap = {
        'low': '#E8F5E9',
        'medium': '#FFF3E0',
        'high': '#E3F2FD',
    };
    const textMap = {
        'low': '#2E7D32',
        'medium': '#F57C00',
        'high': '#1565C0',
    };
    return (
        <span style={{
            display: 'inline-block',
            backgroundColor: bgMap[level as keyof typeof bgMap] || '#EEE',
            color: textMap[level as keyof typeof textMap] || '#666',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
        }}>
            {level}
        </span>
    );
};

/* ── Main ── */
const FarmManagement: React.FC = () => {
    const [farms, setFarms] = useState<FarmItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [locating, setLocating] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [provinceFilter, setProvinceFilter] = useState('all');
    const [toasts, setToasts] = useState<ToastItem[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const [form, setForm] = useState({
        name: '',
        address: '',
        province: '',
        district: '',
        contactNumber: '',
        contactEmail: '',
        numberOfAnimals: 0,
        species: 'cattle',
        biosecurityLevel: 'medium',
        latitude: '',
        longitude: '',
    });

    let toastCounter = 0;
    const pushToast = useCallback((message: string, type: 'success' | 'error') => {
        setToasts((prev) => [...prev, { id: Date.now() + (toastCounter++), message, type }]);
    }, []);
    const dismissToast = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const normalizeList = (data: any) => {
        if (Array.isArray(data)) return data;
        if (Array.isArray(data?.farms)) return data.farms;
        if (Array.isArray(data?.data)) return data.data;
        return [];
    };

    const load = async () => {
        try {
            const data = await fetchFarms();
            setFarms(normalizeList(data));
            setError(null);
        } catch {
            setError('Unable to reach the server.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const openModal = () => {
        setEditingId(null);
        setForm({
            name: '',
            address: '',
            province: '',
            district: '',
            contactNumber: '',
            contactEmail: '',
            numberOfAnimals: 0,
            species: 'cattle',
            biosecurityLevel: 'medium',
            latitude: '',
            longitude: '',
        });
        setModalOpen(true);
    };

    const openEditModal = (farm: FarmItem) => {
        setEditingId(farm._id);
        const coords = farm.location?.coordinates || [0, 0];
        setForm({
            name: farm.name,
            address: farm.address,
            province: farm.province,
            district: farm.district,
            contactNumber: farm.contactNumber,
            contactEmail: farm.contactEmail || '',
            numberOfAnimals: farm.numberOfAnimals,
            species: farm.species?.[0] || 'cattle',
            biosecurityLevel: farm.biosecurityLevel,
            latitude: String(coords[1] || ''),
            longitude: String(coords[0] || ''),
        });
        setModalOpen(true);
    };

    const closeModal = () => { if (!submitting) setModalOpen(false); };

    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            pushToast('Geolocation is not supported by this browser', 'error');
            return;
        }

        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude.toFixed(6);
                const longitude = position.coords.longitude.toFixed(6);
                setForm((prev) => ({ ...prev, latitude, longitude }));
                pushToast('Location captured successfully', 'success');
                setLocating(false);
            },
            (geoError) => {
                let message = 'Unable to capture location';
                if (geoError.code === geoError.PERMISSION_DENIED) {
                    message = 'Location permission denied';
                } else if (geoError.code === geoError.TIMEOUT) {
                    message = 'Location request timed out';
                } else if (geoError.code === geoError.POSITION_UNAVAILABLE) {
                    message = 'Location information unavailable';
                }
                pushToast(message, 'error');
                setLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!form.name || !form.address || !form.province || !form.district || !form.contactNumber) {
            pushToast('Please fill in all required fields', 'error');
            return;
        }

        const lat = parseFloat(form.latitude);
        const lng = parseFloat(form.longitude);
        if (isNaN(lat) || isNaN(lng)) {
            pushToast('Invalid latitude/longitude', 'error');
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                name: form.name,
                address: form.address,
                province: form.province,
                district: form.district,
                contactNumber: form.contactNumber,
                contactEmail: form.contactEmail || undefined,
                numberOfAnimals: parseInt(String(form.numberOfAnimals)) || 0,
                species: [form.species],
                biosecurityLevel: form.biosecurityLevel,
                location: {
                    type: 'Point',
                    coordinates: [lng, lat],
                },
            };

            if (editingId) {
                await updateFarm(editingId, payload);
                pushToast('Farm updated successfully', 'success');
            } else {
                await createFarm(payload);
                pushToast('Farm created successfully', 'success');
            }
            setModalOpen(false);
            await load();
        } catch (err: any) {
            pushToast(err?.response?.data?.message || err?.response?.data?.error || 'Failed to save farm', 'error');
        } finally { setSubmitting(false); }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this farm?')) return;
        try {
            await deleteFarm(id);
            pushToast('Farm deleted', 'success');
            await load();
        } catch { pushToast('Failed to delete farm', 'error'); }
    };

    const filtered = farms.filter((f) => {
        if (provinceFilter !== 'all' && f.province !== provinceFilter) return false;
        if (searchTerm) {
            const q = searchTerm.toLowerCase();
            if (!f.name.toLowerCase().includes(q) && !f.district.toLowerCase().includes(q)) return false;
        }
        return true;
    });

    const toggleSelect = (id: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    const toggleAll = () => {
        if (selectedIds.size === filtered.length) setSelectedIds(new Set());
        else setSelectedIds(new Set(filtered.map((f) => f._id)));
    };

    const total = farms.length;
    const quarantined = farms.filter((f) => f.isQuarantined).length;

    /* ── Loading / Error ── */
    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 10, color: '#888' }}>
                <div className="loading-spinner" />
                <span>Loading farms…</span>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 10 }}>
                <div style={{ fontSize: 14, color: '#d32f2f' }}>{error}</div>
                <button onClick={() => { setLoading(true); load(); }} style={{ marginTop: 10, padding: '8px 16px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Retry</button>
            </div>
        );
    }

    /* ── Page ── */
    return (
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            {/* Header & Stats */}
            <div style={{ marginBottom: 30 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h1 style={{ margin: 0, fontSize: 28, fontWeight: 'bold', color: '#1a1a1a' }}>Farm Management</h1>
                    <button
                        onClick={openModal}
                        style={{
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                        }}
                    >
                        + New Farm
                    </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 15 }}>
                    <div style={{ backgroundColor: 'white', padding: 15, borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <div style={{ fontSize: 12, color: '#999', textTransform: 'uppercase', fontWeight: 'bold' }}>Total Farms</div>
                        <div style={{ fontSize: 32, fontWeight: 'bold', color: '#1a1a1a', marginTop: 10 }}>{total}</div>
                    </div>
                    <div style={{ backgroundColor: 'white', padding: 15, borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <div style={{ fontSize: 12, color: '#999', textTransform: 'uppercase', fontWeight: 'bold' }}>Quarantined</div>
                        <div style={{ fontSize: 32, fontWeight: 'bold', color: '#d32f2f', marginTop: 10 }}>{quarantined}</div>
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div style={{ backgroundColor: 'white', padding: 15, borderRadius: '8px', marginBottom: 20, display: 'flex', gap: 15, flexWrap: 'wrap', alignItems: 'center' }}>
                <input
                    type="text"
                    placeholder="Search by farm name or district…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        padding: '8px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: 14,
                        flex: 1,
                        minWidth: 200,
                    }}
                />
                <select
                    value={provinceFilter}
                    onChange={(e) => setProvinceFilter(e.target.value)}
                    style={{
                        padding: '8px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: 14,
                        cursor: 'pointer',
                    }}
                >
                    <option value="all">All Provinces</option>
                    {SA_PROVINCES.map((p) => (
                        <option key={p} value={p}>{p}</option>
                    ))}
                </select>
                {selectedIds.size > 0 && (
                    <div style={{ fontSize: 13, color: '#666' }}>{selectedIds.size} selected</div>
                )}
            </div>

            {/* Table */}
            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f9f9f9', borderBottom: '1px solid #e0e0e0' }}>
                            <th style={{ padding: '12px', textAlign: 'left' }}>
                                <input
                                    type="checkbox"
                                    checked={selectedIds.size > 0 && selectedIds.size === filtered.length}
                                    onChange={toggleAll}
                                    style={{ cursor: 'pointer' }}
                                />
                            </th>
                            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#666' }}>Name</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#666' }}>Province</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#666' }}>District</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#666' }}>Animals</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#666' }}>Biosecurity</th>
                            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#666' }}>Contact</th>
                            <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', color: '#666' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={8} style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                                    No farms found
                                </td>
                            </tr>
                        ) : (
                            filtered.map((farm) => (
                                <tr key={farm._id} style={{ borderBottom: '1px solid #e0e0e0', backgroundColor: selectedIds.has(farm._id) ? '#f0f7ff' : 'transparent' }}>
                                    <td style={{ padding: '12px' }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.has(farm._id)}
                                            onChange={() => toggleSelect(farm._id)}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    </td>
                                    <td style={{ padding: '12px', fontWeight: '500', color: '#1a1a1a' }}>{farm.name}</td>
                                    <td style={{ padding: '12px', color: '#666' }}>{farm.province}</td>
                                    <td style={{ padding: '12px', color: '#666' }}>{farm.district}</td>
                                    <td style={{ padding: '12px', color: '#666' }}>{farm.numberOfAnimals}</td>
                                    <td style={{ padding: '12px' }}>
                                        <BiosecurityBadge level={farm.biosecurityLevel} />
                                        {farm.isQuarantined && (
                                            <span style={{ marginLeft: 8, backgroundColor: '#ffebee', color: '#c62828', padding: '2px 6px', borderRadius: '3px', fontSize: '11px', fontWeight: 'bold' }}>
                                                QUARANTINED
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ padding: '12px', fontSize: 12, color: '#666' }}>{farm.contactNumber}</td>
                                    <td style={{ padding: '12px', textAlign: 'center', display: 'flex', gap: 8, justifyContent: 'center' }}>
                                        <button
                                            onClick={() => openEditModal(farm)}
                                            style={{
                                                backgroundColor: '#2196F3',
                                                color: 'white',
                                                border: 'none',
                                                padding: '6px 12px',
                                                borderRadius: '3px',
                                                cursor: 'pointer',
                                                fontSize: 12,
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(farm._id)}
                                            style={{
                                                backgroundColor: '#f44336',
                                                color: 'white',
                                                border: 'none',
                                                padding: '6px 12px',
                                                borderRadius: '3px',
                                                cursor: 'pointer',
                                                fontSize: 12,
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        padding: '30px',
                        maxWidth: 600,
                        width: '90%',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                    }}>
                        <h2 style={{ margin: '0 0 20px 0', fontSize: 20, fontWeight: 'bold', color: '#1a1a1a' }}>
                            {editingId ? 'Edit Farm' : 'Create New Farm'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 15 }}>
                                <input
                                    type="text"
                                    placeholder="Farm Name *"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: 14 }}
                                    disabled={submitting}
                                />
                                <input
                                    type="tel"
                                    placeholder="Contact Number *"
                                    value={form.contactNumber}
                                    onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
                                    style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: 14 }}
                                    disabled={submitting}
                                />
                            </div>
                            <input
                                type="text"
                                placeholder="Address *"
                                value={form.address}
                                onChange={(e) => setForm({ ...form, address: e.target.value })}
                                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: 14, width: '100%', marginBottom: 15 }}
                                disabled={submitting}
                            />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 15 }}>
                                <select
                                    value={form.province}
                                    onChange={(e) => setForm({ ...form, province: e.target.value })}
                                    style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: 14, cursor: 'pointer' }}
                                    disabled={submitting}
                                >
                                    <option value="">Province *</option>
                                    {SA_PROVINCES.map((p) => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    placeholder="District *"
                                    value={form.district}
                                    onChange={(e) => setForm({ ...form, district: e.target.value })}
                                    style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: 14 }}
                                    disabled={submitting}
                                />
                            </div>
                            <input
                                type="email"
                                placeholder="Contact Email (Optional)"
                                value={form.contactEmail}
                                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: 14, width: '100%', marginBottom: 15 }}
                                disabled={submitting}
                            />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 15 }}>
                                <input
                                    type="number"
                                    placeholder="Number of Animals"
                                    value={form.numberOfAnimals}
                                    onChange={(e) => setForm({ ...form, numberOfAnimals: parseInt(e.target.value) || 0 })}
                                    style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: 14 }}
                                    disabled={submitting}
                                />
                                <select
                                    value={form.species}
                                    onChange={(e) => setForm({ ...form, species: e.target.value })}
                                    style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: 14, cursor: 'pointer' }}
                                    disabled={submitting}
                                >
                                    <option value="cattle">Cattle</option>
                                    <option value="sheep">Sheep</option>
                                    <option value="goat">Goat</option>
                                    <option value="pig">Pig</option>
                                    <option value="buffalo">Buffalo</option>
                                </select>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 15 }}>
                                <select
                                    value={form.biosecurityLevel}
                                    onChange={(e) => setForm({ ...form, biosecurityLevel: e.target.value })}
                                    style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: 14, cursor: 'pointer' }}
                                    disabled={submitting}
                                >
                                    <option value="low">Low Biosecurity</option>
                                    <option value="medium">Medium Biosecurity</option>
                                    <option value="high">High Biosecurity</option>
                                </select>
                            </div>
                            <div style={{ backgroundColor: '#f9f9f9', padding: 12, borderRadius: '4px', marginBottom: 15, fontSize: 13, color: '#666' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                    <div style={{ fontWeight: 'bold', color: '#333' }}>Location (Coordinates)</div>
                                    <button
                                        type="button"
                                        onClick={handleUseCurrentLocation}
                                        disabled={submitting || locating}
                                        style={{
                                            padding: '6px 10px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            backgroundColor: '#fff',
                                            color: '#333',
                                            fontSize: 12,
                                            cursor: submitting || locating ? 'not-allowed' : 'pointer',
                                            opacity: submitting || locating ? 0.7 : 1,
                                        }}
                                    >
                                        {locating ? 'Capturing...' : 'Use Current Location'}
                                    </button>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                    <input
                                        type="number"
                                        placeholder="Latitude *"
                                        step="0.0001"
                                        value={form.latitude}
                                        onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                                        style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: 13 }}
                                        disabled={submitting}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Longitude *"
                                        step="0.0001"
                                        value={form.longitude}
                                        onChange={(e) => setForm({ ...form, longitude: e.target.value })}
                                        style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: 13 }}
                                        disabled={submitting}
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={submitting}
                                    style={{
                                        padding: '10px 20px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        backgroundColor: '#f5f5f5',
                                        cursor: submitting ? 'not-allowed' : 'pointer',
                                        color: '#1a1a1a',
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: '#4CAF50',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: submitting ? 'not-allowed' : 'pointer',
                                        fontWeight: 'bold',
                                        opacity: submitting ? 0.7 : 1,
                                    }}
                                >
                                    {submitting ? 'Saving...' : editingId ? 'Update Farm' : 'Create Farm'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Toasts */}
            <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 2000, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {toasts.map((toast) => (
                    <Toast key={toast.id} toast={toast} onDismiss={dismissToast} />
                ))}
            </div>
        </div>
    );
};

export default FarmManagement;

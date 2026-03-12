import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const TOKEN_STORAGE_KEY = 'fmd_token';
const USER_STORAGE_KEY = 'fmd_user';
const USE_MOCK_DATA = (import.meta.env.VITE_USE_MOCK_DATA ?? 'true') !== 'false';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const requestUrl = error.config?.url ?? '';

        if (status === 401 && !requestUrl.includes('/auth/login') && !requestUrl.includes('/auth/register')) {
            localStorage.removeItem(TOKEN_STORAGE_KEY);
            localStorage.removeItem(USER_STORAGE_KEY);

            if (window.location.pathname !== '/login') {
                window.location.replace('/login');
            }
        }

        return Promise.reject(error);
    }
);

const nowIso = () => new Date().toISOString();

const mockUsers: any[] = [
    {
        _id: 'usr_001',
        username: 'ops_admin',
        email: 'admin@fmd.gov.za',
        role: 'admin',
        phone: '+27 71 555 0101',
    },
    {
        _id: 'usr_002',
        username: 'dr_nkosi',
        email: 'veterinary@fmd.gov.za',
        role: 'veterinarian',
        phone: '+27 71 555 0102',
    },
];

const mockFarms: any[] = [
    {
        _id: 'farm_001',
        name: 'Green Valley Ranch',
        registrationNumber: 'FMD-GAU-1001',
        ownerName: 'Sipho Dlamini',
        region: 'Gauteng',
        address: '12 Rietfontein Rd',
        province: 'Gauteng',
        district: 'Tshwane',
        contactNumber: '+27 82 000 1001',
        contactEmail: 'greenvalley@farm.za',
        numberOfAnimals: 420,
        species: ['cattle', 'goat'],
        biosecurityLevel: 'high',
        isQuarantined: false,
        lastInspectionDate: '2026-02-18T00:00:00.000Z',
        createdAt: '2025-10-10T09:20:00.000Z',
        location: { type: 'Point', coordinates: [28.1881, -25.7479] },
    },
    {
        _id: 'farm_002',
        name: 'Sunrise Livestock Co-op',
        registrationNumber: 'FMD-LIM-1002',
        ownerName: 'Lerato Mokoena',
        region: 'Limpopo',
        address: '88 Polokwane Belt',
        province: 'Limpopo',
        district: 'Capricorn',
        contactNumber: '+27 82 000 1002',
        contactEmail: 'sunrise@farm.za',
        numberOfAnimals: 610,
        species: ['cattle', 'sheep'],
        biosecurityLevel: 'medium',
        isQuarantined: true,
        lastInspectionDate: '2026-03-01T00:00:00.000Z',
        createdAt: '2025-09-14T12:10:00.000Z',
        location: { type: 'Point', coordinates: [29.4689, -23.9045] },
    },
    {
        _id: 'farm_003',
        name: 'Karoo Prime Stock',
        registrationNumber: 'FMD-EC-1003',
        ownerName: 'Mia Fourie',
        region: 'Eastern Cape',
        address: '5 Drylands Route',
        province: 'Eastern Cape',
        district: 'Sarah Baartman',
        contactNumber: '+27 82 000 1003',
        contactEmail: 'karoo@farm.za',
        numberOfAnimals: 275,
        species: ['sheep', 'goat'],
        biosecurityLevel: 'low',
        isQuarantined: false,
        lastInspectionDate: '2026-02-22T00:00:00.000Z',
        createdAt: '2025-08-01T08:00:00.000Z',
        location: { type: 'Point', coordinates: [24.3421, -33.312] },
    },
];

const mockIncidents: any[] = [
    {
        _id: 'inc_001',
        description: 'Blisters observed in herd near watering point',
        additionalNotes: 'Rapid spread among young cattle',
        status: 'under_investigation',
        createdAt: '2026-03-10T06:15:00.000Z',
        farmId: { _id: 'farm_001', name: 'Green Valley Ranch', province: 'Gauteng', district: 'Tshwane' },
        assignedVetId: { _id: 'usr_002', username: 'dr_nkosi', email: 'veterinary@fmd.gov.za' },
        species: 'cattle',
        gpsLocation: { type: 'Point', coordinates: [28.1881, -25.7479] },
    },
    {
        _id: 'inc_002',
        description: 'Lameness and fever in transport lot',
        status: 'confirmed_outbreak',
        createdAt: '2026-03-08T09:30:00.000Z',
        farmId: { _id: 'farm_002', name: 'Sunrise Livestock Co-op', province: 'Limpopo', district: 'Capricorn' },
        assignedVetId: { _id: 'usr_002', username: 'dr_nkosi', email: 'veterinary@fmd.gov.za' },
        species: 'cattle',
        gpsLocation: { type: 'Point', coordinates: [29.4689, -23.9045] },
    },
    {
        _id: 'inc_003',
        description: 'Mild oral lesions in sheep flock',
        status: 'reported',
        createdAt: '2026-03-05T11:45:00.000Z',
        farmId: { _id: 'farm_003', name: 'Karoo Prime Stock', province: 'Eastern Cape', district: 'Sarah Baartman' },
        species: 'sheep',
        gpsLocation: { type: 'Point', coordinates: [24.3421, -33.312] },
    },
    {
        _id: 'inc_004',
        description: 'Follow-up case closed after negative lab result',
        status: 'resolved',
        createdAt: '2026-02-28T15:10:00.000Z',
        farmId: { _id: 'farm_001', name: 'Green Valley Ranch', province: 'Gauteng', district: 'Tshwane' },
        species: 'goat',
        gpsLocation: { type: 'Point', coordinates: [28.2, -25.75] },
    },
];

const mockQuarantineZones: any[] = [
    {
        _id: 'zone_001',
        name: 'Capricorn Ring 1',
        centerPoint: { type: 'Point', coordinates: [29.4689, -23.9045] },
        radiusKm: 12,
        status: 'active',
        createdAt: '2026-03-08T12:00:00.000Z',
    },
    {
        _id: 'zone_002',
        name: 'Tshwane Buffer Zone',
        centerPoint: { type: 'Point', coordinates: [28.1881, -25.7479] },
        radiusKm: 8,
        status: 'lifted',
        createdAt: '2026-02-10T10:00:00.000Z',
    },
];

const mockCampaigns: any[] = [
    {
        _id: 'camp_001',
        name: 'Northern Cattle Shield',
        vaccineType: 'FMD Polyvalent',
        targetSpecies: 'cattle',
        targetCount: 1200,
        vaccinatedCount: 840,
        status: 'active',
    },
    {
        _id: 'camp_002',
        name: 'Karoo Small Stock Drive',
        vaccineType: 'FMD Bivalent',
        targetSpecies: 'sheep',
        targetCount: 700,
        vaccinatedCount: 700,
        status: 'completed',
    },
];

const mockVaccineStock: any[] = [
    {
        _id: 'stock_001',
        vaccineType: 'FMD Polyvalent',
        manufacturer: 'VetBio SA',
        batchNumber: 'VB-2026-031',
        quantity: 3600,
        expiryDate: '2026-11-30T00:00:00.000Z',
    },
    {
        _id: 'stock_002',
        vaccineType: 'FMD Bivalent',
        manufacturer: 'AgriShield',
        batchNumber: 'AS-2026-114',
        quantity: 1850,
        expiryDate: '2026-09-15T00:00:00.000Z',
    },
];

const mockLivestock: any[] = [
    { _id: 'liv_001', tagNumber: 'ZA-CT-0001', species: 'cattle', breed: 'Brahman', farmId: 'farm_001', healthStatus: 'Healthy', vaccinationStatus: 'Up to date', movements: 3 },
    { _id: 'liv_002', tagNumber: 'ZA-CT-0002', species: 'cattle', breed: 'Nguni', farmId: 'farm_002', healthStatus: 'Under observation', vaccinationStatus: 'Partial', movements: 2 },
    { _id: 'liv_003', tagNumber: 'ZA-SH-0103', species: 'sheep', breed: 'Dorper', farmId: 'farm_003', healthStatus: 'Healthy', vaccinationStatus: 'Up to date', movements: 1 },
];

const mockPermits: any[] = [
    {
        _id: 'perm_001',
        status: 'pending',
        reason: 'Transfer to certified auction facility',
        validUntil: '2026-03-20T00:00:00.000Z',
        createdAt: '2026-03-09T08:20:00.000Z',
        originFarmId: 'farm_001',
        destinationFarmId: 'farm_002',
    },
    {
        _id: 'perm_002',
        status: 'approved',
        reason: 'Seasonal grazing relocation',
        validUntil: '2026-03-30T00:00:00.000Z',
        createdAt: '2026-03-03T13:10:00.000Z',
        originFarmId: 'farm_003',
        destinationFarmId: 'farm_001',
    },
];

const mockCertificates: any[] = [
    {
        _id: 'cert_001',
        farmId: 'farm_001',
        destinationCountry: 'Botswana',
        status: 'pending',
        issuedDate: '2026-03-09T00:00:00.000Z',
        expiryDate: '2026-04-09T00:00:00.000Z',
    },
    {
        _id: 'cert_002',
        farmId: 'farm_002',
        destinationCountry: 'Namibia',
        status: 'approved',
        issuedDate: '2026-02-25T00:00:00.000Z',
        expiryDate: '2026-03-25T00:00:00.000Z',
    },
];

// --- LocalStorage persistence for mock data ---
const persistAll = () => {
    try {
        localStorage.setItem('fmd_farms', JSON.stringify(mockFarms));
        localStorage.setItem('fmd_incidents', JSON.stringify(mockIncidents));
        localStorage.setItem('fmd_livestock', JSON.stringify(mockLivestock));
        localStorage.setItem('fmd_permits', JSON.stringify(mockPermits));
        localStorage.setItem('fmd_zones', JSON.stringify(mockQuarantineZones));
        localStorage.setItem('fmd_campaigns', JSON.stringify(mockCampaigns));
        localStorage.setItem('fmd_vaccineStock', JSON.stringify(mockVaccineStock));
        localStorage.setItem('fmd_certificates', JSON.stringify(mockCertificates));
    } catch { /* storage full or unavailable */ }
};

// Hydrate mock arrays from localStorage on startup so data survives refresh
(() => {
    const hydrate = (key: string, arr: any[]) => {
        try {
            const stored = localStorage.getItem(key);
            if (stored) {
                const parsed = JSON.parse(stored);
                arr.length = 0;
                arr.push(...parsed);
            }
        } catch { /* ignore corrupt data */ }
    };
    hydrate('fmd_farms', mockFarms);
    hydrate('fmd_incidents', mockIncidents);
    hydrate('fmd_livestock', mockLivestock);
    hydrate('fmd_permits', mockPermits);
    hydrate('fmd_zones', mockQuarantineZones);
    hydrate('fmd_campaigns', mockCampaigns);
    hydrate('fmd_vaccineStock', mockVaccineStock);
    hydrate('fmd_certificates', mockCertificates);
})();

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

const mockDelay = async <T,>(value: T) => {
    persistAll(); // save all mock data after every operation
    await new Promise((resolve) => setTimeout(resolve, 120));
    return clone(value);
};

const nextId = (prefix: string) => `${prefix}_${Date.now()}`;

const getDashboardSummary = () => {
    const activeIncidents = mockIncidents.filter((i) => !['resolved', 'false_alarm'].includes((i.status || '').toLowerCase())).length;
    const activeQuarantineZones = mockQuarantineZones.filter((z) => z.status === 'active').length;
    const activeCampaigns = mockCampaigns.filter((c) => (c.status || '').toLowerCase().includes('active')).length;
    const totalLivestock = mockLivestock.length;
    return {
        totalIncidents: mockIncidents.length,
        activeIncidents,
        activeQuarantineZones,
        activeCampaigns,
        pendingPermits: mockPermits.filter((p) => p.status === 'pending').length,
        totalLivestock,
    };
};

const getHeatmapClusters = () => {
    const grouped = new Map<string, any>();
    for (const incident of mockIncidents) {
        const coords = incident.gpsLocation?.coordinates;
        if (!coords) continue;
        const key = `${coords[1].toFixed(1)},${coords[0].toFixed(1)}`;
        const current = grouped.get(key) || { latSum: 0, lngSum: 0, count: 0, farmIds: new Set<string>() };
        current.latSum += coords[1];
        current.lngSum += coords[0];
        current.count += 1;
        if (incident.farmId?._id) current.farmIds.add(incident.farmId._id);
        grouped.set(key, current);
    }

    return Array.from(grouped.values()).map((g) => ({
        centroid: { lat: g.latSum / g.count, lng: g.lngSum / g.count },
        incidentCount: g.count,
        farmIds: Array.from(g.farmIds),
    }));
};

const profileFromStorage = () => {
    const userRaw = localStorage.getItem(USER_STORAGE_KEY);
    if (!userRaw) return mockUsers[0];
    try {
        return JSON.parse(userRaw);
    } catch {
        return mockUsers[0];
    }
};

// --- Auth ---
export const loginUser = (email: string, password: string) =>
    USE_MOCK_DATA
        ? mockDelay({
            token: `mock-token-${Date.now()}`,
            user: mockUsers.find((u) => u.email === email) || { ...mockUsers[0], email },
            passwordHint: password ? undefined : undefined,
        })
        : apiClient.post('/auth/login', { email, password }).then((r) => r.data);

export const registerUser = (data: any) =>
    USE_MOCK_DATA
        ? mockDelay({
            token: `mock-token-${Date.now()}`,
            user: {
                _id: nextId('usr'),
                username: data?.username || 'new_user',
                email: data?.email || 'new-user@fmd.gov.za',
                role: data?.role || 'authority',
                phone: data?.phone,
            },
        })
        : apiClient.post('/auth/register', data).then((r) => r.data);

export const fetchProfile = () =>
    USE_MOCK_DATA ? mockDelay(profileFromStorage()) : apiClient.get('/auth/profile').then((r) => r.data);

// --- Dashboard ---
export const fetchDashboardData = () =>
    USE_MOCK_DATA
        ? mockDelay({ summary: getDashboardSummary(), generatedAt: nowIso() })
        : apiClient.get('/dashboard').then((r) => r.data);

export const fetchHeatmapData = () =>
    USE_MOCK_DATA ? mockDelay(getHeatmapClusters()) : apiClient.get('/dashboard/heatmap').then((r) => r.data);

// --- Incidents ---
export const fetchIncidents = (params?: any) =>
    USE_MOCK_DATA
        ? mockDelay(
            params?.limit
                ? mockIncidents.slice(0, Number(params.limit))
                : mockIncidents
        )
        : apiClient.get('/incidents', { params }).then((r) => r.data);

export const fetchIncidentById = (id: string) =>
    USE_MOCK_DATA
        ? mockDelay(mockIncidents.find((i) => i._id === id) || null)
        : apiClient.get(`/incidents/${id}`).then((r) => r.data);

export const reportIncident = (data: any) =>
    USE_MOCK_DATA
        ? (() => {
            const farm = mockFarms.find((f) => f._id === data?.farmId) || mockFarms[0];
            const item = {
                _id: nextId('inc'),
                description: data?.description || 'New suspected incident',
                additionalNotes: data?.symptoms?.join?.(', '),
                status: 'reported',
                createdAt: nowIso(),
                farmId: { _id: farm._id, name: farm.name, province: farm.province, district: farm.district },
                species: data?.species || 'cattle',
                gpsLocation: { type: 'Point', coordinates: farm.location?.coordinates || [25, -29] },
            };
            mockIncidents.unshift(item);
            return mockDelay(item);
        })()
        : apiClient.post('/incidents', data).then((r) => r.data);

export const updateIncident = (id: string, data: any) =>
    USE_MOCK_DATA
        ? (() => {
            const idx = mockIncidents.findIndex((i) => i._id === id);
            if (idx >= 0) mockIncidents[idx] = { ...mockIncidents[idx], ...data };
            return mockDelay(mockIncidents[idx]);
        })()
        : apiClient.put(`/incidents/${id}`, data).then((r) => r.data);

export const updateIncidentStatus = (id: string, status: string) =>
    USE_MOCK_DATA
        ? (() => {
            const incident = mockIncidents.find((i) => i._id === id);
            if (incident) incident.status = status;
            return mockDelay(incident || null);
        })()
        : apiClient.patch(`/incidents/${id}/status`, { status }).then((r) => r.data);

export const deleteIncident = (id: string) =>
    USE_MOCK_DATA
        ? (() => {
            const idx = mockIncidents.findIndex((i) => i._id === id);
            if (idx >= 0) mockIncidents.splice(idx, 1);
            return mockDelay({ success: true });
        })()
        : apiClient.delete(`/incidents/${id}`).then((r) => r.data);

export const fetchIncidentStats = () =>
    USE_MOCK_DATA
        ? mockDelay({
            total: mockIncidents.length,
            reported: mockIncidents.filter((i) => i.status === 'reported').length,
            underInvestigation: mockIncidents.filter((i) => i.status === 'under_investigation').length,
            confirmedOutbreak: mockIncidents.filter((i) => i.status === 'confirmed_outbreak').length,
            resolved: mockIncidents.filter((i) => i.status === 'resolved').length,
        })
        : apiClient.get('/incidents/stats').then((r) => r.data);

export const fetchNearbyIncidents = (lat: number, lng: number, radius?: number) =>
    USE_MOCK_DATA
        ? mockDelay(mockIncidents.filter((i) => i.gpsLocation?.coordinates).slice(0, 3))
        : apiClient.get('/incidents/nearby', { params: { lat, lng, radius } }).then((r) => r.data);

// --- Farms ---
export const fetchFarms = (params?: any) =>
    USE_MOCK_DATA ? mockDelay(mockFarms) : apiClient.get('/farms', { params }).then((r) => r.data);

export const fetchFarmById = (id: string) =>
    USE_MOCK_DATA ? mockDelay(mockFarms.find((f) => f._id === id) || null) : apiClient.get(`/farms/${id}`).then((r) => r.data);

export const createFarm = (data: any) =>
    USE_MOCK_DATA
        ? (() => {
            const item = {
                _id: nextId('farm'),
                registrationNumber: `FMD-MOCK-${Math.floor(Math.random() * 9000) + 1000}`,
                ownerName: data?.ownerName || 'Mock Owner',
                region: data?.province || 'Unknown',
                isQuarantined: false,
                createdAt: nowIso(),
                ...data,
            };
            mockFarms.unshift(item);
            return mockDelay(item);
        })()
        : apiClient.post('/farms', data).then((r) => r.data);

export const updateFarm = (id: string, data: any) =>
    USE_MOCK_DATA
        ? (() => {
            const idx = mockFarms.findIndex((f) => f._id === id);
            if (idx >= 0) mockFarms[idx] = { ...mockFarms[idx], ...data };
            return mockDelay(mockFarms[idx]);
        })()
        : apiClient.put(`/farms/${id}`, data).then((r) => r.data);

export const deleteFarm = (id: string) =>
    USE_MOCK_DATA
        ? (() => {
            const idx = mockFarms.findIndex((f) => f._id === id);
            if (idx >= 0) mockFarms.splice(idx, 1);
            return mockDelay({ success: true });
        })()
        : apiClient.delete(`/farms/${id}`).then((r) => r.data);

// --- Livestock ---
export const fetchLivestockByFarm = (farmId: string) =>
    USE_MOCK_DATA
        ? mockDelay(mockLivestock.filter((l) => l.farmId === farmId))
        : apiClient.get(`/livestock/farm/${farmId}`).then((r) => r.data);

export const registerLivestock = (data: any) =>
    USE_MOCK_DATA
        ? (() => {
            const item = { _id: nextId('liv'), tagNumber: `ZA-${Date.now()}`, movements: 0, ...data };
            mockLivestock.unshift(item);
            return mockDelay(item);
        })()
        : apiClient.post('/livestock', data).then((r) => r.data);

export const updateLivestock = (id: string, data: any) =>
    USE_MOCK_DATA
        ? (() => {
            const idx = mockLivestock.findIndex((l) => l._id === id);
            if (idx >= 0) mockLivestock[idx] = { ...mockLivestock[idx], ...data };
            return mockDelay(mockLivestock[idx]);
        })()
        : apiClient.put(`/livestock/${id}`, data).then((r) => r.data);

export const fetchTraceabilityData = () =>
    USE_MOCK_DATA ? mockDelay(mockLivestock) : apiClient.get('/livestock/traceability').then((r) => r.data);

export const traceLivestock = (id: string) =>
    USE_MOCK_DATA
        ? (() => {
            const item = mockLivestock.find((l) => l._id === id || l.tagNumber === id);
            return mockDelay({
                livestock: item || null,
                timeline: [
                    { date: '2026-01-12', event: 'Registered at farm' },
                    { date: '2026-02-03', event: 'Vaccinated round 1' },
                    { date: '2026-03-01', event: 'Movement inspection complete' },
                ],
            });
        })()
        : apiClient.get(`/livestock/${id}/trace`).then((r) => r.data);

export const recordMovement = (data: any) =>
    USE_MOCK_DATA ? mockDelay({ success: true, movementId: nextId('mov'), ...data }) : apiClient.post('/livestock/movements', data).then((r) => r.data);

export const fetchMovementsByFarm = (farmId: string) =>
    USE_MOCK_DATA
        ? mockDelay([
            { _id: 'mov_001', farmId, movedAt: '2026-03-05T10:00:00.000Z', count: 24, destination: 'Regional holding' },
        ])
        : apiClient.get(`/livestock/movements/farm/${farmId}`).then((r) => r.data);

// --- Quarantine ---
export const fetchQuarantineZones = (params?: any) =>
    USE_MOCK_DATA ? mockDelay(mockQuarantineZones) : apiClient.get('/quarantine', { params }).then((r) => r.data);

export const fetchQuarantineZoneById = (id: string) =>
    USE_MOCK_DATA ? mockDelay(mockQuarantineZones.find((z) => z._id === id) || null) : apiClient.get(`/quarantine/${id}`).then((r) => r.data);

export const createQuarantineZone = (data: any) =>
    USE_MOCK_DATA
        ? (() => {
            const item = { _id: nextId('zone'), status: 'active', createdAt: nowIso(), ...data };
            mockQuarantineZones.unshift(item);
            return mockDelay(item);
        })()
        : apiClient.post('/quarantine', data).then((r) => r.data);

export const updateQuarantineZone = (id: string, data: any) =>
    USE_MOCK_DATA
        ? (() => {
            const idx = mockQuarantineZones.findIndex((z) => z._id === id);
            if (idx >= 0) mockQuarantineZones[idx] = { ...mockQuarantineZones[idx], ...data };
            return mockDelay(mockQuarantineZones[idx]);
        })()
        : apiClient.put(`/quarantine/${id}`, data).then((r) => r.data);

export const liftQuarantineZone = (id: string) =>
    USE_MOCK_DATA
        ? (() => {
            const zone = mockQuarantineZones.find((z) => z._id === id);
            if (zone) zone.status = 'lifted';
            return mockDelay(zone || null);
        })()
        : apiClient.patch(`/quarantine/${id}/lift`).then((r) => r.data);

export const deleteQuarantineZone = (id: string) =>
    USE_MOCK_DATA
        ? (() => {
            const idx = mockQuarantineZones.findIndex((z) => z._id === id);
            if (idx >= 0) mockQuarantineZones.splice(idx, 1);
            return mockDelay({ success: true });
        })()
        : apiClient.delete(`/quarantine/${id}`).then((r) => r.data);

// --- Vaccination ---
export const fetchVaccinationCampaigns = (params?: any) =>
    USE_MOCK_DATA ? mockDelay(mockCampaigns) : apiClient.get('/vaccination/campaigns', { params }).then((r) => r.data);

export const fetchCampaignById = (id: string) =>
    USE_MOCK_DATA ? mockDelay(mockCampaigns.find((c) => c._id === id) || null) : apiClient.get(`/vaccination/campaigns/${id}`).then((r) => r.data);

export const createCampaign = (data: any) =>
    USE_MOCK_DATA
        ? (() => {
            const item = { _id: nextId('camp'), vaccinatedCount: 0, status: 'planned', ...data };
            mockCampaigns.unshift(item);
            return mockDelay(item);
        })()
        : apiClient.post('/vaccination/campaigns', data).then((r) => r.data);

export const recordVaccination = (data: any) =>
    USE_MOCK_DATA ? mockDelay({ success: true, recordId: nextId('vac'), ...data }) : apiClient.post('/vaccination/records', data).then((r) => r.data);

export const fetchVaccinationStats = () =>
    USE_MOCK_DATA
        ? mockDelay({
            totalCampaigns: mockCampaigns.length,
            activeCampaigns: mockCampaigns.filter((c) => (c.status || '').toLowerCase().includes('active')).length,
            totalVaccinations: mockCampaigns.reduce((sum, c) => sum + (c.vaccinatedCount || 0), 0),
            targetPopulation: mockCampaigns.reduce((sum, c) => sum + (c.targetCount || 0), 0),
        })
        : apiClient.get('/vaccination/stats').then((r) => r.data);

export const fetchVaccineStock = () =>
    USE_MOCK_DATA ? mockDelay(mockVaccineStock) : apiClient.get('/vaccination/stock').then((r) => r.data);

export const addVaccineStock = (data: any) =>
    USE_MOCK_DATA
        ? (() => {
            const item = { _id: nextId('stock'), ...data };
            mockVaccineStock.unshift(item);
            return mockDelay(item);
        })()
        : apiClient.post('/vaccination/stock', data).then((r) => r.data);

// --- Veterinary ---
export const assignVetToIncident = (incidentId: string, data: any) =>
    USE_MOCK_DATA
        ? (() => {
            const incident = mockIncidents.find((i) => i._id === incidentId);
            if (incident) incident.assignedVetId = { _id: data?.vetId || 'usr_002', username: 'dr_nkosi', email: 'veterinary@fmd.gov.za' };
            return mockDelay(incident || null);
        })()
        : apiClient.post(`/veterinary/assign/${incidentId}`, data).then((r) => r.data);

export const fetchAssignedIncidents = () =>
    USE_MOCK_DATA
        ? mockDelay(mockIncidents.filter((i) => i.assignedVetId))
        : apiClient.get('/veterinary/assigned').then((r) => r.data);

export const fetchInvestigationDetails = (incidentId: string) =>
    USE_MOCK_DATA
        ? (() => {
            const incident = mockIncidents.find((i) => i._id === incidentId);
            return mockDelay({
                incident,
                findings: {
                    lesionPattern: 'Consistent with early-stage FMD symptoms',
                    exposureRisk: 'High',
                    recommendedAction: 'Immediate movement restriction and targeted vaccination',
                },
                samples: [
                    { sampleId: 'lab_001', type: 'saliva', status: 'received' },
                    { sampleId: 'lab_002', type: 'epithelial tissue', status: 'processing' },
                ],
            });
        })()
        : apiClient.get(`/veterinary/investigation/${incidentId}`).then((r) => r.data);

export const submitLabSample = (data: any) =>
    USE_MOCK_DATA ? mockDelay({ success: true, sampleId: nextId('lab'), ...data }) : apiClient.post('/veterinary/lab-samples', data).then((r) => r.data);

export const updateLabSampleResult = (sampleId: string, data: any) =>
    USE_MOCK_DATA ? mockDelay({ success: true, sampleId, ...data }) : apiClient.patch(`/veterinary/lab-samples/${sampleId}/result`, data).then((r) => r.data);

export const confirmOutbreak = (incidentId: string) =>
    USE_MOCK_DATA
        ? updateIncidentStatus(incidentId, 'confirmed_outbreak')
        : apiClient.patch(`/veterinary/confirm/${incidentId}`).then((r) => r.data);

export const resolveIncident = (incidentId: string) =>
    USE_MOCK_DATA
        ? updateIncidentStatus(incidentId, 'resolved')
        : apiClient.patch(`/veterinary/resolve/${incidentId}`).then((r) => r.data);

// --- Alerts ---
export const sendProximityAlert = (data: any) =>
    USE_MOCK_DATA ? mockDelay({ success: true, alertType: 'proximity', ...data }) : apiClient.post('/alerts/proximity', data).then((r) => r.data);

export const sendOutbreakAlert = (incidentId: string) =>
    USE_MOCK_DATA ? mockDelay({ success: true, alertType: 'outbreak', incidentId }) : apiClient.post(`/alerts/outbreak/${incidentId}`).then((r) => r.data);

export const sendVaccinationReminder = (data: any) =>
    USE_MOCK_DATA ? mockDelay({ success: true, alertType: 'vaccination', ...data }) : apiClient.post('/alerts/vaccination-reminder', data).then((r) => r.data);

// --- Permits ---
export const fetchPermits = (params?: any) =>
    USE_MOCK_DATA ? mockDelay(mockPermits) : apiClient.get('/permits', { params }).then((r) => r.data);

export const fetchPermitById = (id: string) =>
    USE_MOCK_DATA ? mockDelay(mockPermits.find((p) => p._id === id) || null) : apiClient.get(`/permits/${id}`).then((r) => r.data);

export const requestPermit = (data: any) =>
    USE_MOCK_DATA
        ? (() => {
            const item = { _id: nextId('perm'), status: 'pending', createdAt: nowIso(), validUntil: '2026-04-30T00:00:00.000Z', ...data };
            mockPermits.unshift(item);
            return mockDelay(item);
        })()
        : apiClient.post('/permits', data).then((r) => r.data);

export const approvePermit = (id: string) =>
    USE_MOCK_DATA
        ? (() => {
            const item = mockPermits.find((p) => p._id === id);
            if (item) item.status = 'approved';
            return mockDelay(item || null);
        })()
        : apiClient.patch(`/permits/${id}/approve`).then((r) => r.data);

export const denyPermit = (id: string, reason: string) =>
    USE_MOCK_DATA
        ? (() => {
            const item = mockPermits.find((p) => p._id === id);
            if (item) {
                item.status = 'denied';
                item.reason = reason;
            }
            return mockDelay(item || null);
        })()
        : apiClient.patch(`/permits/${id}/deny`, { reason }).then((r) => r.data);

export const deletePermit = (id: string) =>
    USE_MOCK_DATA
        ? (() => {
            const idx = mockPermits.findIndex((p) => p._id === id);
            if (idx >= 0) mockPermits.splice(idx, 1);
            return mockDelay({ success: true });
        })()
        : apiClient.delete(`/permits/${id}`).then((r) => r.data);

// --- Export Compliance ---
export const fetchCertificates = (params?: any) =>
    USE_MOCK_DATA ? mockDelay(mockCertificates) : apiClient.get('/export/certificates', { params }).then((r) => r.data);

export const fetchCertificateById = (id: string) =>
    USE_MOCK_DATA ? mockDelay(mockCertificates.find((c) => c._id === id) || null) : apiClient.get(`/export/certificates/${id}`).then((r) => r.data);

export const fetchCertificatesByFarm = (farmId: string) =>
    USE_MOCK_DATA
        ? mockDelay(mockCertificates.filter((c) => c.farmId === farmId))
        : apiClient.get(`/export/certificates/farm/${farmId}`).then((r) => r.data);

export const generateCertificate = (data: any) =>
    USE_MOCK_DATA
        ? (() => {
            const item = {
                _id: nextId('cert'),
                status: 'pending',
                issuedDate: nowIso(),
                expiryDate: '2026-12-31T00:00:00.000Z',
                ...data,
            };
            mockCertificates.unshift(item);
            return mockDelay(item);
        })()
        : apiClient.post('/export/certificates', data).then((r) => r.data);

export const approveCertificate = (id: string) =>
    USE_MOCK_DATA
        ? (() => {
            const item = mockCertificates.find((c) => c._id === id);
            if (item) item.status = 'approved';
            return mockDelay(item || null);
        })()
        : apiClient.patch(`/export/certificates/${id}/approve`).then((r) => r.data);

export const revokeCertificate = (id: string) =>
    USE_MOCK_DATA
        ? (() => {
            const item = mockCertificates.find((c) => c._id === id);
            if (item) item.status = 'revoked';
            return mockDelay(item || null);
        })()
        : apiClient.patch(`/export/certificates/${id}/revoke`).then((r) => r.data);

export default apiClient;
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://10.0.2.2:5000/api/v1'; // Android emulator localhost
const USE_MOCK_DATA = process.env.EXPO_PUBLIC_USE_MOCK_DATA !== 'false';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' },
});

// Add auth token to requests
apiClient.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('fmd_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const nowIso = () => new Date().toISOString();
const nextId = (prefix: string) => `${prefix}_${Date.now()}`;

const mockUser = {
    _id: 'usr_mobile_001',
    id: 'usr_mobile_001',
    name: 'Field Officer Maseko',
    username: 'field_maseko',
    role: 'farmer',
    email: 'field.maseko@fmd.gov.za',
    phone: '+27 73 555 0901',
};

const mockFarms: any[] = [
    {
        _id: 'farm_001',
        name: 'Green Valley Ranch',
        ownerName: 'Sipho Dlamini',
        region: 'Gauteng',
        province: 'Gauteng',
        district: 'Tshwane',
        species: ['cattle', 'goat'],
        biosecurityLevel: 'high',
        isQuarantined: false,
        location: { type: 'Point', coordinates: [28.1881, -25.7479] },
    },
    {
        _id: 'farm_002',
        name: 'Sunrise Livestock Co-op',
        ownerName: 'Lerato Mokoena',
        region: 'Limpopo',
        province: 'Limpopo',
        district: 'Capricorn',
        species: ['cattle', 'sheep'],
        biosecurityLevel: 'medium',
        isQuarantined: true,
        location: { type: 'Point', coordinates: [29.4689, -23.9045] },
    },
];

const mockIncidents: any[] = [
    {
        _id: 'inc_001',
        status: 'under_investigation',
        description: 'Blisters observed in herd near watering point',
        species: 'cattle',
        createdAt: '2026-03-10T06:15:00.000Z',
        gpsLocation: { type: 'Point', coordinates: [28.1881, -25.7479] },
    },
    {
        _id: 'inc_002',
        status: 'confirmed_outbreak',
        description: 'Lameness and fever in transport lot',
        species: 'cattle',
        createdAt: '2026-03-08T09:30:00.000Z',
        gpsLocation: { type: 'Point', coordinates: [29.4689, -23.9045] },
    },
    {
        _id: 'inc_003',
        status: 'reported',
        description: 'Mild oral lesions in sheep flock',
        species: 'sheep',
        createdAt: '2026-03-05T11:45:00.000Z',
        gpsLocation: { type: 'Point', coordinates: [24.3421, -33.312] },
    },
];

const mockLivestock: any[] = [
    { _id: 'liv_001', tagNumber: 'ZA-CT-0001', species: 'cattle', breed: 'Brahman', healthStatus: 'Healthy', vaccinationStatus: 'Up to date' },
    { _id: 'liv_002', tagNumber: 'ZA-CT-0002', species: 'cattle', breed: 'Nguni', healthStatus: 'Under observation', vaccinationStatus: 'Partial' },
    { _id: 'liv_003', tagNumber: 'ZA-SH-0103', species: 'sheep', breed: 'Dorper', healthStatus: 'Healthy', vaccinationStatus: 'Up to date' },
];

const mockCampaigns: any[] = [
    { _id: 'camp_001', name: 'Northern Cattle Shield', targetSpecies: 'cattle', vaccineType: 'FMD Polyvalent', targetCount: 1200, vaccinatedCount: 840, status: 'active' },
    { _id: 'camp_002', name: 'Karoo Small Stock Drive', targetSpecies: 'sheep', vaccineType: 'FMD Bivalent', targetCount: 700, vaccinatedCount: 700, status: 'completed' },
];

const mockPermits: any[] = [
    { _id: 'perm_001', reason: 'Transfer to certified auction facility', destination: 'Capricorn Depot', status: 'pending', createdAt: '2026-03-09T08:20:00.000Z' },
];

const mockQuarantineZones: any[] = [
    { _id: 'zone_001', name: 'Capricorn Ring 1', status: 'active', radiusKm: 12, centerPoint: { type: 'Point', coordinates: [29.4689, -23.9045] } },
];

const mockCertificates: any[] = [
    { _id: 'cert_001', destinationCountry: 'Botswana', status: 'pending', issuedDate: '2026-03-09T00:00:00.000Z', expiryDate: '2026-04-09T00:00:00.000Z' },
];

const mockDelay = async <T,>(value: T) => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return JSON.parse(JSON.stringify(value));
};

// --- Auth ---
export const loginUser = (email: string, password: string) =>
    USE_MOCK_DATA
        ? mockDelay({ token: `mock-mobile-token-${Date.now()}`, user: { ...mockUser, email } })
        : apiClient.post('/auth/login', { email, password }).then((r) => r.data);

export const registerUser = (data: any) =>
    USE_MOCK_DATA
        ? mockDelay({ token: `mock-mobile-token-${Date.now()}`, user: { ...mockUser, ...data, _id: nextId('usr') } })
        : apiClient.post('/auth/register', data).then((r) => r.data);

export const fetchProfile = () =>
    USE_MOCK_DATA ? mockDelay(mockUser) : apiClient.get('/auth/profile').then((r) => r.data);

// --- Dashboard ---
export const fetchDashboardData = () =>
    USE_MOCK_DATA
        ? mockDelay({
            summary: {
                totalIncidents: mockIncidents.length,
                activeQuarantineZones: mockQuarantineZones.filter((z) => z.status === 'active').length,
                totalLivestock: mockLivestock.length,
                pendingPermits: mockPermits.filter((p) => p.status === 'pending').length,
            },
        })
        : apiClient.get('/dashboard').then((r) => r.data);

// --- Incidents ---
export const fetchIncidents = (params?: any) =>
    USE_MOCK_DATA
        ? mockDelay(params?.limit ? mockIncidents.slice(0, Number(params.limit)) : mockIncidents)
        : apiClient.get('/incidents', { params }).then((r) => r.data);

export const reportIncident = (data: any) =>
    USE_MOCK_DATA
        ? (() => {
            const item = {
                _id: nextId('inc'),
                status: 'reported',
                description: data?.symptoms || data?.description || 'New mobile incident',
                species: data?.species || 'cattle',
                createdAt: nowIso(),
                gpsLocation: { type: 'Point', coordinates: [28.1881, -25.7479] },
            };
            mockIncidents.unshift(item);
            return mockDelay(item);
        })()
        : apiClient.post('/incidents', data).then((r) => r.data);

export const fetchIncidentStats = () =>
    USE_MOCK_DATA
        ? mockDelay({
            totalIncidents: mockIncidents.length,
            confirmedOutbreaks: mockIncidents.filter((i) => i.status === 'confirmed_outbreak').length,
            underInvestigation: mockIncidents.filter((i) => i.status === 'under_investigation').length,
        })
        : apiClient.get('/incidents/stats').then((r) => r.data);

export const fetchNearbyIncidents = (lat: number, lng: number, radius?: number) =>
    USE_MOCK_DATA
        ? mockDelay(mockIncidents.slice(0, 2))
        : apiClient.get('/incidents/nearby', { params: { lat, lng, radius } }).then((r) => r.data);

// --- Farms ---
export const fetchFarms = (params?: any) =>
    USE_MOCK_DATA ? mockDelay(mockFarms) : apiClient.get('/farms', { params }).then((r) => r.data);

export const fetchFarmById = (id: string) =>
    USE_MOCK_DATA ? mockDelay(mockFarms.find((f) => f._id === id) || null) : apiClient.get(`/farms/${id}`).then((r) => r.data);

// --- Livestock ---
export const fetchLivestockByFarm = (farmId: string) =>
    USE_MOCK_DATA ? mockDelay(mockLivestock) : apiClient.get(`/livestock/farm/${farmId}`).then((r) => r.data);

export const fetchTraceabilityData = () =>
    USE_MOCK_DATA ? mockDelay(mockLivestock) : apiClient.get('/livestock/traceability').then((r) => r.data);

export const traceLivestock = (id: string) =>
    USE_MOCK_DATA
        ? mockDelay({
            livestock: mockLivestock.find((l) => l._id === id || l.tagNumber === id) || null,
            timeline: [
                { date: '2026-01-12', event: 'Registered at farm' },
                { date: '2026-02-03', event: 'Vaccinated round 1' },
            ],
        })
        : apiClient.get(`/livestock/${id}/trace`).then((r) => r.data);

// --- Quarantine ---
export const fetchQuarantineZones = () =>
    USE_MOCK_DATA ? mockDelay(mockQuarantineZones) : apiClient.get('/quarantine').then((r) => r.data);

// --- Vaccination ---
export const fetchVaccinationCampaigns = () =>
    USE_MOCK_DATA ? mockDelay(mockCampaigns) : apiClient.get('/vaccination/campaigns').then((r) => r.data);

export const fetchVaccinationStats = () =>
    USE_MOCK_DATA
        ? mockDelay({
            totalVaccinations: mockCampaigns.reduce((sum, c) => sum + (c.vaccinatedCount || 0), 0),
            activeCampaigns: mockCampaigns.filter((c) => c.status === 'active').length,
        })
        : apiClient.get('/vaccination/stats').then((r) => r.data);

export const fetchVaccineStock = () =>
    USE_MOCK_DATA
        ? mockDelay([
            { _id: 'stock_001', vaccineType: 'FMD Polyvalent', quantity: 3600, expiryDate: '2026-11-30T00:00:00.000Z' },
        ])
        : apiClient.get('/vaccination/stock').then((r) => r.data);

// --- Permits ---
export const fetchPermits = () =>
    USE_MOCK_DATA ? mockDelay(mockPermits) : apiClient.get('/permits').then((r) => r.data);

export const requestPermit = (data: any) =>
    USE_MOCK_DATA
        ? (() => {
            const item = { _id: nextId('perm'), status: 'pending', createdAt: nowIso(), ...data };
            mockPermits.unshift(item);
            return mockDelay(item);
        })()
        : apiClient.post('/permits', data).then((r) => r.data);

// --- Export ---
export const fetchCertificates = () =>
    USE_MOCK_DATA ? mockDelay(mockCertificates) : apiClient.get('/export/certificates').then((r) => r.data);

// --- Heatmap ---
export const fetchHeatmapData = () =>
    USE_MOCK_DATA
        ? mockDelay([
            { centroid: { lat: -25.7479, lng: 28.1881 }, incidentCount: 2, farmIds: ['farm_001'] },
            { centroid: { lat: -23.9045, lng: 29.4689 }, incidentCount: 1, farmIds: ['farm_002'] },
        ])
        : apiClient.get('/dashboard/heatmap').then((r) => r.data);

export default apiClient;
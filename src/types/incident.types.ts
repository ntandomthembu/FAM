import { IncidentStatus, AnimalSpecies } from './enums';
import { GeoCoordinates } from './geospatial.types';

export interface IncidentReport {
    farmId: string;
    farmLocation: string;
    numberOfAnimalsAffected: number;
    species: AnimalSpecies;
    symptoms: string[];
    photos?: string[];
    videos?: string[];
    timeSymptomsStarted: Date;
    gpsLocation: GeoCoordinates;
    reportedBy: string;
    additionalNotes?: string;
}

export interface OutbreakStatus {
    id: string;
    status: IncidentStatus;
    reportDate: Date;
    lastUpdated: Date;
    incidentReport: IncidentReport;
    assignedVetId?: string;
    labSampleIds?: string[];
    confirmedDate?: Date;
    resolvedDate?: Date;
}

export interface OutbreakCluster {
    id: string;
    location: string;
    centerPoint: GeoCoordinates;
    radiusKm: number;
    incidentIds: string[];
    caseCount: number;
    status: 'suspected' | 'confirmed' | 'contained' | 'resolved';
    detectedAt: Date;
}

export interface QuarantineZone {
    id: string;
    centerPoint: GeoCoordinates;
    radiusKm: number;
    location: string;
    startDate: Date;
    endDate?: Date;
    incidentIds: string[];
    status: 'active' | 'lifted' | 'expired';
}

export interface VaccinationCampaign {
    id: string;
    name: string;
    targetSpecies: AnimalSpecies[];
    startDate: Date;
    endDate?: Date;
    targetFarmIds: string[];
    vaccinatedFarmIds: string[];
    vaccineType: string;
    status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
}

export interface DashboardData {
    activeOutbreaks: number;
    totalIncidents: number;
    pendingInvestigations: number;
    confirmedCases: number;
    resolvedCases: number;
    vaccinatedFarms: number;
    totalFarms: number;
    activeQuarantineZones: number;
    pendingPermits: number;
    recentIncidents: OutbreakStatus[];
    outbreakClusters: OutbreakCluster[];
    vaccinationCoverage: number;
    averageResponseTimeHours: number;
}
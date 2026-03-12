import { AnimalSpecies } from './enums';

export interface Livestock {
    id: string;
    tagNumber: string;
    farmId: string;
    species: AnimalSpecies;
    breed: string;
    age: number;
    weight: number;
    healthStatus: HealthStatus;
    vaccinationStatus: VaccinationStatus;
    movementHistory: MovementRecord[];
    createdAt: Date;
    updatedAt: Date;
}

export interface MovementRecord {
    id: string;
    date: Date;
    fromFarmId: string;
    toFarmId: string;
    transportId?: string;
    auctionId?: string;
    reason: string;
    permitId?: string;
}

export enum HealthStatus {
    Healthy = 'healthy',
    Sick = 'sick',
    Quarantined = 'quarantined',
    Deceased = 'deceased',
    UnderObservation = 'under_observation',
}

export enum VaccinationStatus {
    NotVaccinated = 'not_vaccinated',
    PartiallyVaccinated = 'partially_vaccinated',
    FullyVaccinated = 'fully_vaccinated',
}

export interface LivestockTraceResult {
    livestock: Livestock;
    movements: MovementRecord[];
    connectedFarms: string[];
    connectedAuctions: string[];
    connectedTransports: string[];
}
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IncidentState {
    incidents: Array<{
        id: string;
        farmLocation: string;
        numberOfAnimalsAffected: number;
        species: string;
        symptoms: string[];
        photos: string[];
        reportedAt: string;
        status: 'reported' | 'under investigation' | 'confirmed outbreak' | 'false alarm' | 'resolved';
    }>;
}

const initialState: IncidentState = {
    incidents: [],
};

const incidentSlice = createSlice({
    name: 'incident',
    initialState,
    reducers: {
        reportIncident(state, action: PayloadAction<{
            farmLocation: string;
            numberOfAnimalsAffected: number;
            species: string;
            symptoms: string[];
            photos: string[];
        }>) {
            const newIncident = {
                id: Date.now().toString(),
                ...action.payload,
                reportedAt: new Date().toISOString(),
                status: 'reported',
            };
            state.incidents.push(newIncident);
        },
        updateIncidentStatus(state, action: PayloadAction<{
            id: string;
            status: 'under investigation' | 'confirmed outbreak' | 'false alarm' | 'resolved';
        }>) {
            const incident = state.incidents.find(incident => incident.id === action.payload.id);
            if (incident) {
                incident.status = action.payload.status;
            }
        },
        clearIncidents(state) {
            state.incidents = [];
        },
    },
});

export const { reportIncident, updateIncidentStatus, clearIncidents } = incidentSlice.actions;

export default incidentSlice.reducer;
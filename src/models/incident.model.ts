import { Schema, model, Document } from 'mongoose';
import { IncidentStatus, AnimalSpecies } from '../types/enums';

export interface IIncident extends Document {
    farmId: Schema.Types.ObjectId;
    reportedBy: Schema.Types.ObjectId;
    numberOfAnimalsAffected: number;
    species: AnimalSpecies;
    symptoms: string[];
    photos: string[];
    videos: string[];
    gpsLocation: {
        type: string;
        coordinates: [number, number];
    };
    timeSymptomsStarted: Date;
    status: IncidentStatus;
    assignedVetId?: Schema.Types.ObjectId;
    labSampleIds: Schema.Types.ObjectId[];
    additionalNotes?: string;
    confirmedDate?: Date;
    resolvedDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const incidentSchema = new Schema<IIncident>({
    farmId: { type: Schema.Types.ObjectId, ref: 'Farm', required: true },
    reportedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    numberOfAnimalsAffected: { type: Number, required: true, min: 1 },
    species: {
        type: String,
        required: true,
        enum: Object.values(AnimalSpecies),
    },
    symptoms: [{ type: String, required: true }],
    photos: [{ type: String }],
    videos: [{ type: String }],
    gpsLocation: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
            default: 'Point',
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    timeSymptomsStarted: { type: Date, required: true },
    status: {
        type: String,
        enum: Object.values(IncidentStatus),
        default: IncidentStatus.REPORTED,
    },
    assignedVetId: { type: Schema.Types.ObjectId, ref: 'User' },
    labSampleIds: [{ type: Schema.Types.ObjectId, ref: 'LabSample' }],
    additionalNotes: { type: String },
    confirmedDate: { type: Date },
    resolvedDate: { type: Date },
}, {
    timestamps: true,
});

incidentSchema.index({ gpsLocation: '2dsphere' });
incidentSchema.index({ status: 1 });
incidentSchema.index({ farmId: 1 });
incidentSchema.index({ createdAt: -1 });

const Incident = model<IIncident>('Incident', incidentSchema);

export default Incident;
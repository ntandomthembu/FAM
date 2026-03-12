import { Schema, model, Document } from 'mongoose';
import { AnimalSpecies } from '../types/enums';

export interface ILivestock extends Document {
    tagNumber: string;
    farmId: Schema.Types.ObjectId;
    species: AnimalSpecies;
    breed: string;
    dateOfBirth?: Date;
    age: number;
    weight: number;
    healthStatus: string;
    vaccinationStatus: string;
    symptoms?: string[];
    lastVaccinationDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const livestockSchema = new Schema<ILivestock>({
    tagNumber: { type: String, required: true, unique: true },
    farmId: { type: Schema.Types.ObjectId, ref: 'Farm', required: true },
    species: {
        type: String,
        required: true,
        enum: Object.values(AnimalSpecies),
    },
    breed: { type: String, required: true },
    dateOfBirth: { type: Date },
    age: { type: Number },
    weight: { type: Number },
    healthStatus: {
        type: String,
        enum: ['healthy', 'sick', 'quarantined', 'deceased', 'under_observation'],
        default: 'healthy',
    },
    vaccinationStatus: {
        type: String,
        enum: ['not_vaccinated', 'partially_vaccinated', 'fully_vaccinated'],
        default: 'not_vaccinated',
    },
    symptoms: [{ type: String }],
    lastVaccinationDate: { type: Date },
}, {
    timestamps: true,
});

livestockSchema.index({ farmId: 1 });
livestockSchema.index({ tagNumber: 1 });
livestockSchema.index({ healthStatus: 1 });

const Livestock = model<ILivestock>('Livestock', livestockSchema);

export default Livestock;
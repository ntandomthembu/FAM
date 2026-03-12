import { Schema, model, Document } from 'mongoose';
import { VaccinationCampaignStatus } from '../types/enums';

export interface IVaccinationCampaign extends Document {
    name: string;
    vaccineType: string;
    targetSpecies: string[];
    targetFarmIds: Schema.Types.ObjectId[];
    vaccinatedFarmIds: Schema.Types.ObjectId[];
    scheduledDate: Date;
    startDate?: Date;
    endDate?: Date;
    totalAnimalsTargeted: number;
    totalAnimalsVaccinated: number;
    coordinatorId: Schema.Types.ObjectId;
    status: VaccinationCampaignStatus;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const vaccinationCampaignSchema = new Schema<IVaccinationCampaign>({
    name: { type: String, required: true },
    vaccineType: { type: String, required: true },
    targetSpecies: [{ type: String, required: true }],
    targetFarmIds: [{ type: Schema.Types.ObjectId, ref: 'Farm' }],
    vaccinatedFarmIds: [{ type: Schema.Types.ObjectId, ref: 'Farm' }],
    scheduledDate: { type: Date, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    totalAnimalsTargeted: { type: Number, default: 0 },
    totalAnimalsVaccinated: { type: Number, default: 0 },
    coordinatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
        type: String,
        enum: Object.values(VaccinationCampaignStatus),
        default: VaccinationCampaignStatus.PLANNED,
    },
    notes: { type: String },
}, {
    timestamps: true,
});

vaccinationCampaignSchema.index({ status: 1 });
vaccinationCampaignSchema.index({ scheduledDate: 1 });

const VaccinationCampaign = model<IVaccinationCampaign>('VaccinationCampaign', vaccinationCampaignSchema);

export default VaccinationCampaign;
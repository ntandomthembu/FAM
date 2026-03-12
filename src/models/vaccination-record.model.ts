import { Schema, model, Document } from 'mongoose';

export interface IVaccinationRecord extends Document {
    campaignId: Schema.Types.ObjectId;
    farmId: Schema.Types.ObjectId;
    livestockIds: Schema.Types.ObjectId[];
    vaccineType: string;
    batchNumber: string;
    dateAdministered: Date;
    numberOfAnimalsVaccinated: number;
    veterinarianId: Schema.Types.ObjectId;
    nextDoseDate?: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const vaccinationRecordSchema = new Schema<IVaccinationRecord>({
    campaignId: { type: Schema.Types.ObjectId, ref: 'VaccinationCampaign' },
    farmId: { type: Schema.Types.ObjectId, ref: 'Farm', required: true },
    livestockIds: [{ type: Schema.Types.ObjectId, ref: 'Livestock' }],
    vaccineType: { type: String, required: true },
    batchNumber: { type: String, required: true },
    dateAdministered: { type: Date, required: true },
    numberOfAnimalsVaccinated: { type: Number, required: true, min: 1 },
    veterinarianId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    nextDoseDate: { type: Date },
    notes: { type: String },
}, {
    timestamps: true,
});

vaccinationRecordSchema.index({ farmId: 1 });
vaccinationRecordSchema.index({ campaignId: 1 });

const VaccinationRecord = model<IVaccinationRecord>('VaccinationRecord', vaccinationRecordSchema);

export default VaccinationRecord;
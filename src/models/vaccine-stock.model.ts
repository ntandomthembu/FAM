import { Schema, model, Document } from 'mongoose';

export interface IVaccineStock extends Document {
    vaccineName: string;
    manufacturer: string;
    batchNumber: string;
    quantityAvailable: number;
    quantityReserved: number;
    expirationDate: Date;
    storageLocation: string;
    supplier: string;
    unitCost: number;
    lastUpdated: Date;
    createdAt: Date;
    updatedAt: Date;
}

const vaccineStockSchema = new Schema<IVaccineStock>({
    vaccineName: { type: String, required: true },
    manufacturer: { type: String, required: true },
    batchNumber: { type: String, required: true, unique: true },
    quantityAvailable: { type: Number, required: true, min: 0 },
    quantityReserved: { type: Number, default: 0, min: 0 },
    expirationDate: { type: Date, required: true },
    storageLocation: { type: String, required: true },
    supplier: { type: String, required: true },
    unitCost: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
}, {
    timestamps: true,
});

vaccineStockSchema.index({ expirationDate: 1 });
vaccineStockSchema.index({ vaccineName: 1 });

const VaccineStock = model<IVaccineStock>('VaccineStock', vaccineStockSchema);

export default VaccineStock;
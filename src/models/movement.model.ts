import { Schema, model, Document } from 'mongoose';

export interface IMovement extends Document {
    livestockIds: Schema.Types.ObjectId[];
    fromFarmId: Schema.Types.ObjectId;
    toFarmId: Schema.Types.ObjectId;
    transportId?: Schema.Types.ObjectId;
    auctionId?: Schema.Types.ObjectId;
    permitId?: Schema.Types.ObjectId;
    movementDate: Date;
    movementType: 'purchase' | 'sale' | 'transfer' | 'auction' | 'quarantine';
    reason: string;
    numberOfAnimals: number;
    species: string;
    healthCertificateId?: string;
    createdAt: Date;
    updatedAt: Date;
}

const movementSchema = new Schema<IMovement>({
    livestockIds: [{ type: Schema.Types.ObjectId, ref: 'Livestock' }],
    fromFarmId: { type: Schema.Types.ObjectId, ref: 'Farm', required: true },
    toFarmId: { type: Schema.Types.ObjectId, ref: 'Farm', required: true },
    transportId: { type: Schema.Types.ObjectId, ref: 'Transport' },
    auctionId: { type: Schema.Types.ObjectId, ref: 'Auction' },
    permitId: { type: Schema.Types.ObjectId, ref: 'MovementPermit' },
    movementDate: { type: Date, required: true },
    movementType: {
        type: String,
        required: true,
        enum: ['purchase', 'sale', 'transfer', 'auction', 'quarantine'],
    },
    reason: { type: String, required: true },
    numberOfAnimals: { type: Number, required: true, min: 1 },
    species: { type: String, required: true },
    healthCertificateId: { type: String },
}, {
    timestamps: true,
});

movementSchema.index({ fromFarmId: 1 });
movementSchema.index({ toFarmId: 1 });
movementSchema.index({ movementDate: -1 });
movementSchema.index({ livestockIds: 1 });

const Movement = model<IMovement>('Movement', movementSchema);

export default Movement;
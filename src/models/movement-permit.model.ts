import { Schema, model, Document } from 'mongoose';
import { MovementPermitStatus } from '../types/enums';

export interface IMovementPermit extends Document {
    farmId: Schema.Types.ObjectId;
    applicantId: Schema.Types.ObjectId;
    livestockIds: Schema.Types.ObjectId[];
    species: string;
    numberOfAnimals: number;
    originAddress: string;
    destinationAddress: string;
    purpose: string;
    requestedDate: Date;
    movementDate: Date;
    expiryDate: Date;
    status: MovementPermitStatus;
    reviewedBy?: Schema.Types.ObjectId;
    reviewNotes?: string;
    denialReason?: string;
    createdAt: Date;
    updatedAt: Date;
}

const movementPermitSchema = new Schema<IMovementPermit>({
    farmId: { type: Schema.Types.ObjectId, ref: 'Farm', required: true },
    applicantId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    livestockIds: [{ type: Schema.Types.ObjectId, ref: 'Livestock' }],
    species: { type: String, required: true },
    numberOfAnimals: { type: Number, required: true, min: 1 },
    originAddress: { type: String, required: true },
    destinationAddress: { type: String, required: true },
    purpose: { type: String, required: true },
    requestedDate: { type: Date, default: Date.now },
    movementDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    status: {
        type: String,
        enum: Object.values(MovementPermitStatus),
        default: MovementPermitStatus.PENDING,
    },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewNotes: { type: String },
    denialReason: { type: String },
}, {
    timestamps: true,
});

movementPermitSchema.index({ farmId: 1 });
movementPermitSchema.index({ status: 1 });
movementPermitSchema.index({ expiryDate: 1 });

const MovementPermit = model<IMovementPermit>('MovementPermit', movementPermitSchema);

export default MovementPermit;
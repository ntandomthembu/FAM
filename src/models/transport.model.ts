import { Schema, model, Document } from 'mongoose';
import { TransportStatus } from '../types/enums';

export interface ITransport extends Document {
    vehicleType: string;
    licensePlate: string;
    driverName: string;
    driverContact: string;
    transporterId: Schema.Types.ObjectId;
    originFarmId: Schema.Types.ObjectId;
    destinationFarmId: Schema.Types.ObjectId;
    livestockIds: Schema.Types.ObjectId[];
    numberOfAnimals: number;
    species: string;
    permitId?: Schema.Types.ObjectId;
    departureDate: Date;
    arrivalDate?: Date;
    route?: string;
    status: TransportStatus;
    inspectionNotes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const transportSchema = new Schema<ITransport>({
    vehicleType: { type: String, required: true },
    licensePlate: { type: String, required: true },
    driverName: { type: String, required: true },
    driverContact: { type: String, required: true },
    transporterId: { type: Schema.Types.ObjectId, ref: 'User' },
    originFarmId: { type: Schema.Types.ObjectId, ref: 'Farm', required: true },
    destinationFarmId: { type: Schema.Types.ObjectId, ref: 'Farm', required: true },
    livestockIds: [{ type: Schema.Types.ObjectId, ref: 'Livestock' }],
    numberOfAnimals: { type: Number, required: true, min: 1 },
    species: { type: String, required: true },
    permitId: { type: Schema.Types.ObjectId, ref: 'MovementPermit' },
    departureDate: { type: Date, required: true },
    arrivalDate: { type: Date },
    route: { type: String },
    status: {
        type: String,
        enum: Object.values(TransportStatus),
        default: TransportStatus.PENDING,
    },
    inspectionNotes: { type: String },
}, {
    timestamps: true,
});

transportSchema.index({ originFarmId: 1 });
transportSchema.index({ destinationFarmId: 1 });
transportSchema.index({ status: 1 });

const Transport = model<ITransport>('Transport', transportSchema);

export default Transport;
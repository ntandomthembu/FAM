import { Schema, model, Document } from 'mongoose';
import { QuarantineZoneStatus } from '../types/enums';

export interface IQuarantineZone extends Document {
    name: string;
    centerPoint: {
        type: string;
        coordinates: [number, number];
    };
    radiusKm: number;
    incidentIds: Schema.Types.ObjectId[];
    affectedFarmIds: Schema.Types.ObjectId[];
    declaredBy: Schema.Types.ObjectId;
    startDate: Date;
    endDate?: Date;
    reason: string;
    restrictions: string[];
    status: QuarantineZoneStatus;
    createdAt: Date;
    updatedAt: Date;
}

const quarantineZoneSchema = new Schema<IQuarantineZone>({
    name: { type: String, required: true },
    centerPoint: {
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
    radiusKm: { type: Number, required: true, min: 0.1 },
    incidentIds: [{ type: Schema.Types.ObjectId, ref: 'Incident' }],
    affectedFarmIds: [{ type: Schema.Types.ObjectId, ref: 'Farm' }],
    declaredBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    reason: { type: String, required: true },
    restrictions: [{ type: String }],
    status: {
        type: String,
        enum: Object.values(QuarantineZoneStatus),
        default: QuarantineZoneStatus.ACTIVE,
    },
}, {
    timestamps: true,
});

quarantineZoneSchema.index({ centerPoint: '2dsphere' });
quarantineZoneSchema.index({ status: 1 });

const QuarantineZone = model<IQuarantineZone>('QuarantineZone', quarantineZoneSchema);

export default QuarantineZone;
import { Schema, model, Document } from 'mongoose';

export interface IFarm extends Document {
    name: string;
    location: {
        type: string;
        coordinates: [number, number];
    };
    address: string;
    province: string;
    district: string;
    ownerId: Schema.Types.ObjectId;
    contactNumber: string;
    contactEmail?: string;
    numberOfAnimals: number;
    species: string[];
    biosecurityLevel: 'low' | 'medium' | 'high';
    isQuarantined: boolean;
    lastInspectionDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const farmSchema = new Schema<IFarm>({
    name: { type: String, required: true, trim: true },
    location: {
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
    address: { type: String, required: true },
    province: { type: String, required: true },
    district: { type: String, required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    contactNumber: { type: String, required: true },
    contactEmail: { type: String },
    numberOfAnimals: { type: Number, default: 0 },
    species: [{ type: String }],
    biosecurityLevel: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
    isQuarantined: { type: Boolean, default: false },
    lastInspectionDate: { type: Date },
}, {
    timestamps: true,
});

farmSchema.index({ location: '2dsphere' });
farmSchema.index({ ownerId: 1 });
farmSchema.index({ province: 1 });

const Farm = model<IFarm>('Farm', farmSchema);

export default Farm;
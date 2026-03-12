import { Schema, model, Document } from 'mongoose';

export interface ILabSample extends Document {
    sampleId: string;
    incidentId: Schema.Types.ObjectId;
    collectedDate: Date;
    results: string;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}

const labSampleSchema = new Schema<ILabSample>({
    sampleId: {
        type: String,
        required: true,
        unique: true
    },
    incidentId: {
        type: Schema.Types.ObjectId,
        ref: 'Incident',
        required: true
    },
    collectedDate: {
        type: Date,
        required: true
    },
    results: {
        type: String,
        enum: ['Positive', 'Negative', 'Pending'],
        default: 'Pending'
    },
    notes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

const LabSample = model<ILabSample>('LabSample', labSampleSchema);

export default LabSample;
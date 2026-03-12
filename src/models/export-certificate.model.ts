import { Schema, model, Document } from 'mongoose';
import { ExportCertificateStatus } from '../types/enums';

export interface IExportCertificate extends Document {
    certificateNumber: string;
    farmId: Schema.Types.ObjectId;
    livestockDetails: string;
    healthStatus: string;
    status: ExportCertificateStatus;
    issueDate: Date;
    validUntil: Date;
    issuedBy: Schema.Types.ObjectId;
    issuedDate: Date;
    expiryDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

const exportCertificateSchema = new Schema<IExportCertificate>({
    certificateNumber: {
        type: String,
        required: true,
        unique: true
    },
    farmId: {
        type: Schema.Types.ObjectId,
        ref: 'Farm',
        required: true
    },
    livestockDetails: {
        type: String,
        required: true
    },
    healthStatus: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(ExportCertificateStatus),
        default: ExportCertificateStatus.PENDING,
    },
    issueDate: {
        type: Date,
    },
    validUntil: {
        type: Date,
    },
    issuedDate: {
        type: Date,
        default: Date.now
    },
    expiryDate: {
        type: Date,
    },
    issuedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
}, {
    timestamps: true,
});

const ExportCertificate = model<IExportCertificate>('ExportCertificate', exportCertificateSchema);

export default ExportCertificate;
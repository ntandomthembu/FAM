import ExportCertificate, { IExportCertificate } from '../models/export-certificate.model';
import Livestock from '../models/livestock.model';
import Farm from '../models/farm.model';
import { ExportCertificateStatus } from '../types/enums';
import { logInfo } from '../utils/logger';

export class ExportComplianceService {
    async generateExportCertificate(data: Partial<IExportCertificate>): Promise<IExportCertificate> {
        const cert = new ExportCertificate({
            ...data,
            status: ExportCertificateStatus.PENDING,
            issueDate: new Date(),
            validUntil: this.calculateValidityDate(),
        });
        const saved = await cert.save();
        logInfo(`Export certificate generated: ${saved._id}`);
        return saved;
    }

    private calculateValidityDate(days: number = 30): Date {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date;
    }

    async getCertificateById(certId: string): Promise<IExportCertificate | null> {
        return ExportCertificate.findById(certId)
            .populate('farmId', 'name address province')
            .populate('issuedBy', 'username')
            .exec();
    }

    async getCertificatesByFarm(farmId: string): Promise<IExportCertificate[]> {
        return ExportCertificate.find({ farmId }).sort({ issueDate: -1 }).exec();
    }

    async approveCertificate(certId: string, issuerId: string): Promise<IExportCertificate | null> {
        return ExportCertificate.findByIdAndUpdate(
            certId,
            {
                status: ExportCertificateStatus.APPROVED,
                issuedBy: issuerId,
                issueDate: new Date(),
            },
            { new: true }
        ).exec();
    }

    async revokeCertificate(certId: string): Promise<IExportCertificate | null> {
        return ExportCertificate.findByIdAndUpdate(
            certId,
            { status: ExportCertificateStatus.REVOKED },
            { new: true }
        ).exec();
    }

    async getAllCertificates(filters?: {
        status?: ExportCertificateStatus;
        page?: number;
        limit?: number;
    }): Promise<{ certificates: IExportCertificate[]; total: number }> {
        const query: any = {};
        if (filters?.status) query.status = filters.status;

        const page = filters?.page || 1;
        const limit = filters?.limit || 20;
        const skip = (page - 1) * limit;

        const [certificates, total] = await Promise.all([
            ExportCertificate.find(query)
                .populate('farmId', 'name')
                .sort({ issueDate: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            ExportCertificate.countDocuments(query).exec(),
        ]);

        return { certificates, total };
    }

    async getExportComplianceData(): Promise<{
        totalCertificates: number;
        pending: number;
        approved: number;
        revoked: number;
    }> {
        const [totalCertificates, pending, approved, revoked] = await Promise.all([
            ExportCertificate.countDocuments().exec(),
            ExportCertificate.countDocuments({ status: ExportCertificateStatus.PENDING }).exec(),
            ExportCertificate.countDocuments({ status: ExportCertificateStatus.APPROVED }).exec(),
            ExportCertificate.countDocuments({ status: ExportCertificateStatus.REVOKED }).exec(),
        ]);

        return { totalCertificates, pending, approved, revoked };
    }
}
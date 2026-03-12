import MovementPermit, { IMovementPermit } from '../models/movement-permit.model';
import { QuarantineService } from './quarantine.service';
import { MovementPermitStatus } from '../types/enums';
import { logInfo } from '../utils/logger';

export class PermitService {
    private quarantineService: QuarantineService;

    constructor() {
        this.quarantineService = new QuarantineService();
    }

    async requestPermit(data: Partial<IMovementPermit>): Promise<IMovementPermit> {
        const permit = new MovementPermit({
            ...data,
            status: MovementPermitStatus.PENDING,
        });
        const saved = await permit.save();
        logInfo(`Movement permit requested: ${saved._id}`);
        return saved;
    }

    async getPermitById(permitId: string): Promise<IMovementPermit | null> {
        return MovementPermit.findById(permitId)
            .populate('applicantId', 'username email')
            .populate('originFarmId', 'name address')
            .populate('destinationFarmId', 'name address')
            .populate('reviewedBy', 'username')
            .exec();
    }

    async getAllPermits(filters?: {
        status?: MovementPermitStatus;
        applicantId?: string;
        page?: number;
        limit?: number;
    }): Promise<{ permits: IMovementPermit[]; total: number }> {
        const query: any = {};
        if (filters?.status) query.status = filters.status;
        if (filters?.applicantId) query.applicantId = filters.applicantId;

        const page = filters?.page || 1;
        const limit = filters?.limit || 20;
        const skip = (page - 1) * limit;

        const [permits, total] = await Promise.all([
            MovementPermit.find(query)
                .populate('applicantId', 'username')
                .populate('originFarmId', 'name')
                .populate('destinationFarmId', 'name')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            MovementPermit.countDocuments(query).exec(),
        ]);

        return { permits, total };
    }

    async approvePermit(permitId: string, reviewerId: string): Promise<IMovementPermit | null> {
        const updated = await MovementPermit.findByIdAndUpdate(
            permitId,
            {
                status: MovementPermitStatus.APPROVED,
                reviewedBy: reviewerId,
                reviewedDate: new Date(),
            },
            { new: true }
        ).exec();
        if (updated) logInfo(`Permit ${permitId} approved by ${reviewerId}`);
        return updated;
    }

    async denyPermit(
        permitId: string,
        reviewerId: string,
        reason: string
    ): Promise<IMovementPermit | null> {
        return MovementPermit.findByIdAndUpdate(
            permitId,
            {
                status: MovementPermitStatus.DENIED,
                reviewedBy: reviewerId,
                reviewedDate: new Date(),
                denialReason: reason,
            },
            { new: true }
        ).exec();
    }

    async revokePermit(permitId: string): Promise<IMovementPermit | null> {
        return MovementPermit.findByIdAndUpdate(
            permitId,
            { status: MovementPermitStatus.REVOKED },
            { new: true }
        ).exec();
    }

    async deletePermit(permitId: string): Promise<boolean> {
        const result = await MovementPermit.findByIdAndDelete(permitId).exec();
        return !!result;
    }

    async getExpiredPermits(): Promise<IMovementPermit[]> {
        return MovementPermit.find({
            status: MovementPermitStatus.APPROVED,
            validUntil: { $lt: new Date() },
        }).exec();
    }
}
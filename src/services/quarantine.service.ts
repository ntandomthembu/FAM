import QuarantineZone, { IQuarantineZone } from '../models/quarantine-zone.model';
import MovementPermit, { IMovementPermit } from '../models/movement-permit.model';
import Farm from '../models/farm.model';
import { QuarantineZoneStatus } from '../types/enums';
import { logInfo } from '../utils/logger';

export class QuarantineService {
    async createQuarantineZone(data: Partial<IQuarantineZone>): Promise<IQuarantineZone> {
        const zone = new QuarantineZone(data);
        const saved = await zone.save();

        // Mark affected farms as quarantined
        if (data.centerPoint && data.radiusKm) {
            const coords = data.centerPoint.coordinates;
            await Farm.updateMany(
                {
                    gpsCoordinates: {
                        $near: {
                            $geometry: { type: 'Point', coordinates: coords },
                            $maxDistance: data.radiusKm * 1000,
                        },
                    },
                },
                { isQuarantined: true }
            ).exec();
        }

        logInfo(`Quarantine zone created: ${saved._id}`);
        return saved;
    }

    async getQuarantineZones(filters?: {
        status?: QuarantineZoneStatus;
    }): Promise<IQuarantineZone[]> {
        const query: any = {};
        if (filters?.status) query.status = filters.status;
        return QuarantineZone.find(query).sort({ createdAt: -1 }).exec();
    }

    async getActiveQuarantineZones(): Promise<IQuarantineZone[]> {
        return QuarantineZone.find({ status: QuarantineZoneStatus.ACTIVE }).exec();
    }

    async getQuarantineZoneById(id: string): Promise<IQuarantineZone | null> {
        return QuarantineZone.findById(id).exec();
    }

    async updateQuarantineZone(id: string, data: Partial<IQuarantineZone>): Promise<IQuarantineZone | null> {
        return QuarantineZone.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async liftQuarantineZone(id: string): Promise<IQuarantineZone | null> {
        const zone = await QuarantineZone.findByIdAndUpdate(
            id,
            { status: QuarantineZoneStatus.LIFTED, liftedDate: new Date() },
            { new: true }
        ).exec();

        // Unquarantine affected farms
        if (zone && zone.affectedFarmIds?.length) {
            await Farm.updateMany(
                { _id: { $in: zone.affectedFarmIds } },
                { isQuarantined: false }
            ).exec();
        }

        return zone;
    }

    async deleteQuarantineZone(id: string): Promise<IQuarantineZone | null> {
        return QuarantineZone.findByIdAndDelete(id).exec();
    }

    async checkIfLocationQuarantined(longitude: number, latitude: number): Promise<boolean> {
        const zones = await QuarantineZone.find({
            status: QuarantineZoneStatus.ACTIVE,
            centerPoint: {
                $near: {
                    $geometry: { type: 'Point', coordinates: [longitude, latitude] },
                    $maxDistance: 50000, // 50km max check
                },
            },
        }).exec();

        return zones.length > 0;
    }
}
import Farm, { IFarm } from '../models/farm.model';
import { logInfo } from '../utils/logger';

export class FarmService {
    async createFarm(farmData: Partial<IFarm>): Promise<IFarm> {
        const newFarm = new Farm(farmData);
        const saved = await newFarm.save();
        logInfo(`Farm created: ${saved._id}`);
        return saved;
    }

    async getFarmById(farmId: string): Promise<IFarm | null> {
        return Farm.findById(farmId).populate('ownerId', 'username email phone').exec();
    }

    async updateFarm(farmId: string, farmData: Partial<IFarm>): Promise<IFarm | null> {
        return Farm.findByIdAndUpdate(farmId, farmData, { new: true }).exec();
    }

    async deleteFarm(farmId: string): Promise<IFarm | null> {
        return Farm.findByIdAndDelete(farmId).exec();
    }

    async getAllFarms(filters?: {
        province?: string;
        isQuarantined?: boolean;
        page?: number;
        limit?: number;
    }): Promise<{ farms: IFarm[]; total: number }> {
        const query: any = {};
        if (filters?.province) query.province = filters.province;
        if (filters?.isQuarantined !== undefined) query.isQuarantined = filters.isQuarantined;

        const page = filters?.page || 1;
        const limit = filters?.limit || 20;
        const skip = (page - 1) * limit;

        const [farms, total] = await Promise.all([
            Farm.find(query)
                .populate('ownerId', 'username email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            Farm.countDocuments(query).exec(),
        ]);

        return { farms, total };
    }

    async getFarmsNearLocation(longitude: number, latitude: number, radiusKm: number): Promise<IFarm[]> {
        return Farm.find({
            gpsCoordinates: {
                $near: {
                    $geometry: { type: 'Point', coordinates: [longitude, latitude] },
                    $maxDistance: radiusKm * 1000,
                },
            },
        })
            .populate('ownerId', 'username email phone')
            .exec();
    }

    async setQuarantineStatus(farmId: string, isQuarantined: boolean): Promise<IFarm | null> {
        return Farm.findByIdAndUpdate(farmId, { isQuarantined }, { new: true }).exec();
    }

    async getFarmsByOwner(ownerId: string): Promise<IFarm[]> {
        return Farm.find({ ownerId }).exec();
    }
}
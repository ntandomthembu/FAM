import Movement, { IMovement } from '../models/movement.model';
import Livestock, { ILivestock } from '../models/livestock.model';
import Farm from '../models/farm.model';
import Auction from '../models/auction.model';
import Transport from '../models/transport.model';

export class LivestockTraceabilityService {
    async traceLivestock(livestockId: string): Promise<{
        animal: ILivestock | null;
        movements: IMovement[];
    }> {
        const [animal, movements] = await Promise.all([
            Livestock.findById(livestockId).populate('farmId', 'name address').exec(),
            Movement.find({ livestockIds: livestockId })
                .populate('originFarmId', 'name address')
                .populate('destinationFarmId', 'name address')
                .populate('transportId')
                .populate('auctionId')
                .sort({ departureDate: -1 })
                .exec(),
        ]);

        return { animal, movements };
    }

    async getMovementHistory(farmId: string): Promise<IMovement[]> {
        return Movement.find({
            $or: [{ originFarmId: farmId }, { destinationFarmId: farmId }],
        })
            .populate('livestockIds', 'tagNumber species')
            .sort({ departureDate: -1 })
            .exec();
    }

    async getAllLivestockInAuction(auctionId: string): Promise<IMovement[]> {
        return Movement.find({ auctionId })
            .populate('livestockIds', 'tagNumber species breed')
            .exec();
    }

    async getTransportDetails(transportId: string) {
        return Transport.findById(transportId)
            .populate('transporterId', 'username email')
            .exec();
    }

    async getLivestockByFarm(farmId: string): Promise<ILivestock[]> {
        return Livestock.find({ farmId }).exec();
    }

    async registerLivestock(data: Partial<ILivestock>): Promise<ILivestock> {
        const animal = new Livestock(data);
        return animal.save();
    }

    async updateLivestock(id: string, data: Partial<ILivestock>): Promise<ILivestock | null> {
        return Livestock.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async recordMovement(data: Partial<IMovement>): Promise<IMovement> {
        const movement = new Movement(data);
        return movement.save();
    }

    async getTraceabilityData(): Promise<{
        totalLivestock: number;
        totalMovements: number;
        recentMovements: IMovement[];
    }> {
        const [totalLivestock, totalMovements, recentMovements] = await Promise.all([
            Livestock.countDocuments().exec(),
            Movement.countDocuments().exec(),
            Movement.find()
                .populate('originFarmId', 'name')
                .populate('destinationFarmId', 'name')
                .sort({ createdAt: -1 })
                .limit(10)
                .exec(),
        ]);

        return { totalLivestock, totalMovements, recentMovements };
    }
}
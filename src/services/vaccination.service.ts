import VaccinationCampaign, { IVaccinationCampaign } from '../models/vaccination-campaign.model';
import VaccinationRecord, { IVaccinationRecord } from '../models/vaccination-record.model';
import VaccineStock, { IVaccineStock } from '../models/vaccine-stock.model';
import { VaccinationCampaignStatus } from '../types/enums';
import { logInfo } from '../utils/logger';

export class VaccinationService {
    // --- Campaigns ---
    async createVaccinationCampaign(data: Partial<IVaccinationCampaign>): Promise<IVaccinationCampaign> {
        const campaign = new VaccinationCampaign(data);
        const saved = await campaign.save();
        logInfo(`Vaccination campaign created: ${saved._id}`);
        return saved;
    }

    async getVaccinationCampaigns(filters?: {
        status?: VaccinationCampaignStatus;
    }): Promise<IVaccinationCampaign[]> {
        const query: any = {};
        if (filters?.status) query.status = filters.status;
        return VaccinationCampaign.find(query).sort({ startDate: -1 }).exec();
    }

    async getCampaignById(id: string): Promise<IVaccinationCampaign | null> {
        return VaccinationCampaign.findById(id)
            .populate('coordinatorId', 'username email')
            .exec();
    }

    async updateVaccinationCampaign(
        campaignId: string,
        data: Partial<IVaccinationCampaign>
    ): Promise<IVaccinationCampaign | null> {
        return VaccinationCampaign.findByIdAndUpdate(campaignId, data, { new: true }).exec();
    }

    async deleteVaccinationCampaign(campaignId: string): Promise<boolean> {
        const result = await VaccinationCampaign.findByIdAndDelete(campaignId).exec();
        return !!result;
    }

    // --- Records ---
    async recordVaccination(data: Partial<IVaccinationRecord>): Promise<IVaccinationRecord> {
        const record = new VaccinationRecord(data);
        const saved = await record.save();

        // Increment vaccinated count on campaign
        if (data.campaignId) {
            await VaccinationCampaign.findByIdAndUpdate(data.campaignId, {
                $inc: { totalAnimalsVaccinated: 1 },
            }).exec();
        }

        // Decrease stock
        if (data.vaccineType) {
            await VaccineStock.findOneAndUpdate(
                { vaccineName: data.vaccineType, quantityAvailable: { $gte: 1 } },
                { $inc: { quantityAvailable: -1 } }
            ).exec();
        }

        return saved;
    }

    async getRecordsByLivestock(livestockId: string): Promise<IVaccinationRecord[]> {
        return VaccinationRecord.find({ livestockId }).sort({ administeredDate: -1 }).exec();
    }

    async getRecordsByCampaign(campaignId: string): Promise<IVaccinationRecord[]> {
        return VaccinationRecord.find({ campaignId })
            .populate('livestockId', 'tagNumber species')
            .populate('administeredBy', 'username')
            .sort({ administeredDate: -1 })
            .exec();
    }

    // --- Stock ---
    async checkVaccineStock(vaccineType?: string): Promise<IVaccineStock[]> {
        const query: any = {};
        if (vaccineType) query.vaccineType = vaccineType;
        return VaccineStock.find(query).exec();
    }

    async addVaccineStock(data: Partial<IVaccineStock>): Promise<IVaccineStock> {
        const stock = new VaccineStock(data);
        return stock.save();
    }

    async updateVaccineStock(id: string, data: Partial<IVaccineStock>): Promise<IVaccineStock | null> {
        return VaccineStock.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    // --- Stats ---
    async getVaccinationStats(): Promise<{
        activeCampaigns: number;
        totalVaccinated: number;
        totalStockDoses: number;
    }> {
        const [activeCampaigns, campaigns, stocks] = await Promise.all([
            VaccinationCampaign.countDocuments({ status: VaccinationCampaignStatus.IN_PROGRESS }).exec(),
            VaccinationCampaign.find({}, 'totalAnimalsVaccinated').exec(),
            VaccineStock.find({}, 'quantityAvailable').exec(),
        ]);

        const totalVaccinated = campaigns.reduce((sum, c) => sum + ((c as any).totalAnimalsVaccinated || 0), 0);
        const totalStockDoses = stocks.reduce((sum, s) => sum + ((s as any).quantityAvailable || 0), 0);

        return { activeCampaigns, totalVaccinated, totalStockDoses };
    }
}
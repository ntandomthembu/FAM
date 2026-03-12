import { Request, Response } from 'express';
import { VaccinationService } from '../../services/vaccination.service';

const vaccinationService = new VaccinationService();

export const createCampaign = async (req: Request, res: Response) => {
    try {
        const campaign = await vaccinationService.createVaccinationCampaign({
            ...req.body,
            coordinatorId: (req as any).user?.id,
        });
        res.status(201).json(campaign);
    } catch (error: any) {
        res.status(500).json({ message: 'Error creating campaign', error: error.message });
    }
};

export const getCampaigns = async (req: Request, res: Response) => {
    try {
        const { status } = req.query;
        const campaigns = await vaccinationService.getVaccinationCampaigns({ status: status as any });
        res.status(200).json(campaigns);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching campaigns', error: error.message });
    }
};

export const getCampaignById = async (req: Request, res: Response) => {
    try {
        const campaign = await vaccinationService.getCampaignById(req.params.id);
        if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
        res.status(200).json(campaign);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching campaign', error: error.message });
    }
};

export const recordVaccination = async (req: Request, res: Response) => {
    try {
        const record = await vaccinationService.recordVaccination({
            ...req.body,
            administeredBy: (req as any).user?.id,
        });
        res.status(201).json(record);
    } catch (error: any) {
        res.status(500).json({ message: 'Error recording vaccination', error: error.message });
    }
};

export const getVaccineStock = async (req: Request, res: Response) => {
    try {
        const { vaccineType } = req.query;
        const stock = await vaccinationService.checkVaccineStock(vaccineType as string);
        res.status(200).json(stock);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching stock', error: error.message });
    }
};

export const addVaccineStock = async (req: Request, res: Response) => {
    try {
        const stock = await vaccinationService.addVaccineStock(req.body);
        res.status(201).json(stock);
    } catch (error: any) {
        res.status(500).json({ message: 'Error adding stock', error: error.message });
    }
};

export const getVaccinationStats = async (_req: Request, res: Response) => {
    try {
        const stats = await vaccinationService.getVaccinationStats();
        res.status(200).json(stats);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching stats', error: error.message });
    }
};
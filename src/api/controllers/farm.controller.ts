import { Request, Response } from 'express';
import { FarmService } from '../../services/farm.service';

const farmService = new FarmService();

export const createFarm = async (req: Request, res: Response) => {
    try {
        const newFarm = await farmService.createFarm({
            ...req.body,
            ownerId: (req as any).user?.id,
        });
        res.status(201).json(newFarm);
    } catch (error: any) {
        res.status(500).json({ message: 'Error creating farm', error: error.message });
    }
};

export const getFarmById = async (req: Request, res: Response) => {
    try {
        const farm = await farmService.getFarmById(req.params.id);
        if (!farm) return res.status(404).json({ message: 'Farm not found' });
        res.status(200).json(farm);
    } catch (error: any) {
        res.status(500).json({ message: 'Error retrieving farm', error: error.message });
    }
};

export const updateFarm = async (req: Request, res: Response) => {
    try {
        const updatedFarm = await farmService.updateFarm(req.params.id, req.body);
        if (!updatedFarm) return res.status(404).json({ message: 'Farm not found' });
        res.status(200).json(updatedFarm);
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating farm', error: error.message });
    }
};

export const deleteFarm = async (req: Request, res: Response) => {
    try {
        const deletedFarm = await farmService.deleteFarm(req.params.id);
        if (!deletedFarm) return res.status(404).json({ message: 'Farm not found' });
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ message: 'Error deleting farm', error: error.message });
    }
};

export const getAllFarms = async (req: Request, res: Response) => {
    try {
        const { province, isQuarantined, page, limit } = req.query;
        const result = await farmService.getAllFarms({
            province: province as string,
            isQuarantined: isQuarantined === 'true' ? true : isQuarantined === 'false' ? false : undefined,
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
        });
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ message: 'Error retrieving farms', error: error.message });
    }
};

export const getNearbyFarms = async (req: Request, res: Response) => {
    try {
        const { longitude, latitude, radius } = req.query;
        const farms = await farmService.getFarmsNearLocation(
            Number(longitude),
            Number(latitude),
            Number(radius) || 10
        );
        res.status(200).json(farms);
    } catch (error: any) {
        res.status(500).json({ message: 'Error finding nearby farms', error: error.message });
    }
};
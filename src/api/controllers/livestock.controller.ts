import { Request, Response } from 'express';
import { LivestockTraceabilityService } from '../../services/livestock-traceability.service';

const livestockService = new LivestockTraceabilityService();

export const registerLivestock = async (req: Request, res: Response) => {
    try {
        const animal = await livestockService.registerLivestock(req.body);
        res.status(201).json(animal);
    } catch (error: any) {
        res.status(500).json({ message: 'Error registering livestock', error: error.message });
    }
};

export const getLivestockByFarm = async (req: Request, res: Response) => {
    try {
        const livestock = await livestockService.getLivestockByFarm(req.params.farmId);
        res.status(200).json(livestock);
    } catch (error: any) {
        res.status(500).json({ message: 'Error retrieving livestock', error: error.message });
    }
};

export const updateLivestock = async (req: Request, res: Response) => {
    try {
        const updated = await livestockService.updateLivestock(req.params.id, req.body);
        if (!updated) return res.status(404).json({ message: 'Livestock not found' });
        res.status(200).json(updated);
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating livestock', error: error.message });
    }
};

export const traceLivestock = async (req: Request, res: Response) => {
    try {
        const traceData = await livestockService.traceLivestock(req.params.id);
        res.status(200).json(traceData);
    } catch (error: any) {
        res.status(500).json({ message: 'Error tracing livestock', error: error.message });
    }
};

export const recordMovement = async (req: Request, res: Response) => {
    try {
        const movement = await livestockService.recordMovement(req.body);
        res.status(201).json(movement);
    } catch (error: any) {
        res.status(500).json({ message: 'Error recording movement', error: error.message });
    }
};

export const getMovementHistory = async (req: Request, res: Response) => {
    try {
        const movements = await livestockService.getMovementHistory(req.params.farmId);
        res.status(200).json(movements);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching movement history', error: error.message });
    }
};

export const getTraceabilityData = async (_req: Request, res: Response) => {
    try {
        const data = await livestockService.getTraceabilityData();
        res.status(200).json(data);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching traceability data', error: error.message });
    }
};
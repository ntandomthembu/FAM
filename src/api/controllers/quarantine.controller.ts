import { Request, Response } from 'express';
import { QuarantineService } from '../../services/quarantine.service';

const quarantineService = new QuarantineService();

export const createQuarantineZone = async (req: Request, res: Response) => {
    try {
        const zone = await quarantineService.createQuarantineZone(req.body);
        res.status(201).json(zone);
    } catch (error: any) {
        res.status(500).json({ message: 'Error creating quarantine zone', error: error.message });
    }
};

export const getQuarantineZones = async (req: Request, res: Response) => {
    try {
        const { status } = req.query;
        const zones = await quarantineService.getQuarantineZones({ status: status as any });
        res.status(200).json(zones);
    } catch (error: any) {
        res.status(500).json({ message: 'Error retrieving quarantine zones', error: error.message });
    }
};

export const getQuarantineZoneById = async (req: Request, res: Response) => {
    try {
        const zone = await quarantineService.getQuarantineZoneById(req.params.id);
        if (!zone) return res.status(404).json({ message: 'Zone not found' });
        res.status(200).json(zone);
    } catch (error: any) {
        res.status(500).json({ message: 'Error retrieving quarantine zone', error: error.message });
    }
};

export const updateQuarantineZone = async (req: Request, res: Response) => {
    try {
        const updated = await quarantineService.updateQuarantineZone(req.params.id, req.body);
        if (!updated) return res.status(404).json({ message: 'Zone not found' });
        res.status(200).json(updated);
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating quarantine zone', error: error.message });
    }
};

export const liftQuarantineZone = async (req: Request, res: Response) => {
    try {
        const lifted = await quarantineService.liftQuarantineZone(req.params.id);
        if (!lifted) return res.status(404).json({ message: 'Zone not found' });
        res.status(200).json(lifted);
    } catch (error: any) {
        res.status(500).json({ message: 'Error lifting quarantine zone', error: error.message });
    }
};

export const deleteQuarantineZone = async (req: Request, res: Response) => {
    try {
        const deleted = await quarantineService.deleteQuarantineZone(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Zone not found' });
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ message: 'Error deleting quarantine zone', error: error.message });
    }
};
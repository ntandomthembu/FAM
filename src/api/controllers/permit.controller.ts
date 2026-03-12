import { Request, Response } from 'express';
import { PermitService } from '../../services/permit.service';

const permitService = new PermitService();

export const requestPermit = async (req: Request, res: Response) => {
    try {
        const permit = await permitService.requestPermit({
            ...req.body,
            applicantId: (req as any).user?.id,
        });
        res.status(201).json(permit);
    } catch (err: any) {
        res.status(500).json({ message: 'Error requesting permit', error: err.message });
    }
};

export const getPermitById = async (req: Request, res: Response) => {
    try {
        const permit = await permitService.getPermitById(req.params.id);
        if (!permit) return res.status(404).json({ message: 'Permit not found' });
        res.status(200).json(permit);
    } catch (err: any) {
        res.status(500).json({ message: 'Error fetching permit', error: err.message });
    }
};

export const getAllPermits = async (req: Request, res: Response) => {
    try {
        const { status, applicantId, page, limit } = req.query;
        const result = await permitService.getAllPermits({
            status: status as any,
            applicantId: applicantId as string,
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
        });
        res.status(200).json(result);
    } catch (err: any) {
        res.status(500).json({ message: 'Error fetching permits', error: err.message });
    }
};

export const approvePermit = async (req: Request, res: Response) => {
    try {
        const reviewerId = (req as any).user?.id;
        const permit = await permitService.approvePermit(req.params.id, reviewerId);
        if (!permit) return res.status(404).json({ message: 'Permit not found' });
        res.status(200).json(permit);
    } catch (err: any) {
        res.status(500).json({ message: 'Error approving permit', error: err.message });
    }
};

export const denyPermit = async (req: Request, res: Response) => {
    try {
        const reviewerId = (req as any).user?.id;
        const { reason } = req.body;
        const permit = await permitService.denyPermit(req.params.id, reviewerId, reason);
        if (!permit) return res.status(404).json({ message: 'Permit not found' });
        res.status(200).json(permit);
    } catch (err: any) {
        res.status(500).json({ message: 'Error denying permit', error: err.message });
    }
};

export const deletePermit = async (req: Request, res: Response) => {
    try {
        const deleted = await permitService.deletePermit(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Permit not found' });
        res.status(204).send();
    } catch (err: any) {
        res.status(500).json({ message: 'Error deleting permit', error: err.message });
    }
};
import { Request, Response } from 'express';
import { IncidentService } from '../../services/incident.service';

const incidentService = new IncidentService();

export const reportIncident = async (req: Request, res: Response) => {
    try {
        const normalizedSymptoms = Array.isArray(req.body.symptoms)
            ? req.body.symptoms
            : typeof req.body.symptoms === 'string'
                ? req.body.symptoms.split(',').map((symptom: string) => symptom.trim()).filter(Boolean)
                : [];

        const incident = await incidentService.createIncident({
            ...req.body,
            additionalNotes: req.body.additionalNotes || req.body.description,
            numberOfAnimalsAffected: Number(req.body.numberOfAnimalsAffected || 1),
            symptoms: normalizedSymptoms,
            reportedBy: (req as any).user?.id,
        });
        return res.status(201).json(incident);
    } catch (err: any) {
        if (err?.name === 'ValidationError') {
            return res.status(400).json({ message: 'Invalid incident payload', error: err.message });
        }

        if (err?.name === 'CastError' || /farmId|Farm not found|Valid farmId/i.test(err?.message || '')) {
            return res.status(400).json({ message: err.message || 'Invalid farmId' });
        }

        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

export const getIncidents = async (req: Request, res: Response) => {
    try {
        const { status, farmId, page, limit } = req.query;
        const result = await incidentService.getAllIncidents({
            status: status as any,
            farmId: farmId as string,
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
        });
        return res.status(200).json(result);
    } catch (err: any) {
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

export const getIncidentById = async (req: Request, res: Response) => {
    try {
        const incident = await incidentService.getIncidentById(req.params.id);
        if (!incident) {
            return res.status(404).json({ message: 'Incident not found' });
        }
        return res.status(200).json(incident);
    } catch (err: any) {
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

export const updateIncident = async (req: Request, res: Response) => {
    try {
        const updated = await incidentService.updateIncident(req.params.id, req.body);
        if (!updated) return res.status(404).json({ message: 'Incident not found' });
        return res.status(200).json(updated);
    } catch (err: any) {
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

export const updateIncidentStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        const vetId = (req as any).user?.id;
        const updated = await incidentService.updateIncidentStatus(req.params.id, status, vetId);
        if (!updated) return res.status(404).json({ message: 'Incident not found' });
        return res.status(200).json(updated);
    } catch (err: any) {
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

export const deleteIncident = async (req: Request, res: Response) => {
    try {
        const deleted = await incidentService.deleteIncident(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Incident not found' });
        return res.status(204).send();
    } catch (err: any) {
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

export const getNearbyIncidents = async (req: Request, res: Response) => {
    try {
        const { longitude, latitude, radius } = req.query;
        const incidents = await incidentService.getIncidentsNearLocation(
            Number(longitude),
            Number(latitude),
            Number(radius) || 10
        );
        return res.status(200).json(incidents);
    } catch (err: any) {
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

export const getIncidentStats = async (_req: Request, res: Response) => {
    try {
        const stats = await incidentService.getIncidentStats();
        return res.status(200).json(stats);
    } catch (err: any) {
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};
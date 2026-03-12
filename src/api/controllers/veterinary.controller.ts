import { Request, Response } from 'express';
import { VeterinaryService } from '../../services/veterinary.service';

const veterinaryService = new VeterinaryService();

export const assignVet = async (req: Request, res: Response) => {
    try {
        const { incidentId } = req.params;
        const { vetId } = req.body;
        const result = await veterinaryService.assignVetToIncident(incidentId, vetId);
        if (!result) return res.status(404).json({ message: 'Incident not found' });
        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(500).json({ message: 'Error assigning vet', error: error.message });
    }
};

export const getAssignedIncidents = async (req: Request, res: Response) => {
    try {
        const vetId = (req as any).user?.id;
        const incidents = await veterinaryService.getAssignedIncidents(vetId);
        return res.status(200).json(incidents);
    } catch (error: any) {
        return res.status(500).json({ message: 'Error fetching assignments', error: error.message });
    }
};

export const submitLabSample = async (req: Request, res: Response) => {
    try {
        const sample = await veterinaryService.submitLabSample({
            ...req.body,
            collectedBy: (req as any).user?.id,
        });
        return res.status(201).json(sample);
    } catch (error: any) {
        return res.status(500).json({ message: 'Error submitting lab sample', error: error.message });
    }
};

export const updateLabSampleResult = async (req: Request, res: Response) => {
    try {
        const { sampleId } = req.params;
        const { result, notes } = req.body;
        const updated = await veterinaryService.updateLabSampleResult(sampleId, result, notes);
        if (!updated) return res.status(404).json({ message: 'Sample not found' });
        return res.status(200).json(updated);
    } catch (error: any) {
        return res.status(500).json({ message: 'Error updating lab result', error: error.message });
    }
};

export const getInvestigationDetails = async (req: Request, res: Response) => {
    try {
        const data = await veterinaryService.getInvestigationDetails(req.params.incidentId);
        if (!data.incident) return res.status(404).json({ message: 'Incident not found' });
        return res.status(200).json(data);
    } catch (error: any) {
        return res.status(500).json({ message: 'Error fetching investigation', error: error.message });
    }
};

export const confirmOutbreak = async (req: Request, res: Response) => {
    try {
        const result = await veterinaryService.confirmOutbreak(req.params.incidentId);
        if (!result) return res.status(404).json({ message: 'Incident not found' });
        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(500).json({ message: 'Error confirming outbreak', error: error.message });
    }
};

export const resolveIncident = async (req: Request, res: Response) => {
    try {
        const result = await veterinaryService.resolveIncident(req.params.incidentId);
        if (!result) return res.status(404).json({ message: 'Incident not found' });
        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(500).json({ message: 'Error resolving incident', error: error.message });
    }
};
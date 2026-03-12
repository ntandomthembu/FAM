import { Request, Response } from 'express';
import { AlertService } from '../../services/alert.service';

const alertService = new AlertService();

export const sendProximityAlert = async (req: Request, res: Response) => {
    try {
        const { longitude, latitude, radiusKm, incidentId } = req.body;
        const count = await alertService.sendProximityAlert(longitude, latitude, radiusKm, incidentId);
        res.status(200).json({ message: `Alert sent to ${count} farmers` });
    } catch (error: any) {
        res.status(500).json({ message: 'Error sending alert', error: error.message });
    }
};

export const sendOutbreakAlert = async (req: Request, res: Response) => {
    try {
        const { incidentId } = req.params;
        await alertService.sendOutbreakAlert(incidentId);
        res.status(200).json({ message: 'Outbreak alert sent' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error sending outbreak alert', error: error.message });
    }
};

export const sendVaccinationReminder = async (req: Request, res: Response) => {
    try {
        const { userId, campaignName } = req.body;
        await alertService.sendVaccinationReminder(userId, campaignName);
        res.status(200).json({ message: 'Reminder sent' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error sending reminder', error: error.message });
    }
};
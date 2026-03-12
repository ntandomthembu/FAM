import { Job } from 'bull';
import { AlertService } from '../services/alert.service';
import { logInfo, logError } from '../utils/logger';

interface ProximityAlertJobData {
    incidentId: string;
    longitude: number;
    latitude: number;
    radiusKm: number;
}

export const proximityAlertJob = async (job: Job<ProximityAlertJobData>) => {
    const { incidentId, longitude, latitude, radiusKm } = job.data;
    const alertService = new AlertService();

    try {
        const count = await alertService.sendProximityAlert(longitude, latitude, radiusKm, incidentId);
        logInfo(`Proximity alert job: notified ${count} farmers for incident ${incidentId}`);
    } catch (error: any) {
        logError(`Proximity alert job failed: ${error.message}`);
    }
};

export default proximityAlertJob;
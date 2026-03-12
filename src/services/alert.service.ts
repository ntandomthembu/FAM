import { NotificationService } from './notification.service';
import Farm from '../models/farm.model';
import Incident from '../models/incident.model';
import { AlertChannel, IncidentStatus } from '../types/enums';
import { logInfo } from '../utils/logger';

export class AlertService {
    private notificationService: NotificationService;

    constructor() {
        this.notificationService = new NotificationService();
    }

    async sendProximityAlert(
        longitude: number,
        latitude: number,
        radiusKm: number,
        incidentId: string
    ): Promise<number> {
        const message =
            `[FMD ALERT] A disease incident has been reported within ${radiusKm}km of your farm. ` +
            `Incident ID: ${incidentId}. Please take biosecurity precautions immediately.`;

        return this.notificationService.sendAlertToNearbyFarmers(
            longitude,
            latitude,
            radiusKm,
            message
        );
    }

    async sendMovementBanAlert(zoneId: string, message: string): Promise<void> {
        logInfo(`Movement ban alert for zone ${zoneId}`);
        await this.notificationService.broadcastAlert(
            `[MOVEMENT BAN] ${message}`,
            [AlertChannel.SMS, AlertChannel.WHATSAPP]
        );
    }

    async sendOutbreakAlert(incidentId: string): Promise<void> {
        const incident = await Incident.findById(incidentId)
            .populate('farmId', 'gpsCoordinates')
            .exec();

        if (!incident) return;

        const farm = incident.farmId as any;
        if (farm?.gpsCoordinates?.coordinates) {
            const [lng, lat] = farm.gpsCoordinates.coordinates;
            await this.sendProximityAlert(lng, lat, 10, incidentId);
        }

        logInfo(`Outbreak alert sent for incident ${incidentId}`);
    }

    async sendVaccinationReminder(userId: string, campaignName: string): Promise<void> {
        const message = `[VACCINATION] Reminder: Vaccination campaign "${campaignName}" is active in your area. Please contact your local vet office.`;
        await this.notificationService.sendNotification(userId, message, [AlertChannel.SMS]);
    }
}
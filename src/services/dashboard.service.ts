import Incident from '../models/incident.model';
import Farm from '../models/farm.model';
import Livestock from '../models/livestock.model';
import QuarantineZone from '../models/quarantine-zone.model';
import VaccinationCampaign from '../models/vaccination-campaign.model';
import ExportCertificate from '../models/export-certificate.model';
import Movement from '../models/movement.model';
import { IncidentStatus, QuarantineZoneStatus, VaccinationCampaignStatus, ExportCertificateStatus } from '../types/enums';

export interface DashboardData {
    summary: {
        totalFarms: number;
        totalLivestock: number;
        activeIncidents: number;
        activeQuarantineZones: number;
        activeCampaigns: number;
        pendingExportCerts: number;
    };
    recentIncidents: any[];
    activeQuarantineZones: any[];
    movementStats: {
        totalMovements: number;
        last30Days: number;
    };
}

export class DashboardService {
    async getDashboardData(): Promise<DashboardData> {
        const [
            totalFarms,
            totalLivestock,
            activeIncidents,
            activeQuarantineZones,
            activeCampaigns,
            pendingExportCerts,
            recentIncidents,
            quarantineZones,
            totalMovements,
            recentMovements,
        ] = await Promise.all([
            Farm.countDocuments().exec(),
            Livestock.countDocuments().exec(),
            Incident.countDocuments({
                status: { $in: [IncidentStatus.REPORTED, IncidentStatus.UNDER_INVESTIGATION, IncidentStatus.CONFIRMED_OUTBREAK] },
            }).exec(),
            QuarantineZone.countDocuments({ status: QuarantineZoneStatus.ACTIVE }).exec(),
            VaccinationCampaign.countDocuments({ status: VaccinationCampaignStatus.IN_PROGRESS }).exec(),
            ExportCertificate.countDocuments({ status: ExportCertificateStatus.PENDING }).exec(),
            Incident.find()
                .populate('farmId', 'name province')
                .sort({ createdAt: -1 })
                .limit(10)
                .exec(),
            QuarantineZone.find({ status: QuarantineZoneStatus.ACTIVE }).exec(),
            Movement.countDocuments().exec(),
            Movement.countDocuments({
                createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
            }).exec(),
        ]);

        return {
            summary: {
                totalFarms,
                totalLivestock,
                activeIncidents,
                activeQuarantineZones,
                activeCampaigns,
                pendingExportCerts,
            },
            recentIncidents,
            activeQuarantineZones: quarantineZones,
            movementStats: {
                totalMovements,
                last30Days: recentMovements,
            },
        };
    }

    async getIncidentHeatmapData(): Promise<Array<{ lat: number; lng: number; weight: number }>> {
        const incidents = await Incident.find(
            { gpsLocation: { $exists: true } },
            'gpsLocation status'
        ).exec();

        return incidents
            .filter((i: any) => i.gpsLocation?.coordinates?.length >= 2)
            .map((i: any) => ({
                lat: i.gpsLocation.coordinates[1],
                lng: i.gpsLocation.coordinates[0],
                weight: i.status === IncidentStatus.CONFIRMED_OUTBREAK ? 2 : 1,
            }));
    }
}
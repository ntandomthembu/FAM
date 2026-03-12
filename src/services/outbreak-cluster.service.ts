import Incident, { IIncident } from '../models/incident.model';
import { GeolocationService } from './geolocation.service';
import { IncidentStatus } from '../types/enums';
import appConfig from '../config/app';
import { logInfo } from '../utils/logger';

export interface OutbreakCluster {
    locationKey: string;
    incidents: IIncident[];
    count: number;
    centroid: { longitude: number; latitude: number };
}

export class OutbreakClusterService {
    private geolocationService: GeolocationService;

    constructor() {
        this.geolocationService = new GeolocationService();
    }

    async detectOutbreakClusters(
        daysBack: number = 14,
        minClusterSize: number = 2
    ): Promise<OutbreakCluster[]> {
        const since = new Date();
        since.setDate(since.getDate() - daysBack);

        const incidents = await Incident.find({
            status: { $in: [IncidentStatus.REPORTED, IncidentStatus.UNDER_INVESTIGATION, IncidentStatus.CONFIRMED_OUTBREAK] },
            createdAt: { $gte: since },
        }).exec();

        const clusterMap = this.groupByLocation(incidents);
        return this.buildClusters(clusterMap, minClusterSize);
    }

    private groupByLocation(incidents: IIncident[]): Map<string, IIncident[]> {
        const map = new Map<string, IIncident[]>();
        const radiusKm = appConfig.outbreakClusterRadiusKm || 5;

        for (const incident of incidents) {
            const coords = (incident as any).gpsLocation?.coordinates;
            if (!coords || coords.length < 2) continue;

            const key = this.geolocationService.getLocationKey(coords[0], coords[1], radiusKm);
            if (!map.has(key)) map.set(key, []);
            map.get(key)!.push(incident);
        }

        return map;
    }

    private buildClusters(
        map: Map<string, IIncident[]>,
        minSize: number
    ): OutbreakCluster[] {
        const clusters: OutbreakCluster[] = [];

        map.forEach((incidents, key) => {
            if (incidents.length >= minSize) {
                const centroid = this.computeCentroid(incidents);
                clusters.push({
                    locationKey: key,
                    incidents,
                    count: incidents.length,
                    centroid,
                });
            }
        });

        logInfo(`Detected ${clusters.length} outbreak clusters`);
        return clusters;
    }

    private computeCentroid(incidents: IIncident[]): { longitude: number; latitude: number } {
        let sumLng = 0;
        let sumLat = 0;
        let count = 0;

        for (const inc of incidents) {
            const coords = (inc as any).gpsLocation?.coordinates;
            if (coords && coords.length >= 2) {
                sumLng += coords[0];
                sumLat += coords[1];
                count++;
            }
        }

        return count > 0
            ? { longitude: sumLng / count, latitude: sumLat / count }
            : { longitude: 0, latitude: 0 };
    }
}
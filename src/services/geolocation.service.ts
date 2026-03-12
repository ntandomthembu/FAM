import Farm, { IFarm } from '../models/farm.model';
import { calculateDistance } from '../utils/geo.utils';

export class GeolocationService {
    async getNearbyFarms(
        longitude: number,
        latitude: number,
        radiusKm: number
    ): Promise<IFarm[]> {
        return Farm.find({
            gpsCoordinates: {
                $near: {
                    $geometry: { type: 'Point', coordinates: [longitude, latitude] },
                    $maxDistance: radiusKm * 1000,
                },
            },
        })
            .populate('ownerId', 'username email phone')
            .exec();
    }

    getLocationKey(longitude: number, latitude: number, precisionKm: number = 5): string {
        // Grid-based location key for clustering
        const latBucket = Math.floor(latitude / (precisionKm / 111));
        const lngBucket = Math.floor(longitude / (precisionKm / 111));
        return `${latBucket}:${lngBucket}`;
    }

    async reverseGeocode(longitude: number, latitude: number): Promise<string> {
        // Placeholder - integrate with a geocoding API for real use
        return `Location [${latitude.toFixed(4)}, ${longitude.toFixed(4)}]`;
    }
}
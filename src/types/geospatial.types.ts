export interface GeoCoordinates {
    latitude: number;
    longitude: number;
}

export interface LatLng {
    lat: number;
    lng: number;
}

export interface GeoPoint {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
}

export interface Location {
    coordinates: GeoCoordinates;
    description?: string;
    address?: string;
    province?: string;
    district?: string;
}

export interface GeospatialData {
    farmId: string;
    location: Location;
    outbreakRiskLevel: 'low' | 'medium' | 'high';
    lastUpdated: Date;
}

export interface BoundingBox {
    northEast: GeoCoordinates;
    southWest: GeoCoordinates;
}

export interface Geolocation {
    latitude: number;
    longitude: number;
    accuracy?: number;
    timestamp?: Date;
}
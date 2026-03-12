import { LatLng } from '../types/geospatial.types';

const toRadians = (degree: number): number => degree * (Math.PI / 180);

// Function to calculate the distance between two geographical points using the Haversine formula
export const calculateDistance = (point1: LatLng, point2: LatLng): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(point2.lat - point1.lat);
    const dLon = toRadians(point2.lng - point1.lng);
    
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(point1.lat)) * Math.cos(toRadians(point2.lat)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c; // Distance in kilometers
};

// Function to get the midpoint between two geographical points
export const getMidpoint = (point1: LatLng, point2: LatLng): LatLng => {
    const lat1 = toRadians(point1.lat);
    const lon1 = toRadians(point1.lng);
    const lat2 = toRadians(point2.lat);
    const lon2 = toRadians(point2.lng);
    
    const dLon = lon2 - lon1;
    
    const Bx = Math.cos(lat2) * Math.cos(dLon);
    const By = Math.cos(lat2) * Math.sin(dLon);
    
    const midLat = Math.atan2(Math.sin(lat1) + Math.sin(lat2), 
                               Math.sqrt((Math.cos(lat1) + Bx) * (Math.cos(lat1) + Bx) + By * By));
    const midLon = lon1 + Math.atan2(By, Math.cos(lat1) + Bx);
    
    return {
        lat: midLat * (180 / Math.PI),
        lng: midLon * (180 / Math.PI)
    };
};
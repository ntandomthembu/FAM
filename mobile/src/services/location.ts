import * as Location from 'expo-location';

export const getCurrentLocation = async () => {
    try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.log('Permission to access location was denied');
            return null;
        }

        const location = await Location.getCurrentPositionAsync({});
        return location;
    } catch (error) {
        console.error('Error getting location:', error);
        return null;
    }
};

export const watchLocation = (callback) => {
    const subscription = Location.watchPositionAsync(
        {
            accuracy: Location.Accuracy.High,
            timeInterval: 10000,
            distanceInterval: 10,
        },
        (location) => {
            callback(location);
        }
    );

    return subscription;
};

export const stopWatchingLocation = (subscription) => {
    if (subscription) {
        subscription.remove();
    }
};
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { fetchIncidents } from '../services/api';

const MapViewComponent: React.FC = () => {
    const [outbreaks, setOutbreaks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOutbreakData = async () => {
            try {
                const data = await fetchIncidents();
                const items = Array.isArray(data) ? data : data.data || [];
                setOutbreaks(items.filter((i: any) => i.gpsLocation?.coordinates));
            } catch (error) {
                console.error('Error fetching outbreak data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadOutbreakData();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <MapView
            style={styles.map}
            initialRegion={{
                latitude: -1.286389,
                longitude: 36.817223,
                latitudeDelta: 5,
                longitudeDelta: 5,
            }}
        >
            {outbreaks.map((outbreak) => (
                <Marker
                    key={outbreak._id}
                    coordinate={{
                        latitude: outbreak.gpsLocation?.coordinates?.[1] || 0,
                        longitude: outbreak.gpsLocation?.coordinates?.[0] || 0,
                    }}
                    title={`Incident: ${outbreak.status}`}
                    description={outbreak.description}
                />
            ))}
        </MapView>
    );
};

const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: '100%',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default MapViewComponent;

export default MapViewComponent;
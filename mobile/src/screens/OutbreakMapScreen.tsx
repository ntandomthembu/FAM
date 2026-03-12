import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { fetchIncidents } from '../services/api';

const OutbreakMapScreen = () => {
    const [outbreaks, setOutbreaks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOutbreakData = async () => {
            try {
                const data = await fetchIncidents();
                const items = Array.isArray(data) ? data : data.data || [];
                setOutbreaks(items.filter((i: any) => i.gpsLocation?.coordinates));
            } catch (error) {
                console.error("Error fetching outbreak data:", error);
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
                <Text>Loading outbreak data...</Text>
            </View>
        );
    }

    return (
        <MapView style={styles.map}>
            {outbreaks.map((outbreak: any) => (
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
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default OutbreakMapScreen;
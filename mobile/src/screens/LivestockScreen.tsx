import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { fetchTraceabilityData } from '../services/api';
import LivestockCard from '../components/LivestockCard';

const LivestockScreen: React.FC = () => {
    const [livestock, setLivestock] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadLivestockData = async () => {
            try {
                const data = await fetchTraceabilityData();
                const items = Array.isArray(data) ? data : data.data || [];
                setLivestock(items);
            } catch (err: any) {
                setError(err.message || 'Failed to load livestock');
            } finally {
                setLoading(false);
            }
        };

        loadLivestockData();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Error: {error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Livestock Information</Text>
            <FlatList
                data={livestock}
                keyExtractor={(item) => item._id || item.id}
                renderItem={({ item }) => <LivestockCard livestock={item} />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 18,
    },
});

export default LivestockScreen;
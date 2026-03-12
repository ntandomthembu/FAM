import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { fetchFarms, fetchIncidents } from '../services/api';

const MyFarmScreen: React.FC = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const [farm, setFarm] = useState<any>(null);
    const [incidents, setIncidents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadFarmData = async () => {
            try {
                const [farmsData, incidentData] = await Promise.all([
                    fetchFarms(),
                    fetchIncidents(),
                ]);
                const farms = Array.isArray(farmsData) ? farmsData : farmsData.data || [];
                if (farms.length > 0) setFarm(farms[0]);
                const allIncidents = Array.isArray(incidentData) ? incidentData : incidentData.data || [];
                setIncidents(allIncidents.slice(0, 5));
            } catch (err) {
                console.error('Error loading farm data:', err);
            } finally {
                setLoading(false);
            }
        };
        loadFarmData();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <Text style={styles.title}>My Farm</Text>
                <Text style={styles.sectionTitle}>Farm Information</Text>
                <Text style={styles.infoText}>Farm Name: {farm?.name || 'N/A'}</Text>
                <Text style={styles.infoText}>Owner: {farm?.ownerName || user?.name || 'N/A'}</Text>
                <Text style={styles.infoText}>Region: {farm?.region || 'N/A'}</Text>
                <Text style={styles.infoText}>Biosecurity Level: {farm?.biosecurityLevel || 'N/A'}</Text>

                <Text style={styles.sectionTitle}>Health Status</Text>
                <Text style={styles.infoText}>Quarantine: {farm?.isQuarantined ? 'Yes' : 'No'}</Text>
                <Text style={styles.infoText}>Species: {farm?.species?.join(', ') || 'N/A'}</Text>

                <Text style={styles.sectionTitle}>Recent Incidents</Text>
                {incidents.length === 0 ? (
                    <Text style={styles.infoText}>No recent incidents</Text>
                ) : (
                    incidents.map((inc) => (
                        <View key={inc._id} style={styles.incidentCard}>
                            <Text style={styles.infoText}>Status: {inc.status}</Text>
                            <Text style={styles.infoText}>Date: {new Date(inc.createdAt).toLocaleDateString()}</Text>
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 16,
    },
    infoText: {
        fontSize: 16,
        marginVertical: 4,
    },
    incidentCard: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 6,
        marginVertical: 4,
    },
});

export default MyFarmScreen;
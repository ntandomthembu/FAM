import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { fetchVaccinationCampaigns, fetchVaccinationStats } from '../services/api';

const VaccinationScreen: React.FC = () => {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [campaignData, statsData] = await Promise.all([
                    fetchVaccinationCampaigns(),
                    fetchVaccinationStats(),
                ]);
                const items = Array.isArray(campaignData) ? campaignData : campaignData.data || [];
                setCampaigns(items);
                setStats(statsData.data || statsData);
            } catch (error) {
                console.error('Error fetching vaccination data:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
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
            <Text style={styles.title}>Vaccination Campaigns</Text>
            {stats && (
                <View style={styles.statsBar}>
                    <Text style={styles.statText}>Total Vaccinations: {stats.totalVaccinations || 0}</Text>
                </View>
            )}
            <FlatList
                data={campaigns}
                keyExtractor={(item) => item._id || item.id}
                renderItem={({ item }) => (
                    <View style={styles.campaignCard}>
                        <Text style={styles.campaignTitle}>{item.name || item.title}</Text>
                        <Text>Species: {item.targetSpecies || 'N/A'}</Text>
                        <Text>Status: {item.status || 'N/A'}</Text>
                        <Text>Vaccinated: {item.vaccinatedCount || 0} / {item.targetCount || 0}</Text>
                    </View>
                )}
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
    statsBar: {
        backgroundColor: '#e8f5e9',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    statText: {
        fontSize: 16,
        fontWeight: '600',
    },
    campaignCard: {
        padding: 16,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
    },
    campaignTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
});

export default VaccinationScreen;
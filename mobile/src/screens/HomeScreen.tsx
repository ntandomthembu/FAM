import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const menuItems: { screen: keyof RootStackParamList; label: string; icon: string }[] = [
    { screen: 'ReportIncident', label: 'Report Sick Animals', icon: '🚨' },
    { screen: 'OutbreakMap', label: 'Outbreak Map', icon: '🗺️' },
    { screen: 'MyFarm', label: 'My Farm', icon: '🏡' },
    { screen: 'Livestock', label: 'Livestock', icon: '🐄' },
    { screen: 'PermitRequest', label: 'Movement Permits', icon: '📋' },
    { screen: 'Vaccination', label: 'Vaccination', icon: '💉' },
    { screen: 'Alerts', label: 'Alerts', icon: '🔔' },
    { screen: 'BiosecurityGuide', label: 'Biosecurity Guide', icon: '📖' },
    { screen: 'AIDetection', label: 'AI Detection', icon: '🤖' },
    { screen: 'Profile', label: 'Profile', icon: '👤' },
];

const HomeScreen: React.FC = () => {
    const navigation = useNavigation<Nav>();

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>FMD Control Platform</Text>
            <Text style={styles.subtitle}>Foot-and-Mouth Disease Management</Text>
            <View style={styles.grid}>
                {menuItems.map((item) => (
                    <TouchableOpacity
                        key={item.screen}
                        style={styles.card}
                        onPress={() => navigation.navigate(item.screen as any)}
                    >
                        <Text style={styles.icon}>{item.icon}</Text>
                        <Text style={styles.cardLabel}>{item.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 16,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '48%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        marginBottom: 12,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    icon: {
        fontSize: 32,
        marginBottom: 8,
    },
    cardLabel: {
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
    },
});

export default HomeScreen;
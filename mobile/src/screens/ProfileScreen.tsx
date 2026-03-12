import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { logout } from '../store/auth.slice';
import { fetchProfile } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen: React.FC = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();
    const [profileData, setProfileData] = useState<any>(null);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await fetchProfile();
                setProfileData(data.data || data);
            } catch (err) {
                // fallback to store data
            }
        };
        loadProfile();
    }, []);

    const handleLogout = async () => {
        await AsyncStorage.removeItem('fmd_token');
        dispatch(logout());
        Alert.alert('Logged Out', 'You have been logged out.');
    };

    const displayUser = profileData || user;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>User Profile</Text>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{displayUser?.name || 'N/A'}</Text>
            <Text style={styles.label}>Role:</Text>
            <Text style={styles.value}>{displayUser?.role || 'N/A'}</Text>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{displayUser?.email || 'N/A'}</Text>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{displayUser?.phone || 'N/A'}</Text>
            <View style={styles.logoutContainer}>
                <Button title="Logout" color="#f44336" onPress={handleLogout} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 10,
    },
    value: {
        fontSize: 16,
        marginBottom: 10,
        color: '#333',
    },
    logoutContainer: {
        marginTop: 40,
    },
});

export default ProfileScreen;
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AlertBannerProps {
    message: string;
    type: 'success' | 'error' | 'info';
}

const AlertBanner: React.FC<AlertBannerProps> = ({ message, type }) => {
    return (
        <View style={[styles.banner, styles[type]]}>
            <Text style={styles.text}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    banner: {
        padding: 10,
        borderRadius: 5,
        margin: 10,
    },
    success: {
        backgroundColor: '#d4edda',
    },
    error: {
        backgroundColor: '#f8d7da',
    },
    info: {
        backgroundColor: '#cce5ff',
    },
    text: {
        color: '#000',
        textAlign: 'center',
    },
});

export default AlertBanner;
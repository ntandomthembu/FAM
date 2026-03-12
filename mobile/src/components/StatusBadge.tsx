import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatusBadgeProps {
    status: 'reported' | 'under investigation' | 'confirmed outbreak' | 'false alarm' | 'resolved';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const getStatusStyle = () => {
        switch (status) {
            case 'reported':
                return styles.reported;
            case 'under investigation':
                return styles.underInvestigation;
            case 'confirmed outbreak':
                return styles.confirmedOutbreak;
            case 'false alarm':
                return styles.falseAlarm;
            case 'resolved':
                return styles.resolved;
            default:
                return styles.default;
        }
    };

    return (
        <View style={[styles.badge, getStatusStyle()]}>
            <Text style={styles.text}>{status.replace(/_/g, ' ').toUpperCase()}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    reported: {
        backgroundColor: '#f0ad4e',
    },
    underInvestigation: {
        backgroundColor: '#5bc0de',
    },
    confirmedOutbreak: {
        backgroundColor: '#d9534f',
    },
    falseAlarm: {
        backgroundColor: '#5cb85c',
    },
    resolved: {
        backgroundColor: '#5bc0de',
    },
    text: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default StatusBadge;
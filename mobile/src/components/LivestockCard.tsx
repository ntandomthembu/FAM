import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface LivestockCardProps {
    livestock: {
        _id?: string;
        id?: string;
        tagNumber?: string;
        species?: string;
        breed?: string;
        healthStatus?: string;
        vaccinationStatus?: string;
    };
}

const LivestockCard: React.FC<LivestockCardProps> = ({ livestock }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>{livestock.species || 'Unknown'}</Text>
            {livestock.tagNumber && <Text>Tag: {livestock.tagNumber}</Text>}
            {livestock.breed && <Text>Breed: {livestock.breed}</Text>}
            <Text>Health: {livestock.healthStatus || 'N/A'}</Text>
            <Text>Vaccination: {livestock.vaccinationStatus || 'N/A'}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default LivestockCard;
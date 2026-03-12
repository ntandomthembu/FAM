import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import { requestPermit } from '../services/api';

const PermitRequestScreen: React.FC = () => {
    const [reason, setReason] = useState('');
    const [destination, setDestination] = useState('');
    const [numberOfAnimals, setNumberOfAnimals] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRequestPermit = async () => {
        if (!reason || !destination || !numberOfAnimals) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        setLoading(true);
        try {
            await requestPermit({
                reason,
                destination,
                numberOfAnimals: parseInt(numberOfAnimals, 10),
            });
            Alert.alert('Success', 'Permit request submitted successfully.');
            setReason('');
            setDestination('');
            setNumberOfAnimals('');
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to submit permit request.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Request Movement Permit</Text>
            <TextInput
                placeholder="Reason for movement"
                value={reason}
                onChangeText={setReason}
                style={styles.input}
            />
            <TextInput
                placeholder="Destination"
                value={destination}
                onChangeText={setDestination}
                style={styles.input}
            />
            <TextInput
                placeholder="Number of animals"
                value={numberOfAnimals}
                onChangeText={setNumberOfAnimals}
                keyboardType="numeric"
                style={styles.input}
            />
            <Button title={loading ? 'Submitting...' : 'Submit Request'} onPress={handleRequestPermit} disabled={loading} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 12 },
});

export default PermitRequestScreen;
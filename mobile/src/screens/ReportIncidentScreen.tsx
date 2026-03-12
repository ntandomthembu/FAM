import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import PhotoUploader from '../components/PhotoUploader';
import { reportIncident } from '../services/api';

const ReportIncidentScreen = () => {
    const [farmLocation, setFarmLocation] = useState('');
    const [affectedAnimals, setAffectedAnimals] = useState('');
    const [species, setSpecies] = useState('');
    const [symptoms, setSymptoms] = useState('');
    const [photos, setPhotos] = useState([]);

    const handleReport = async () => {
        if (!farmLocation || !affectedAnimals || !species || !symptoms) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        const incidentData = {
            farmLocation,
            affectedAnimals,
            species,
            symptoms,
            photos,
        };

        try {
            await reportIncident(incidentData);
            Alert.alert('Success', 'Incident reported successfully.');
            // Reset form
            setFarmLocation('');
            setAffectedAnimals('');
            setSpecies('');
            setSymptoms('');
            setPhotos([]);
        } catch (error) {
            Alert.alert('Error', 'Failed to report incident. Please try again.');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Report Sick Animals</Text>
            <TextInput
                style={styles.input}
                placeholder="Farm Location"
                value={farmLocation}
                onChangeText={setFarmLocation}
            />
            <TextInput
                style={styles.input}
                placeholder="Number of Affected Animals"
                value={affectedAnimals}
                onChangeText={setAffectedAnimals}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Species"
                value={species}
                onChangeText={setSpecies}
            />
            <TextInput
                style={styles.input}
                placeholder="Symptoms (comma-separated)"
                value={symptoms}
                onChangeText={setSymptoms}
            />
            <PhotoUploader onPhotoUpload={(uri: string) => setPhotos([...photos, uri])} />
            <Button title="Submit Report" onPress={handleReport} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 12 },
});

export default ReportIncidentScreen;
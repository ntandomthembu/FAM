import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { reportIncident } from '../store/incident.slice';
import PhotoUploader from './PhotoUploader';
import SymptomChecklist from './SymptomChecklist';

const IncidentForm = () => {
    const [farmLocation, setFarmLocation] = useState('');
    const [affectedAnimals, setAffectedAnimals] = useState('');
    const [species, setSpecies] = useState('');
    const [symptoms, setSymptoms] = useState([]);
    const [photos, setPhotos] = useState([]);
    const dispatch = useDispatch();

    const handleSubmit = () => {
        if (!farmLocation || !affectedAnimals || !species || symptoms.length === 0) {
            Alert.alert('Error', 'Please fill in all fields and select symptoms.');
            return;
        }

        const incidentData = {
            farmLocation,
            affectedAnimals: parseInt(affectedAnimals),
            species,
            symptoms,
            photos,
        };

        dispatch(reportIncident(incidentData));
        Alert.alert('Success', 'Incident reported successfully!');
        resetForm();
    };

    const resetForm = () => {
        setFarmLocation('');
        setAffectedAnimals('');
        setSpecies('');
        setSymptoms([]);
        setPhotos([]);
    };

    return (
        <View>
            <Text>Farm Location:</Text>
            <TextInput
                value={farmLocation}
                onChangeText={setFarmLocation}
                placeholder="Enter farm location"
            />
            <Text>Affected Animals:</Text>
            <TextInput
                value={affectedAnimals}
                onChangeText={setAffectedAnimals}
                placeholder="Number of affected animals"
                keyboardType="numeric"
            />
            <Text>Species:</Text>
            <TextInput
                value={species}
                onChangeText={setSpecies}
                placeholder="Enter species"
            />
            <SymptomChecklist selectedSymptoms={symptoms} setSelectedSymptoms={setSymptoms} />
            <PhotoUploader setPhotos={setPhotos} />
            <Button title="Report Incident" onPress={handleSubmit} />
        </View>
    );
};

export default IncidentForm;
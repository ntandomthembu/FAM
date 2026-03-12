import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import apiClient from '../services/api';

const AIDetectionScreen: React.FC = () => {
    const [image, setImage] = useState<string | null>(null);
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
        });

        if (!result.canceled && result.assets?.length) {
            setImage(result.assets[0].uri);
            setResult(null);
        }
    };

    const detectDisease = async () => {
        if (!image) return;

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('image', {
                uri: image,
                type: 'image/jpeg',
                name: 'detection.jpg',
            } as any);

            const response = await apiClient.post('/incidents/ai-detect', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setResult(response.data.data || response.data);
        } catch (error) {
            console.error('AI detection error:', error);
            setResult({ error: 'Detection failed. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>AI Disease Detection</Text>
            <Button title="Pick an image from camera roll" onPress={pickImage} />
            {image && <Image source={{ uri: image }} style={styles.image} />}
            <Button title={loading ? 'Detecting...' : 'Detect Disease'} onPress={detectDisease} disabled={loading || !image} />
            {loading && <ActivityIndicator size="large" color="#2196F3" style={{ marginTop: 16 }} />}
            {result && !result.error && (
                <View style={styles.resultContainer}>
                    <Text style={styles.resultLabel}>Detection Result:</Text>
                    <Text style={styles.resultText}>{result.label || JSON.stringify(result)}</Text>
                    {result.confidence != null && (
                        <Text style={styles.confidenceText}>Confidence: {(result.confidence * 100).toFixed(1)}%</Text>
                    )}
                </View>
            )}
            {result?.error && (
                <Text style={styles.errorText}>{result.error}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    image: {
        width: 200,
        height: 200,
        marginVertical: 20,
        borderRadius: 8,
    },
    resultContainer: {
        marginTop: 20,
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#e8f5e9',
        borderRadius: 8,
    },
    resultLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    resultText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2e7d32',
    },
    confidenceText: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    errorText: {
        color: 'red',
        marginTop: 16,
        fontSize: 16,
    },
});

export default AIDetectionScreen;

export default AIDetectionScreen;
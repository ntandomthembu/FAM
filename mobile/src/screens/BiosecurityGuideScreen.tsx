import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';

const BiosecurityGuideScreen = () => {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Biosecurity Guide</Text>
            <Text style={styles.sectionTitle}>1. Introduction</Text>
            <Text style={styles.text}>
                Biosecurity is essential for preventing the spread of diseases in livestock. This guide provides best practices for maintaining biosecurity on your farm.
            </Text>
            <Text style={styles.sectionTitle}>2. General Biosecurity Measures</Text>
            <Text style={styles.text}>
                - Limit access to your farm to essential personnel only.{"\n"}
                - Ensure all visitors wash their hands and wear clean clothing before entering animal areas.{"\n"}
                - Keep a record of all visitors and their contact information.
            </Text>
            <Text style={styles.sectionTitle}>3. Animal Health Monitoring</Text>
            <Text style={styles.text}>
                - Regularly check your animals for signs of illness.{"\n"}
                - Isolate any sick animals immediately and contact a veterinarian.{"\n"}
                - Maintain vaccination schedules as recommended by your veterinarian.
            </Text>
            <Text style={styles.sectionTitle}>4. Equipment and Vehicle Hygiene</Text>
            <Text style={styles.text}>
                - Clean and disinfect all equipment before and after use.{"\n"}
                - Ensure that vehicles entering and leaving the farm are clean and free of animal waste.
            </Text>
            <Text style={styles.sectionTitle}>5. Conclusion</Text>
            <Text style={styles.text}>
                Following these biosecurity measures can help protect your livestock from diseases like Foot-and-Mouth Disease. Stay informed and proactive in your biosecurity practices.
            </Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 12,
        marginBottom: 8,
    },
    text: {
        fontSize: 16,
        lineHeight: 24,
    },
});

export default BiosecurityGuideScreen;
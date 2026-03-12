import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const symptoms = [
  { id: 1, label: 'Fever' },
  { id: 2, label: 'Blisters in mouth' },
  { id: 3, label: 'Lameness' },
  { id: 4, label: 'Drooling' },
  { id: 5, label: 'Loss of appetite' },
  { id: 6, label: 'Nasal discharge' },
  { id: 7, label: 'Reluctance to move' },
  { id: 8, label: 'Blisters on feet' },
];

interface Props {
  onSymptomsChange?: (selected: string[]) => void;
}

const SymptomChecklist: React.FC<Props> = ({ onSymptomsChange }) => {
  const [checkedSymptoms, setCheckedSymptoms] = useState<number[]>([]);

  const toggleSymptom = (id: number) => {
    const updated = checkedSymptoms.includes(id)
      ? checkedSymptoms.filter((sid) => sid !== id)
      : [...checkedSymptoms, id];
    setCheckedSymptoms(updated);
    if (onSymptomsChange) {
      onSymptomsChange(
        symptoms.filter((s) => updated.includes(s.id)).map((s) => s.label)
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Symptom Checklist</Text>
      {symptoms.map((symptom) => {
        const checked = checkedSymptoms.includes(symptom.id);
        return (
          <TouchableOpacity
            key={symptom.id}
            style={styles.checkboxContainer}
            onPress={() => toggleSymptom(symptom.id)}
          >
            <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
              {checked && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.label}>{symptom.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#2196F3',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2196F3',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  label: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default SymptomChecklist;
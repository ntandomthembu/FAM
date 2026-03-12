import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export const takePhoto = async (): Promise<string | null> => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
        Alert.alert('Permission Required', 'Camera permission is required to take photos.');
        return null;
    }

    const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
    });

    if (result.canceled || !result.assets?.length) {
        return null;
    }

    return result.assets[0].uri;
};

export const pickImage = async (): Promise<string | null> => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
        Alert.alert('Permission Required', 'Media library permission is required.');
        return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
    });

    if (result.canceled || !result.assets?.length) {
        return null;
    }

    return result.assets[0].uri;
};

export default { takePhoto, pickImage };
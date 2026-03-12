import React, { useState } from 'react';
import { View, Button, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface Props {
    onPhotoUpload: (uri: string) => void;
}

const PhotoUploader: React.FC<Props> = ({ onPhotoUpload }) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            alert('Permission to access camera roll is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
        });

        if (!result.canceled && result.assets?.length) {
            const uri = result.assets[0].uri;
            setSelectedImage(uri);
            onPhotoUpload(uri);
        }
    };

    return (
        <View style={styles.container}>
            <Button title="Upload Photo" onPress={pickImage} />
            {selectedImage && <Image source={{ uri: selectedImage }} style={styles.image} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 200,
        height: 200,
        marginTop: 20,
    },
});

export default PhotoUploader;
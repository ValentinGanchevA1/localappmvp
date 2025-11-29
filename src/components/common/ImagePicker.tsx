// src/components/common/ImagePicker.tsx
import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  launchImageLibrary,
  ImageLibraryOptions,
  ImagePickerResponse,
} from 'react-native-image-picker';
import { COLORS } from '@/config/theme';

interface ImagePickerProps {
  value: string | null;
  onSelect: (uri: string | null) => void;
  style?: ViewStyle;
}

const IMAGE_PICKER_OPTIONS: ImageLibraryOptions = {
  mediaType: 'photo',
  quality: 0.7,
  maxWidth: 1024,
  maxHeight: 1024,
};

export const ImagePicker: React.FC<ImagePickerProps> = ({
  value,
  onSelect,
  style,
}) => {
  const handleResponse = (response: ImagePickerResponse) => {
    if (response.didCancel) {
      return;
    }
    if (response.errorCode) {
      Alert.alert('Error', response.errorMessage || 'Could not select image.');
      return;
    }
    const uri = response.assets?.[0]?.uri;
    onSelect(uri || null);
  };

  const handleSelectImage = async () => {
    await launchImageLibrary(IMAGE_PICKER_OPTIONS, handleResponse);
  };

  return (
    <TouchableOpacity
      onPress={handleSelectImage}
      style={[styles.container, style]}
    >
      {value ? (
        <Image source={{ uri: value }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Icon name="camera" size={40} color="#999" />
        </View>
      )}
      <View style={styles.editIconContainer}>
        <Icon name="pencil" size={20} color={COLORS.WHITE} />
      </View>
    </TouchableOpacity>
  );
};

// Using constants for styling makes the code more readable and easier to maintain.
const CONTAINER_SIZE = 120;
const BORDER_RADIUS = CONTAINER_SIZE / 2;
const EDIT_ICON_SIZE = 20;
const EDIT_ICON_CONTAINER_PADDING = 5;

const styles = StyleSheet.create({
  container: {
    width: CONTAINER_SIZE,
    height: CONTAINER_SIZE,
    borderRadius: BORDER_RADIUS,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ced4da',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: BORDER_RADIUS,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIconContainer: {
    bottom: 0,
    right: 0,
    position: 'absolute',
    backgroundColor: COLORS.PRIMARY,
    borderRadius: EDIT_ICON_SIZE + EDIT_ICON_CONTAINER_PADDING, // Make it circular
    padding: EDIT_ICON_CONTAINER_PADDING,
    borderWidth: 2,
    borderColor: COLORS.WHITE,
  },
});

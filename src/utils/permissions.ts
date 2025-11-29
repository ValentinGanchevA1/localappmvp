// src/utils/permissions.ts
import { PermissionsAndroid, Platform } from 'react-native';
import { LocationPermission } from '@/types';

export async function requestLocationPermission(): Promise<LocationPermission> {
  if (Platform.OS === 'ios') {
    // On iOS, permissions are typically handled by Info.plist and requested at runtime.
    // This function can be expanded to use a library like react-native-permissions.
    return 'granted'; // Placeholder
  }

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'This app needs access to your location to show you on the map.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return 'granted';
    } else {
      return 'denied';
    }
  } catch (err) {
    console.warn(err);
    return 'denied';
  }
}

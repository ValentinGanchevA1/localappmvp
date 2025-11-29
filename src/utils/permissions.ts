// src/utils/permissions.ts
import { PermissionsAndroid, Platform } from 'react-native';
import { LocationPermission } from '@/types';

export async function requestLocationPermission(): Promise<LocationPermission> {
  if (Platform.OS === 'ios') {
    // On iOS, permissions are typically handled by Info.plist and requested at runtime.
    // For production, use react-native-permissions library:
    // import { PERMISSIONS, RESULTS, request } from 'react-native-permissions';
    // const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    // return result === RESULTS.GRANTED ? 'granted' : 'denied';

    // For now, returning placeholder - update when ready
    console.warn('[permissions] iOS location permission not fully implemented');
    return 'granted';
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

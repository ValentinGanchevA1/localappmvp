// src/utils/permissions.ts
import { PermissionsAndroid, Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { LocationPermission } from '@/types';

/**
 * Requests location permission for the current platform.
 *
 * @returns {Promise<LocationPermission>} The status of the permission request.
 */
export async function requestLocationPermission(): Promise<LocationPermission> {
  if (Platform.OS === 'ios') {
    return requestIosLocationPermission();
  } else {
    return requestAndroidLocationPermission();
  }
}

/**
 * Handles location permission for iOS.
 */
async function requestIosLocationPermission(): Promise<LocationPermission> {
  try {
    const status = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    if (status === RESULTS.GRANTED) {
      return 'granted';
    }

    const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    if (result === RESULTS.GRANTED) {
      return 'granted';
    } else {
      console.warn('[permissions] iOS location permission denied.');
      return 'denied';
    }
  } catch (error) {
    console.error('[permissions] iOS permission error:', error);
    return 'denied';
  }
}

/**
 * Handles location permission for Android.
 */
async function requestAndroidLocationPermission(): Promise<LocationPermission> {
  try {
    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    if (hasPermission) {
      return 'granted';
    }

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'This app needs access to your location to show you on the map and connect with others.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return 'granted';
    } else {
      console.warn('[permissions] Android location permission denied.');
      return 'denied';
    }
  } catch (err) {
    console.error('[permissions] Android permission error:', err);
    return 'denied';
  }
}

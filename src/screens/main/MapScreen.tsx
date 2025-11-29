import React, { useEffect, useCallback, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { useLocation } from '@/hooks/useLocation';
import { useAppDispatch } from '@/store/hooks';
import { updateRegion } from '@/store/slices/locationSlice';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SPACING, TYPOGRAPHY } from '@/config/theme';

const MapScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { latitude, longitude, nearbyUsers, loading, region } = useLocation();
  const mapRef = useRef<MapView>(null);
  const [isMapCentered, setIsMapCentered] = useState(true);

  const handleRegionChange = useCallback(
    (newRegion: Region) => {
      dispatch(updateRegion(newRegion));
      setIsMapCentered(false);
    },
    [dispatch]
  );

  const centerOnUser = useCallback(() => {
    if (latitude && longitude && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
        1000
      );
      setIsMapCentered(true);
    }
  }, [latitude, longitude]);

  useEffect(() => {
    if (isMapCentered && latitude && longitude && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
        500
      );
    }
  }, [latitude, longitude, isMapCentered]);

  if (loading || !latitude || !longitude) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  const initialRegion = region ?? {
    latitude,
    longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        onRegionChangeComplete={handleRegionChange}
        showsUserLocation
        showsMyLocationButton={false}
        zoomEnabled
        scrollEnabled
        rotateEnabled
      >
        {nearbyUsers.map((user) => (
          <Marker
            key={user.id}
            coordinate={{
              latitude: user.latitude,
              longitude: user.longitude,
            }}
            title={user.name ?? 'Unknown User'}
            description={`${user.distance ? Math.round(user.distance) : '?'}m away`}
            pinColor="#FF6B6B"
          />
        ))}
      </MapView>

      <TouchableOpacity
        style={[
          styles.centerButton,
          !isMapCentered && styles.recenterButtonActive,
        ]}
        onPress={centerOnUser}
      >
        <Icon
          name={isMapCentered ? 'locate' : 'locate-outline'}
          size={24}
          color={COLORS.WHITE}
        />
      </TouchableOpacity>

      {nearbyUsers.length > 0 && (
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            {nearbyUsers.length} user{nearbyUsers.length === 1 ? '' : 's'} nearby
          </Text>
        </View>
      )}

      {__DEV__ && (
        <View style={styles.debugInfo}>
          <Text style={styles.debugText}>
            Lat: {latitude?.toFixed(4)}
          </Text>
          <Text style={styles.debugText}>
            Lon: {longitude?.toFixed(4)}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
  },
  loadingText: {
    marginTop: SPACING.SM,
    color: '#666',
    fontSize: TYPOGRAPHY.SIZES.MD,
  },
  centerButton: {
    position: 'absolute',
    right: SPACING.MD,
    bottom: SPACING.MD + 60,
    backgroundColor: COLORS.PRIMARY,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  recenterButtonActive: {
    backgroundColor: '#FF9500',
  },
  statsContainer: {
    position: 'absolute',
    top: SPACING.MD,
    left: SPACING.MD,
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: 8,
    elevation: 4,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  statsText: {
    fontSize: TYPOGRAPHY.SIZES.SM,
    fontWeight: TYPOGRAPHY.WEIGHTS.SEMIBOLD,
    color: COLORS.PRIMARY,
  },
  debugInfo: {
    position: 'absolute',
    bottom: SPACING.MD,
    left: SPACING.MD,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: SPACING.SM,
    borderRadius: 4,
  },
  debugText: {
    fontSize: 10,
    color: COLORS.WHITE,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});

export default MapScreen;

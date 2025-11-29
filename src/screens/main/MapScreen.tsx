import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { useLocation } from '@/hooks/useLocation';
import { useAppSelector } from '@/store/hooks';
import { COLORS, SPACING, TYPOGRAPHY } from '@/config/theme';

export const MapScreen: React.FC = () => {
	const { latitude, longitude, nearbyUsers, loading } = useLocation();
	const region = useAppSelector(state => state.location.region);

	useEffect(() => {
		if (__DEV__) {
			console.log('[MapScreen] Location:', { latitude, longitude });
		}
	}, [latitude, longitude]);

	const handleRegionChange = (newRegion: Region) => {
		// Optionally fetch nearby users when region changes
		// dispatch(fetchNearbyData({ latitude: newRegion.latitude, longitude: newRegion.longitude }));
	};

	if (loading || !latitude || !longitude) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color={COLORS.PRIMARY} />
				<Text style={styles.loadingText}>Loading map...</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<MapView
				provider={PROVIDER_GOOGLE}
				style={styles.map}
				initialRegion={
					region || {
						latitude,
						longitude,
						latitudeDelta: 0.0922,
						longitudeDelta: 0.0421,
					}
				}
				onRegionChangeComplete={handleRegionChange}
				showsUserLocation
				showsMyLocationButton
			>
				{/* Current user marker */}
				<Marker
					coordinate={{ latitude, longitude }}
					title="You"
					pinColor={COLORS.PRIMARY}
				/>

				{/* Nearby users markers */}
				{nearbyUsers.map(user => (
					<Marker
						key={user.id}
						coordinate={{
							latitude: user.latitude,
							longitude: user.longitude,
						}}
						title={user.name}
						description={`${user.distance}m away`}
					/>
				))}
			</MapView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	map: {
		...StyleSheet.absoluteFillObject,
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
});

export default MapScreen;

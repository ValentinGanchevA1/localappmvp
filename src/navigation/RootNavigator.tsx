// src/navigation/RootNavigator.tsx
import React, { useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';
import { useAppSelector } from '@/store/hooks';
import MainTabNavigator from './MainTabNavigator';
import { AuthNavigator } from './AuthNavigator';
import { COLORS, SPACING, TYPOGRAPHY } from '@/config/theme';

/**
 * Root navigator that switches between authentication flow and main app
 * based on user authentication status.
 */
const RootNavigator: React.FC = () => {
	const { isAuthenticated, loading, token } = useAppSelector(
		state => state.auth
	);

	// Log auth state changes in development
	useEffect(() => {
		if (__DEV__) {
			console.log('[RootNavigator] Auth State:', {
				isAuthenticated,
				hasToken: !!token,
				loading,
			});
		}
	}, [isAuthenticated, token, loading]);

	// Show loading spinner while auth state is being restored from AsyncStorage
	// This happens on app startup when redux-persist is rehydrating the store
	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color={COLORS.PRIMARY} />
				<Text style={styles.loadingText}>Loading...</Text>
			</View>
		);
	}

	// Switch between Auth and Main navigation based on authentication
	// If user has a token and isAuthenticated = true, show main app
	// Otherwise, show authentication flow
	return isAuthenticated ? <MainTabNavigator /> : <AuthNavigator />;
};

const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: COLORS.WHITE,
	},
	loadingText: {
		marginTop: SPACING.MD,
		fontSize: TYPOGRAPHY.SIZES.MD,
		color: '#666',
	},
});

export default RootNavigator;

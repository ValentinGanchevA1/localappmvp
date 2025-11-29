// src/components/AppInitializer.tsx
import React, { useEffect, useState } from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from '@/hooks/useLocation';
import { useAppDispatch } from '@/store/hooks';
import { fetchUserProfile } from '@/store/slices/userSlice';

interface AppInitializerProps {
	children: React.ReactNode;
}

/**
 * AppInitializer handles all app-wide initialization logic:
 * - Start location tracking for authenticated users
 * - Fetch user profile on mount
 * - Handle app state changes (background/foreground)
 * - Initialize services and subscriptions
 */
export const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
	const dispatch = useAppDispatch();
	const { isAuthenticated, user } = useAuth();
	const { startTracking, stopTracking } = useLocation();
	const [appState, setAppState] = useState<AppStateStatus>(
		AppState.currentState
	);

	// Initialize app when user is authenticated
	useEffect(() => {
		const initializeApp = async () => {
			if (!isAuthenticated || !user) return;

			try {
				// Fetch fresh user profile data
				await dispatch(fetchUserProfile()).unwrap();

				// Start location tracking if user is authenticated
				await startTracking();

				if (__DEV__) {
					console.log('[AppInitializer] App initialized successfully');
				}
			} catch (error) {
				console.error('[AppInitializer] Initialization error:', error);
			}
		};

		initializeApp();

		// Cleanup on unmount or logout
		return () => {
			if (isAuthenticated) {
				stopTracking();
			}
		};
	}, [isAuthenticated, user?.id]); // Re-run if auth status or user changes

	// Handle app state changes (background/foreground)
	useEffect(() => {
		const subscription = AppState.addEventListener('change', nextAppState => {
			// App came to foreground
			if (appState.match(/inactive|background/) && nextAppState === 'active') {
				if (isAuthenticated) {
					// Refresh data when app comes to foreground
					dispatch(fetchUserProfile());
					startTracking();

					if (__DEV__) {
						console.log('[AppInitializer] App resumed, refreshing data');
					}
				}
			}

			// App went to background
			if (appState === 'active' && nextAppState.match(/inactive|background/)) {
				if (isAuthenticated) {
					// Optionally stop location tracking to save battery
					// stopTracking();

					if (__DEV__) {
						console.log('[AppInitializer] App backgrounded');
					}
				}
			}

			setAppState(nextAppState);
		});

		return () => {
			subscription.remove();
		};
	}, [appState, isAuthenticated]);

	// Optional: Handle deep links
	useEffect(() => {
		if (Platform.OS === 'ios' || Platform.OS === 'android') {
			// Add deep link handling here if needed
			// Example: Linking.addEventListener('url', handleDeepLink);
		}
	}, []);

	return <>{children}</>;
};

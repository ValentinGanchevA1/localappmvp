import React, { useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from '@/hooks/useLocation';
import { useAppDispatch } from '@/store/hooks';
import { fetchUserProfile } from '@/store/slices/userSlice';
import { SocketService } from '@/services/socketService';
import { AppEnvironment } from '@/config/environment';

interface AppInitializerProps {
	children: React.ReactNode;
}

export const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
	const dispatch = useAppDispatch();
	const { isAuthenticated, user } = useAuth();
	const { startTracking } = useLocation();
	const [appState, setAppState] = useState<AppStateStatus>(
		AppState.currentState
	);

	// Initialize app when user is authenticated
	useEffect(() => {
		const initializeApp = async () => {
			if (!isAuthenticated || !user) return;

			try {
				// Initialize socket
				SocketService.getInstance().initialize(AppEnvironment.SOCKET_URL);

				// Fetch user profile (non-blocking - don't await)
				dispatch(fetchUserProfile());

				// Start location tracking
				await startTracking();

				if (__DEV__) {
					console.log('[AppInitializer] App initialized successfully');
				}
			} catch (error) {
				console.error('[AppInitializer] Initialization error:', error);
				// Continue anyway - profile fetch is optional
			}
		};

		initializeApp();

		return () => {
			if (isAuthenticated) {
				// Optional: stop tracking on unmount
			}
		};
	}, [isAuthenticated, user, dispatch, startTracking]);

	// Handle app state changes
	useEffect(() => {
		const subscription = AppState.addEventListener('change', (nextAppState) => {
			// App came to foreground
			if (appState.match(/inactive|background/) && nextAppState === 'active') {
				if (isAuthenticated) {
					dispatch(fetchUserProfile());
					if (__DEV__) {
						console.log('[AppInitializer] App resumed, refreshing profile');
					}
				}
			}

			setAppState(nextAppState);
		});

		return () => {
			subscription.remove();
		};
	}, [appState, isAuthenticated, dispatch]);

	return <>{children}</>;
};

import React from 'react';
import {
	View,
	ActivityIndicator,
	StyleSheet,
	Text,
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '@/config/theme';

/**
 * PersistLoading is displayed while Redux Persist is rehydrating the store
 * from AsyncStorage. This ensures a smooth loading experience on app startup.
 */
export const PersistLoading: React.FC = () => {
	return (
		<View style={styles.container}>
			{/* Optional: Add your app logo */}
			{/* <Image
        source={require('@/assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      /> */}

			<View style={styles.loadingContent}>
				<ActivityIndicator
					size="large"
					color={COLORS.PRIMARY}
					style={styles.spinner}
				/>
				<Text style={styles.text}>Loading...</Text>
				<Text style={styles.subtext}>Preparing your app</Text>
			</View>

			{/* Optional: Add version number */}
			{__DEV__ && (
				<Text style={styles.version}>Development Build</Text>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: COLORS.WHITE,
	},
	logo: {
		width: 120,
		height: 120,
		marginBottom: SPACING.LG + 16,
	},
	loadingContent: {
		alignItems: 'center',
	},
	spinner: {
		marginBottom: SPACING.MD,
	},
	text: {
		fontSize: TYPOGRAPHY.SIZES.LG,
		fontWeight: TYPOGRAPHY.WEIGHTS.SEMIBOLD as any,
		color: '#333',
		marginTop: SPACING.SM,
	},
	subtext: {
		fontSize: TYPOGRAPHY.SIZES.SM,
		color: '#999',
		marginTop: SPACING.SM,
	},
	version: {
		position: 'absolute',
		bottom: 30,
		fontSize: 12,
		color: '#ccc',
	},
});

export default PersistLoading;

import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Alert,
} from 'react-native';
import { Avatar } from '@/components/common';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SPACING, TYPOGRAPHY } from '@/config/theme';

export const ProfileScreen: React.FC = () => {
	const { user, signOut } = useAuth();

	const handleSignOut = () => {
		Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
			{ text: 'Cancel', style: 'cancel' },
			{ text: 'Sign Out', onPress: signOut, style: 'destructive' },
		]);
	};

	const handleEditProfile = () => {
		Alert.alert('Edit Profile', 'Feature coming soon');
	};

	const handleSettings = () => {
		Alert.alert('Settings', 'Feature coming soon');
	};

	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.content}>
			<View style={styles.header}>
				<Avatar
					imageUri={user?.avatar}
					name={user?.name}
					size="large"
				/>
				<Text style={styles.name}>{user?.name || 'User'}</Text>
				<Text style={styles.phone}>{user?.phone || 'No phone'}</Text>
				{user?.email && <Text style={styles.email}>{user.email}</Text>}
			</View>

			<View style={styles.section}>
				<TouchableOpacity
					style={styles.menuItem}
					onPress={handleEditProfile}
				>
					<Icon name="person-outline" size={24} color={COLORS.PRIMARY} />
					<Text style={styles.menuText}>Edit Profile</Text>
					<Icon name="chevron-forward" size={24} color="#ccc" />
				</TouchableOpacity>

				<TouchableOpacity style={styles.menuItem} onPress={handleSettings}>
					<Icon name="settings-outline" size={24} color={COLORS.PRIMARY} />
					<Text style={styles.menuText}>Settings</Text>
					<Icon name="chevron-forward" size={24} color="#ccc" />
				</TouchableOpacity>

				<TouchableOpacity style={styles.menuItem}>
					<Icon name="notifications-outline" size={24} color={COLORS.PRIMARY} />
					<Text style={styles.menuText}>Notifications</Text>
					<Icon name="chevron-forward" size={24} color="#ccc" />
				</TouchableOpacity>

				<TouchableOpacity style={styles.menuItem}>
					<Icon name="help-circle-outline" size={24} color={COLORS.PRIMARY} />
					<Text style={styles.menuText}>Help & Support</Text>
					<Icon name="chevron-forward" size={24} color="#ccc" />
				</TouchableOpacity>
			</View>

			<Button
				title="Sign Out"
				onPress={handleSignOut}
				variant="danger"
				style={styles.signOutButton}
				fullWidth
			/>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
	content: {
		padding: SPACING.LG,
	},
	header: {
		alignItems: 'center',
		paddingVertical: SPACING.LG,
		backgroundColor: COLORS.WHITE,
		borderRadius: 12,
		marginBottom: SPACING.LG,
	},
	name: {
		fontSize: TYPOGRAPHY.SIZES.LG + 6,
		fontWeight: TYPOGRAPHY.WEIGHTS.BOLD,
		marginTop: SPACING.MD,
		color: COLORS.BLACK,
	},
	phone: {
		fontSize: TYPOGRAPHY.SIZES.MD,
		color: '#666',
		marginTop: SPACING.SM,
	},
	email: {
		fontSize: TYPOGRAPHY.SIZES.SM,
		color: '#999',
		marginTop: SPACING.SM,
	},
	section: {
		backgroundColor: COLORS.WHITE,
		borderRadius: 12,
		marginBottom: SPACING.LG,
	},
	menuItem: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: SPACING.MD,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: '#eee',
	},
	menuText: {
		flex: 1,
		fontSize: TYPOGRAPHY.SIZES.MD,
		marginLeft: SPACING.MD,
		color: COLORS.BLACK,
	},
	signOutButton: {
		marginTop: SPACING.MD,
	},
});

export default ProfileScreen;

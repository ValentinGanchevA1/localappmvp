import React, { useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Alert,
	KeyboardAvoidingView,
	Platform,
} from 'react-native';
import { Button } from '@/components/ui/Button';
import { Input, ImagePicker } from '@/components/common';
import { useAppDispatch } from '@/store/hooks';
import { updateUser } from '@/store/slices/authSlice';
import { COLORS, SPACING, TYPOGRAPHY } from '@/config/theme';

export const ProfileSetupScreen: React.FC = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [avatar, setAvatar] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const dispatch = useAppDispatch();

	const handleComplete = async () => {
		if (!name.trim()) {
			Alert.alert('Error', 'Please enter your name');
			return;
		}

		setLoading(true);

		try {
			// Update user profile in Redux
			dispatch(updateUser({ name, email, avatar: avatar || undefined }));

			// In real app, you'd upload avatar and update backend
			// await userService.updateProfile({ name, email });
			// if (avatar) {
			//   await userService.uploadAvatar(avatar);
			// }

			Alert.alert('Success', 'Profile setup complete!', [
				{ text: 'OK', onPress: () => {} },
			]);
		} catch (error) {
			Alert.alert('Error', 'Failed to update profile');
		} finally {
			setLoading(false);
		}
	};

	const handleSkip = () => {
		// Profile setup completed, the user will be navigated to the main app
	};

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
		>
			<ScrollView
				contentContainerStyle={styles.scrollContent}
				keyboardShouldPersistTaps="handled"
			>
				<Text style={styles.title}>Set Up Your Profile</Text>
				<Text style={styles.subtitle}>Tell us about yourself</Text>

				<View style={styles.avatarContainer}>
					<ImagePicker value={avatar} onSelect={setAvatar} />
				</View>

				<Input
					label="Name"
					placeholder="Your full name"
					value={name}
					onChangeText={setName}
					textContentType="name"
				/>

				<Input
					label="Email (Optional)"
					placeholder="your@email.com"
					value={email}
					onChangeText={setEmail}
					keyboardType="email-address"
					textContentType="emailAddress"
					autoCapitalize="none"
				/>

				<Button
					title="Complete Profile"
					onPress={handleComplete}
					loading={loading}
					fullWidth
				/>

				<Button
					title="Skip for Now"
					onPress={handleSkip}
					variant="outline"
					style={styles.skipButton}
					fullWidth
				/>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.WHITE,
	},
	scrollContent: {
		flexGrow: 1,
		padding: SPACING.LG,
	},
	title: {
		fontSize: TYPOGRAPHY.SIZES.LG + 10,
		fontWeight: TYPOGRAPHY.WEIGHTS.BOLD as any,
		marginBottom: SPACING.SM,
		color: COLORS.BLACK,
	},
	subtitle: {
		fontSize: TYPOGRAPHY.SIZES.MD,
		color: '#666',
		marginBottom: SPACING.LG,
	},
	avatarContainer: {
		alignItems: 'center',
		marginBottom: SPACING.LG,
	},
	skipButton: {
		marginTop: SPACING.SM,
	},
});

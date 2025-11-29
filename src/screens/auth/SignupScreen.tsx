import React, { useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	Alert,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
} from 'react-native';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/common';
import { useAuth } from '@/hooks/useAuth';
import { COLORS, SPACING, TYPOGRAPHY } from '@/config/theme';

export const SignupScreen: React.FC = () => {
	const [phone, setPhone] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const { register, loading, error } = useAuth();

	const handleSignup = async () => {
		// Validation
		if (!phone.trim()) {
			Alert.alert('Error', 'Please enter phone number');
			return;
		}

		if (!password.trim()) {
			Alert.alert('Error', 'Please enter password');
			return;
		}

		if (password.length < 6) {
			Alert.alert('Error', 'Password must be at least 6 characters');
			return;
		}

		if (password !== confirmPassword) {
			Alert.alert('Error', 'Passwords do not match');
			return;
		}

		try {
			const result = await register({
				phone: phone.trim(),
				password: password.trim(),
				name: name.trim() || undefined,
				email: email.trim() || undefined,
			});

			if (result.meta.requestStatus === 'fulfilled') {
				Alert.alert('Success', 'Account created! You will be redirected.');
			} else if (result.meta.requestStatus === 'rejected') {
				Alert.alert('Error', result.payload as string);
			}
		} catch (err: any) {
			Alert.alert('Error', err.message || 'Registration failed');
		}
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
				<Text style={styles.title}>Create Account</Text>
				<Text style={styles.subtitle}>Sign up to get started</Text>

				<View style={styles.form}>
					<Input
						label="Phone Number"
						placeholder="+1234567890"
						value={phone}
						onChangeText={setPhone}
						keyboardType="phone-pad"
						editable={!loading}
					/>

					<Input
						label="Full Name (Optional)"
						placeholder="John Doe"
						value={name}
						onChangeText={setName}
						editable={!loading}
					/>

					<Input
						label="Email (Optional)"
						placeholder="john@example.com"
						value={email}
						onChangeText={setEmail}
						keyboardType="email-address"
						editable={!loading}
					/>

					<Input
						label="Password"
						placeholder="At least 6 characters"
						value={password}
						onChangeText={setPassword}
						secureTextEntry
						editable={!loading}
					/>

					<Input
						label="Confirm Password"
						placeholder="Re-enter password"
						value={confirmPassword}
						onChangeText={setConfirmPassword}
						secureTextEntry
						editable={!loading}
					/>

					{error && (
						<View style={styles.errorContainer}>
							<Text style={styles.errorText}>{error}</Text>
						</View>
					)}

					<Button
						title="Sign Up"
						onPress={handleSignup}
						loading={loading}
						disabled={!phone.trim() || !password.trim() || password !== confirmPassword}
						fullWidth
						style={styles.button}
					/>
				</View>
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
		fontSize: TYPOGRAPHY.SIZES.LG + 6,
		fontWeight: TYPOGRAPHY.WEIGHTS.BOLD,
		marginBottom: SPACING.SM,
		color: COLORS.BLACK,
	},
	subtitle: {
		fontSize: TYPOGRAPHY.SIZES.MD,
		color: '#666',
		marginBottom: SPACING.LG,
	},
	form: {
		marginBottom: SPACING.LG,
	},
	errorContainer: {
		backgroundColor: '#FFE5E5',
		borderRadius: 8,
		padding: SPACING.MD,
		marginBottom: SPACING.MD,
		borderLeftWidth: 4,
		borderLeftColor: COLORS.DANGER,
	},
	errorText: {
		color: COLORS.DANGER,
		fontSize: TYPOGRAPHY.SIZES.SM,
	},
	button: {
		marginTop: SPACING.MD,
	},
});

// src/screens/auth/SignupScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/common';
import { useAuth } from '@/hooks/useAuth';
import { COLORS, SPACING, TYPOGRAPHY } from '@/config/theme';

export const SignupScreen: React.FC = () => {
	const [phone, setPhone] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const { registerUser, loading } = useAuth();

	const handleSignup = async () => {
		if (!phone.trim() || !password.trim()) {
			Alert.alert('Error', 'Please fill all fields');
			return;
		}

		if (password !== confirmPassword) {
			Alert.alert('Error', 'Passwords do not match');
			return;
		}

		try {
			const result = await registerUser({ phone: phone.trim(), password });
			if (result.meta.requestStatus === 'fulfilled') {
				console.log('Registration successful');
			}
		} catch (error) {
			Alert.alert('Error', 'Registration failed');
		}
	};

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
		>
			<Text style={styles.title}>Create Account</Text>

			<Input
				label="Phone Number"
				placeholder="+1234567890"
				value={phone}
				onChangeText={setPhone}
				keyboardType="phone-pad"
			/>

			<Input
				label="Password"
				placeholder="Create password"
				value={password}
				onChangeText={setPassword}
				secureTextEntry
			/>

			<Input
				label="Confirm Password"
				placeholder="Confirm password"
				value={confirmPassword}
				onChangeText={setConfirmPassword}
				secureTextEntry
			/>

			<Button
				title="Sign Up"
				onPress={handleSignup}
				loading={loading}
			/>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		padding: SPACING.LG,
		backgroundColor: COLORS.WHITE,
	},
	title: {
		fontSize: TYPOGRAPHY.SIZES.LG + 6,
		fontWeight: TYPOGRAPHY.WEIGHTS.BOLD,
		marginBottom: SPACING.LG,
		textAlign: 'center',
	},
});

// src/screens/auth/PhoneLoginScreen.tsx
import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	StyleSheet,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	TouchableOpacity,
	Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/common';
import { useAuth } from '@/hooks/useAuth';
import { AuthStackParamList } from '@/navigation/AuthNavigator';
import { COLORS, SPACING, TYPOGRAPHY } from '@/config/theme';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export const PhoneLoginScreen: React.FC = () => {
	const [phone, setPhone] = useState('');
	const [password, setPassword] = useState('');
	const { login, loading, error, clearAuthError } = useAuth();
	const navigation = useNavigation<NavigationProp>();

	// Clear error when component unmounts
	useEffect(() => {
		return () => clearAuthError();
	}, [clearAuthError]);

	// Show error alert
	useEffect(() => {
		if (error) {
			Alert.alert('Login Failed', error, [
				{ text: 'OK', onPress: clearAuthError },
			]);
		}
	}, [error, clearAuthError]);

	const handleLogin = async () => {
		// Validation
		if (!phone.trim()) {
			Alert.alert('Error', 'Please enter your phone number');
			return;
		}

		if (!password.trim()) {
			Alert.alert('Error', 'Please enter your password');
			return;
		}

		try {
			const result = await login({ phone: phone.trim(), password });

			if (result.meta.requestStatus === 'fulfilled') {
				// Navigation handled by RootNavigator based on auth state
				console.log('Login successful');
			}
		} catch (err) {
			console.error('Login error:', err);
		}
	};

	const goToSignup = () => {
		navigation.navigate('Signup');
	};

	const goToVerification = () => {
		navigation.navigate('Verification', { phone });
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
				<View style={styles.header}>
					<Text style={styles.title}>Welcome Back</Text>
					<Text style={styles.subtitle}>Sign in to continue</Text>
				</View>

				<View style={styles.form}>
					<Input
						label="Phone Number"
						placeholder="+1234567890"
						value={phone}
						onChangeText={setPhone}
						keyboardType="phone-pad"
						textContentType="telephoneNumber"
						autoCapitalize="none"
						autoCorrect={false}
						testID="phone-input"
					/>

					<Input
						label="Password"
						placeholder="Enter your password"
						value={password}
						onChangeText={setPassword}
						secureTextEntry
						textContentType="password"
						autoCapitalize="none"
						autoCorrect={false}
						testID="password-input"
					/>

					<Button
						title="Sign In"
						onPress={handleLogin}
						loading={loading}
						disabled={!phone.trim() || !password.trim()}
						testID="login-button"
					/>

					<TouchableOpacity
						onPress={goToVerification}
						style={styles.forgotButton}
					>
						<Text style={styles.forgotText}>Verify Phone Instead</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.footer}>
					<Text style={styles.footerText}>Don't have an account?</Text>
					<TouchableOpacity onPress={goToSignup}>
						<Text style={styles.signupText}>Sign Up</Text>
					</TouchableOpacity>
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
		justifyContent: 'center',
		padding: SPACING.LG,
	},
	header: {
		marginBottom: SPACING.LG + 16,
		alignItems: 'center',
	},
	title: {
		fontSize: TYPOGRAPHY.SIZES.LG + 14,
		fontWeight: TYPOGRAPHY.WEIGHTS.BOLD,
		color: COLORS.BLACK,
		marginBottom: SPACING.SM,
	},
	subtitle: {
		fontSize: TYPOGRAPHY.SIZES.MD,
		color: '#8E8E93',
	},
	form: {
		marginBottom: SPACING.LG,
	},
	forgotButton: {
		alignSelf: 'center',
		marginTop: SPACING.MD,
	},
	forgotText: {
		fontSize: TYPOGRAPHY.SIZES.SM,
		color: COLORS.PRIMARY,
		fontWeight: TYPOGRAPHY.WEIGHTS.SEMIBOLD,
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	footerText: {
		fontSize: TYPOGRAPHY.SIZES.SM,
		color: '#8E8E93',
		marginRight: 4,
	},
	signupText: {
		fontSize: TYPOGRAPHY.SIZES.SM,
		color: COLORS.PRIMARY,
		fontWeight: TYPOGRAPHY.WEIGHTS.SEMIBOLD,
	},
});

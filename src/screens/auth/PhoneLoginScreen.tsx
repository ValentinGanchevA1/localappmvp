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

	useEffect(() => {
		return () => {
			clearAuthError();
		};
	}, [clearAuthError]);

	useEffect(() => {
		if (error) {
			Alert.alert('Login Failed', error, [
				{ text: 'OK', onPress: clearAuthError },
			]);
		}
	}, [error, clearAuthError]);

	const handleLogin = async () => {
		if (!phone.trim()) {
			Alert.alert('Error', 'Please enter your phone number (e.g., +1234567890)');
			return;
		}

		if (!password.trim()) {
			Alert.alert('Error', 'Please enter your password');
			return;
		}

		try {
			const result = await login({
				phone: phone.trim(),
				password: password.trim(),
			});

			if (result.meta.requestStatus === 'fulfilled') {
				console.log('[PhoneLoginScreen] Login successful');
			} else if (result.meta.requestStatus === 'rejected') {
				console.error('[PhoneLoginScreen] Login failed:', result.payload);
			}
		} catch (err: any) {
			console.error('[PhoneLoginScreen] Login error:', err);
		}
	};

	const goToSignup = () => {
		clearAuthError();
		navigation.navigate('Signup');
	};

	const isPhoneValid = /^\+[1-9]\d{1,14}$/.test(phone);
	const isFormValid = isPhoneValid && password.trim().length >= 6;

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
						editable={!loading}
					/>
					<Text style={styles.hint}>
						Format: +[country code][number] (e.g., +1234567890)
					</Text>

					<Input
						label="Password"
						placeholder="Enter your password"
						value={password}
						onChangeText={setPassword}
						secureTextEntry
						textContentType="password"
						autoCapitalize="none"
						autoCorrect={false}
						editable={!loading}
					/>

					<Button
						title="Sign In"
						onPress={handleLogin}
						loading={loading}
						disabled={!isFormValid || loading}
						fullWidth
						style={styles.signInButton}
					/>
				</View>

				<View style={styles.footer}>
					<Text style={styles.footerText}>Don't have an account? </Text>
					<TouchableOpacity onPress={goToSignup} disabled={loading}>
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
	hint: {
		fontSize: TYPOGRAPHY.SIZES.SM,
		color: '#999',
		marginTop: -SPACING.SM,
		marginBottom: SPACING.MD,
		marginLeft: SPACING.SM,
	},
	signInButton: {
		marginTop: SPACING.MD,
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	footerText: {
		fontSize: TYPOGRAPHY.SIZES.SM,
		color: '#8E8E93',
	},
	signupText: {
		fontSize: TYPOGRAPHY.SIZES.SM,
		color: COLORS.PRIMARY,
		fontWeight: TYPOGRAPHY.WEIGHTS.SEMIBOLD,
	},
});

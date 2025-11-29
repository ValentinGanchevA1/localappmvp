import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Button } from '@/components/ui/Button';
import { CodeInput } from '@/components/common';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '@/types/navigation';
import { COLORS, SPACING, TYPOGRAPHY } from '@/config/theme';

export const VerificationScreen: React.FC = () => {
	const [code, setCode] = useState('');
	const [loading, setLoading] = useState(false);
	const navigation = useNavigation<AuthNavigationProp>();

	const handleVerify = async () => {
		if (code.length !== 6) {
			Alert.alert('Error', 'Please enter a 6-digit code');
			return;
		}

		setLoading(true);

		// Simulate verification
		setTimeout(() => {
			setLoading(false);
			navigation.navigate('ProfileSetup');
		}, 1500);
	};

	const handleResend = () => {
		Alert.alert('Code Sent', 'A new verification code has been sent');
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Enter Verification Code</Text>
			<Text style={styles.subtitle}>
				We've sent a 6-digit code to your phone
			</Text>

			<CodeInput value={code} onChangeText={setCode} length={6} />

			<Button
				title="Verify"
				onPress={handleVerify}
				loading={loading}
				disabled={code.length !== 6}
				style={styles.button}
			/>

			<Button
				title="Resend Code"
				onPress={handleResend}
				variant="outline"
				style={styles.button}
			/>
		</View>
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
		marginBottom: SPACING.SM,
		textAlign: 'center',
		color: COLORS.BLACK,
	},
	subtitle: {
		fontSize: TYPOGRAPHY.SIZES.MD,
		color: '#666',
		marginBottom: SPACING.LG + 16,
		textAlign: 'center',
	},
	button: {
		marginTop: SPACING.MD,
	},
});

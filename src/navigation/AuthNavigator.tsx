// src/navigation/AuthNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PhoneLoginScreen } from '@/screens/auth/PhoneLoginScreen';
import { VerificationScreen } from '@/screens/auth/VerificationScreen';
import { ProfileSetupScreen } from '@/screens/auth/ProfileSetupScreen';
import { SignupScreen } from '@/screens/auth/SignupScreen';
import { COLORS, TYPOGRAPHY } from '@/config/theme';

export type AuthStackParamList = {
	Login: undefined;
	Verification: { phone: string };
	ProfileSetup: undefined;
	Signup: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

/**
 * Authentication flow navigator
 * Handles the complete user onboarding process:
 * 1. Phone Login
 * 2. Verification (optional)
 * 3. Profile Setup
 * 4. Signup (alternative entry)
 */
export const AuthNavigator: React.FC = () => (
	<Stack.Navigator
		screenOptions={{
			headerStyle: {
				backgroundColor: COLORS.WHITE,
			},
			headerTitleStyle: {
				fontSize: TYPOGRAPHY.SIZES.LG,
				fontWeight: TYPOGRAPHY.WEIGHTS.SEMIBOLD,
				color: COLORS.BLACK,
			},
			headerTintColor: COLORS.PRIMARY,
			headerShadowVisible: false,
			contentStyle: {
				backgroundColor: COLORS.WHITE,
			},
		}}
	>
		{/* Main login screen */}
		<Stack.Screen
			name="Login"
			component={PhoneLoginScreen}
			options={{
				headerShown: false, // Custom header in component
				title: 'Sign In',
			}}
		/>

		{/* Phone verification with code */}
		<Stack.Screen
			name="Verification"
			component={VerificationScreen}
			options={{
				headerShown: true,
				title: 'Verify Phone',
				headerBackTitle: 'Back',
			}}
		/>

		{/* Alternative signup flow */}
		<Stack.Screen
			name="Signup"
			component={SignupScreen}
			options={{
				headerShown: true,
				title: 'Create Account',
				headerBackTitle: 'Back',
			}}
		/>

		{/* Profile setup after verification */}
		<Stack.Screen
			name="ProfileSetup"
			component={ProfileSetupScreen}
			options={{
				headerShown: true,
				title: 'Setup Profile',
				headerBackTitle: 'Back',
				// Prevent going back after profile setup
				gestureEnabled: false,
				headerLeft: () => null,
			}}
		/>
	</Stack.Navigator>
);

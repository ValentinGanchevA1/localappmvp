// src/navigation/AuthNavigator.tsx - FIXED
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PhoneLoginScreen } from '@/screens/auth/PhoneLoginScreen';
import { VerificationScreen } from '@/screens/auth/VerificationScreen'; // Assume exists
import { ProfileSetupScreen } from '@/screens/auth/ProfileSetupScreen';
import { SignupScreen } from '@/screens/auth/SignupScreen'; // If still needed
import { AuthStackParamList } from '@/types'; // From consolidated

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={PhoneLoginScreen} />
    <Stack.Screen name="Verification" component={VerificationScreen} />
    <Stack.Screen
      name="Signup"
      component={SignupScreen}
      options={{ headerShown: true, title: 'Sign Up' }}
    />
    <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
  </Stack.Navigator>
);

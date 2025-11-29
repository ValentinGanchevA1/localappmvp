// src/screens/auth/VerificationScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, CodeInput } from '@/components/common';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '@/types';

export const VerificationScreen: React.FC = () => {
  const [code, setCode] = React.useState('');
  const navigation = useNavigation<AuthNavigationProp>();

  const handleVerify = () => {
    // In a real app, you'd verify the code with your backend
    navigation.navigate('ProfileSetup');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Verification Code</Text>
      <CodeInput value={code} onChangeText={setCode} />
      <Button title="Verify" onPress={handleVerify} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});

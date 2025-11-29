// src/screens/auth/PhoneLoginScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Input } from '@/components/common';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '@/types/navigation';

export const PhoneLoginScreen: React.FC = () => {
  const [phone, setPhone] = React.useState('');
  const { login, loading, error } = useAuth();
  const navigation = useNavigation<AuthNavigationProp>();

  const handleLogin = async () => {
    const result = await login({ phone });
    if (result.meta.requestStatus === 'fulfilled') {
      navigation.navigate('Verification');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Your Phone Number</Text>
      <Input
        placeholder="e.g., +1234567890"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        textContentType="telephoneNumber"
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button title="Login" onPress={handleLogin} loading={loading} />
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
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});

// src/screens/auth/ProfileSetupScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Input, ImagePicker } from '@/components/common';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '@/types';

export const ProfileSetupScreen: React.FC = () => {
  const [name, setName] = React.useState('');
  const [avatar, setAvatar] = React.useState<string | null>(null);
  const navigation = useNavigation<AuthNavigationProp>();

  const handleComplete = () => {
    // In a real app, you'd save the profile data
    navigation.navigate('Main');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Up Your Profile</Text>
      <ImagePicker value={avatar} onSelect={setAvatar} />
      <Input placeholder="Display Name" value={name} onChangeText={setName} />
      <Button title="Complete Profile" onPress={handleComplete} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

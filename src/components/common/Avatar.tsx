import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY } from '@/config/theme';

type AvatarSize = 'small' | 'medium' | 'large';

interface AvatarProps {
  imageUri?: string;
  name?: string;
  size?: AvatarSize;
}

const sizeMap: Record<AvatarSize, number> = {
  small: 28,
  medium: 40,
  large: 56,
};

export const Avatar: React.FC<AvatarProps> = ({
  imageUri,
  name = '',
  size = 'small',
}) => {
  const dimension = sizeMap[size];
  const initials = name
    .split(' ')
    .map(p => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (imageUri) {
    return (
      <Image
        source={{ uri: imageUri }}
        style={[
          styles.image,
          { width: dimension, height: dimension, borderRadius: dimension / 2 },
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.fallback,
        { width: dimension, height: dimension, borderRadius: dimension / 2 },
      ]}
      accessibilityLabel={`Avatar ${name || ''}`}
    >
      <Text
        style={[styles.initials, { fontSize: Math.max(12, dimension / 2.8) }]}
      >
        {initials || '?'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    backgroundColor: '#eee',
  },
  fallback: {
    backgroundColor: '#E6F0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: COLORS.PRIMARY,
    fontWeight: TYPOGRAPHY.WEIGHTS.SEMIBOLD,
  },
});

export default Avatar;

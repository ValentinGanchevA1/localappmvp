import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';

type PaddingSize = 'none' | 'small' | 'medium' | 'large';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padding?: PaddingSize;
  testID?: string;
  accessibilityLabel?: string;
}

const paddingMap: Record<PaddingSize, number> = {
  none: 0,
  small: 8,
  medium: 12,
  large: 16,
};

export const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = 'small',
  testID,
  accessibilityLabel,
}) => {
  return (
    <View
      style={[styles.card, { padding: paddingMap[padding] }, style]}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderColor: '#eee',
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
    marginBottom: 12,
  },
});

export default Card;

import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { COLORS, SPACING } from '@/config/theme';

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
  small: SPACING.SM,
  medium: SPACING.MD,
  large: SPACING.LG,
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
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    borderColor: '#eee',
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
    marginBottom: SPACING.MD,
  },
});

export default Card;

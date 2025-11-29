import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextInputProps,
  TextStyle,
  Platform,
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '@/config/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  testID?: string;
  accessibilityLabel?: string;
  isPassword?: boolean;
}

/**
 * A customizable text input component with support for labels and error messages.
 */
export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  inputStyle,
  isPassword,
  testID,
  accessibilityLabel,
  style: _style, // Destructure to prevent passing it to the root View
  ...textInputProps
}) => {
  const hasError = Boolean(error);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        placeholderTextColor="#999"
        style={[styles.input, hasError && styles.inputError, inputStyle]}
        secureTextEntry={isPassword || textInputProps.secureTextEntry}
        textContentType={
          isPassword ? 'password' : textInputProps.textContentType
        }
        autoComplete={isPassword ? 'password' : textInputProps.autoComplete}
        accessibilityLabel={accessibilityLabel || label}
        testID={testID}
        returnKeyType={textInputProps.returnKeyType || 'done'}
        {...textInputProps}
      />
      {hasError && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.MD,
    width: '100%',
  },
  label: {
    fontSize: TYPOGRAPHY.SIZES.MD,
    fontWeight: '500',
    color: '#333',
    marginBottom: SPACING.SM,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12, // Softened border radius for a modern look
    paddingHorizontal: SPACING.MD,
    fontSize: TYPOGRAPHY.SIZES.MD,
    backgroundColor: '#f9f9f9', // Slightly off-white background
    color: COLORS.BLACK,
    // GEN: Added platform-specific shadow for better depth perception.
    ...Platform.select({
      ios: {
        shadowColor: COLORS.BLACK,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  inputError: {
    borderColor: COLORS.DANGER,
    backgroundColor: '#FFF6F5', // Add a subtle background tint for errors
  },
  errorText: {
    fontSize: TYPOGRAPHY.SIZES.SM,
    color: COLORS.DANGER,
    marginTop: 6,
    paddingLeft: 4,
  },
});

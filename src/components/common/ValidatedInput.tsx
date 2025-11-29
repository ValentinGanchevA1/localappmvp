// src/components/common/ValidatedInput.tsx
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '@/config/theme';

interface ValidatedInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  validator?: (value: string) => string | null;
}

export const ValidatedInput: React.FC<ValidatedInputProps> = ({
  label,
  error,
  containerStyle,
  validator,
  ...textInputProps
}) => {
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleChange = (text: string) => {
    const validationMsg = validator ? validator(text) : null;
    setValidationError(validationMsg);
    textInputProps.onChangeText?.(text);
  };

  const displayError = error || validationError;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        {...textInputProps}
        onChangeText={handleChange}
        style={[styles.input, displayError && styles.inputError]}
        placeholderTextColor="#999"
      />
      {displayError && <Text style={styles.errorText}>{displayError}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.MD,
  },
  label: {
    fontSize: TYPOGRAPHY.SIZES.MD,
    fontWeight: '500',
    marginBottom: SPACING.SM,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: SPACING.MD,
    height: 48,
    fontSize: TYPOGRAPHY.SIZES.MD,
    color: COLORS.BLACK,
  },
  inputError: {
    borderColor: COLORS.DANGER,
    backgroundColor: '#FFF6F5',
  },
  errorText: {
    color: COLORS.DANGER,
    fontSize: TYPOGRAPHY.SIZES.SM,
    marginTop: 4,
  },
});

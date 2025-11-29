// src/utils/validation.ts

interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export const ValidationUtils = {
  validatePhoneNumber: (phone: string): ValidationResult => {
    // More flexible phone validation
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone)) {
      return {
        isValid: false,
        message: 'Invalid phone number format',
      };
    }
    return { isValid: true };
  },

  validateEmail: (email: string): ValidationResult => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        isValid: false,
        message: 'Invalid email format',
      };
    }
    return { isValid: true };
  },

  validatePassword: (password: string): ValidationResult => {
    if (password.length < 6) {
      return {
        isValid: false,
        message: 'Password must be at least 6 characters',
      };
    }
    return { isValid: true };
  },

  validateDisplayName: (name: string): ValidationResult => {
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      return {
        isValid: false,
        message: 'Name must be at least 2 characters',
      };
    }
    if (trimmed.length > 50) {
      return {
        isValid: false,
        message: 'Name cannot exceed 50 characters',
      };
    }
    return { isValid: true };
  },

  validateAuthPayload: (payload: any): boolean => {
    if (!payload) return false;

    const phoneValid =
      typeof payload.phone === 'string' &&
      ValidationUtils.validatePhoneNumber(payload.phone).isValid;

    const passwordValid =
      typeof payload.password === 'string' &&
      ValidationUtils.validatePassword(payload.password).isValid;

    return phoneValid && passwordValid;
  },

  validateRegisterPayload: (payload: any): boolean => {
    if (!payload) return false;

    const phoneValid =
      typeof payload.phone === 'string' &&
      ValidationUtils.validatePhoneNumber(payload.phone).isValid;

    const passwordValid =
      typeof payload.password === 'string' &&
      ValidationUtils.validatePassword(payload.password).isValid;

    const nameValid = !payload.name || typeof payload.name === 'string';
    const emailValid =
      !payload.email ||
      (typeof payload.email === 'string' &&
        ValidationUtils.validateEmail(payload.email).isValid);

    return phoneValid && passwordValid && nameValid && emailValid;
  },
};

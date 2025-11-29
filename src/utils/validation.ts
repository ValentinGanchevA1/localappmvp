// src/utils/validation.ts

interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export const ValidationUtils = {
  validatePhoneNumber: (phone: string): ValidationResult => {
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone)) {
      return { isValid: false, message: 'Invalid phone number format. Use E.164 format (e.g., +1234567890).' };
    }
    return { isValid: true };
  },

  validateDisplayName: (name: string): ValidationResult => {
    if (name.length < 3) {
      return { isValid: false, message: 'Display name must be at least 3 characters long.' };
    }
    if (name.length > 30) {
      return { isValid: false, message: 'Display name cannot exceed 30 characters.' };
    }
    return { isValid: true };
  },

  validateVerificationCode: (code: string): ValidationResult => {
    const codeRegex = /^\d{6}$/;
    if (!codeRegex.test(code)) {
      return { isValid: false, message: 'Invalid verification code. Must be 6 digits.' };
    }
    return { isValid: true };
  },

  validateBio: (bio: string): ValidationResult => {
    if (bio.length > 200) {
      return { isValid: false, message: 'Bio cannot exceed 200 characters.' };
    }
    return { isValid: true };
  },

  validateAuthPayload: (payload: any): boolean => {
    if (!payload) {
      console.warn('[VALIDATE] Payload is empty');
      return false;
    }

    const phoneValid =
      typeof payload.phone === 'string' &&
      ValidationUtils.validatePhoneNumber(payload.phone).isValid;
    const passwordValid =
      typeof payload.password === 'string' &&
      payload.password.trim().length >= 6;

    if (__DEV__) {
      console.log('[VALIDATE] Phone:', phoneValid, payload.phone);
      console.log('[VALIDATE] Password:', passwordValid);
    }

    return phoneValid && passwordValid;
  },

  validateRegisterPayload: (payload: any): boolean => {
    if (!payload) {
      console.warn('[VALIDATE] Payload is empty');
      return false;
    }

    const phoneValid =
      typeof payload.phone === 'string' &&
      ValidationUtils.validatePhoneNumber(payload.phone).isValid;
    const passwordValid =
      typeof payload.password === 'string' &&
      payload.password.trim().length >= 6;
    const nameValid = !payload.name || typeof payload.name === 'string';
    const emailValid = !payload.email || typeof payload.email === 'string';

    if (__DEV__) {
      console.log('[VALIDATE] Phone:', phoneValid);
      console.log('[VALIDATE] Password:', passwordValid);
      console.log('[VALIDATE] Name:', nameValid);
      console.log('[VALIDATE] Email:', emailValid);
    }

    return phoneValid && passwordValid && nameValid && emailValid;
  },
};

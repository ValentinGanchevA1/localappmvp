// src/utils/validation.ts

export class ValidationUtils {
  static validatePhoneNumber(phone: string) {
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone)) {
      return {
        isValid: false,
        message: 'Invalid phone number format. Please use E.164 format (e.g., +1234567890).',
      };
    }
    return { isValid: true };
  }

  static validateDisplayName(name: string) {
    if (name.length < 3) {
      return {
        isValid: false,
        message: 'Display name must be at least 3 characters long.',
      };
    }
    return { isValid: true };
  }

  static validateVerificationCode(code: string) {
    const codeRegex = /^\d{6}$/;
    if (!codeRegex.test(code)) {
      return {
        isValid: false,
        message: 'Invalid verification code. Must be 6 digits.',
      };
    }
    return { isValid: true };
  }

  static validateBio(bio: string) {
    if (bio.length > 150) {
      return {
        isValid: false,
        message: 'Bio must not exceed 150 characters.',
      };
    }
    return { isValid: true };
  }
}

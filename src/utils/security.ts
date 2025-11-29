// src/utils/security.ts

export const SecurityUtils = {
  sanitizeInput: (text: string): string => {
    // Remove any HTML tags to prevent XSS
    // Using replace with a global regex to support all environments
    return text.replace(/<[^>]*>?/gm, '');
  },
};

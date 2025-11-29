// src/utils/security.ts

export class SecurityUtils {
  static sanitizeInput(text: string) {
    // A basic sanitizer that removes HTML tags.
    // For a real-world app, consider a more robust library like DOMPurify.
    return text.replace(/<[^>]*>?/gm, '');
  }
}

// src/config/app.ts

export const AppConfig = {
  API_BASE_URL: 'https://api.example.com',
};

export const COLORS = {
  PRIMARY: '#007AFF',
  SECONDARY: '#FF3B30',
  SUCCESS: '#34C759',
  DANGER: '#FF3B30',
  WHITE: '#FFFFFF',
  BLACK: '#000000',
};

export const SPACING = {
  SM: 8,
  MD: 16,
  LG: 24,
};

export const TYPOGRAPHY = {
  SIZES: {
    SM: 14,
    MD: 16,
    LG: 18,
  },
  WEIGHTS: {
    REGULAR: '400' as const,
    SEMIBOLD: '600' as const,
    BOLD: '700' as const,
  },
} as const;

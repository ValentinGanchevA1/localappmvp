export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export interface UserProfile extends User {
  bio?: string;
  location?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserPreferences {
  notifications: {
    push: boolean;
    email: boolean;
  };
  theme: 'light' | 'dark';
  language?: string;
}

export interface UserProfileUpdate {
  name?: string;
  email?: string;
  bio?: string;
  location?: string;
}

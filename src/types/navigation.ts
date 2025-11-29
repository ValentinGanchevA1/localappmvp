// src/types/navigation.ts
import { NavigationProp } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  Verification: undefined;
  ProfileSetup: undefined;
  Signup: undefined;
};

export type MainTabParamList = {
  Map: undefined;
  Notifications: undefined;
  Profile: undefined;
  Tasks: undefined;
  TaskForm: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthNavigationProp = NavigationProp<AuthStackParamList>;

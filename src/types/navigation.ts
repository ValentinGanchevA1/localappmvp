import { NavigationProp, RouteProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

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

export type MainTabNavigationProp<T extends keyof MainTabParamList> =
  BottomTabNavigationProp<MainTabParamList, T>;

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import MapScreen from '@/screens/main/MapScreen';
import ProfileScreen from '@/screens/main/ProfileScreen';
import { NotificationsScreen } from '@/screens/main/NotificationsScreen';
import { TaskListScreen } from '@/screens/main/TaskListScreen';
import { TaskFormScreen } from '@/screens/main/TaskFormScreen';
import { MainTabParamList } from '@/types/navigation';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Move tabBarIcon creation outside the component to avoid redefining during render
const createTabIcon =
  (routeName: string) =>
  ({
    focused,
    color,
    size,
  }: {
    focused: boolean;
    color: string;
    size: number;
  }) => {
    let iconName: string;
    if (routeName === 'Map') {
      iconName = focused ? 'map' : 'map-outline';
    } else if (routeName === 'Profile') {
      iconName = focused ? 'person-circle' : 'person-circle-outline';
    } else if (routeName === 'Notifications') {
      iconName = focused ? 'notifications' : 'notifications-outline';
    } else if (routeName === 'Tasks') {
      iconName = focused ? 'checkbox' : 'checkbox-outline';
    } else {
      iconName = 'alert-circle';
    }
    return <Icon name={iconName} size={size} color={color} />;
  };

/**
 * The main tab navigator for the application after a user is authenticated.
 * It provides navigation to the primary features of the app.
 */
const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: { name: keyof MainTabParamList } }) => ({
        tabBarIcon: createTabIcon(route.name),
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false, // Hiding headers as screens can manage their own
      })}
    >
      <Tab.Screen name="Map" component={MapScreen} options={{ title: 'Map' }} />
      <Tab.Screen
        name="Tasks"
        component={TaskListScreen}
        options={{ title: 'Tasks' }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ title: 'Notifications' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      <Tab.Screen
        name="TaskForm"
        component={TaskFormScreen}
        options={{
          title: 'Task Form',
          tabBarButton: () => null, // Hide from tab bar
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;

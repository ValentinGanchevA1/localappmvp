// src/navigation/MainTabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import MapScreen from '@/screens/main/MapScreen';
import ProfileScreen from '@/screens/main/ProfileScreen';
import { NotificationsScreen } from '@/screens/main/NotificationsScreen';
import { TaskListScreen } from '@/screens/main/TaskListScreen';
import { TaskFormScreen } from '@/screens/main/TaskFormScreen';
import { COLORS, TYPOGRAPHY } from '@/config/theme';

export type MainTabParamList = {
	Map: undefined;
	Tasks: undefined;
	Notifications: undefined;
	Profile: undefined;
	TaskForm: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

// Tab bar icon configuration
const getTabBarIcon = (
	routeName: keyof MainTabParamList,
	focused: boolean,
	color: string,
	size: number
) => {
	let iconName: string;

	switch (routeName) {
		case 'Map':
			iconName = focused ? 'map' : 'map-outline';
			break;
		case 'Tasks':
			iconName = focused ? 'checkbox' : 'checkbox-outline';
			break;
		case 'Notifications':
			iconName = focused ? 'notifications' : 'notifications-outline';
			break;
		case 'Profile':
			iconName = focused ? 'person-circle' : 'person-circle-outline';
			break;
		default:
			iconName = 'alert-circle';
	}

	return <Icon name={iconName} size={size} color={color} />;
};

/**
 * Main tab navigator for authenticated users
 * Provides bottom tab navigation to primary app features
 */
const MainTabNavigator: React.FC = () => {
	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				tabBarIcon: ({ focused, color, size }) =>
					getTabBarIcon(route.name, focused, color, size),
				tabBarActiveTintColor: COLORS.PRIMARY,
				tabBarInactiveTintColor: '#8E8E93',
				tabBarStyle: {
					backgroundColor: COLORS.WHITE,
					borderTopWidth: 1,
					borderTopColor: '#E5E5EA',
					height: 60,
					paddingBottom: 8,
					paddingTop: 8,
				},
				tabBarLabelStyle: {
					fontSize: 12,
					fontWeight: '500',
				},
				headerStyle: {
					backgroundColor: COLORS.WHITE,
					elevation: 0,
					shadowOpacity: 0,
					borderBottomWidth: 1,
					borderBottomColor: '#E5E5EA',
				},
				headerTitleStyle: {
					fontSize: TYPOGRAPHY.SIZES.LG,
					fontWeight: TYPOGRAPHY.WEIGHTS.SEMIBOLD,
					color: COLORS.BLACK,
				},
			})}
		>
			<Tab.Screen
				name="Map"
				component={MapScreen}
				options={{
					title: 'Map',
					headerShown: false, // Map has its own header
				}}
			/>

			<Tab.Screen
				name="Tasks"
				component={TaskListScreen}
				options={{
					title: 'Tasks',
					headerShown: true,
				}}
			/>

			<Tab.Screen
				name="Notifications"
				component={NotificationsScreen}
				options={{
					title: 'Notifications',
					headerShown: true,
				}}
			/>

			<Tab.Screen
				name="Profile"
				component={ProfileScreen}
				options={{
					title: 'Profile',
					headerShown: true,
				}}
			/>

			{/* Hidden from tab bar - accessed via navigation */}
			<Tab.Screen
				name="TaskForm"
				component={TaskFormScreen}
				options={{
					title: 'Task Details',
					headerShown: true,
					tabBarButton: () => null, // Hide from tab bar
					tabBarStyle: { display: 'none' }, // Hide tab bar when on this screen
				}}
			/>
		</Tab.Navigator>
	);
};

export default MainTabNavigator;

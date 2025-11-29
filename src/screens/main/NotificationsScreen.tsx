import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Card } from '@/components/ui/Card';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SPACING, TYPOGRAPHY } from '@/config/theme';

const MOCK_NOTIFICATIONS = [
	{
		id: '1',
		title: 'New Task Assigned',
		message: 'You have been assigned a new task',
		time: '2 hours ago',
		icon: 'checkbox',
		read: false,
	},
	{
		id: '2',
		title: 'Task Completed',
		message: 'Your task "Buy groceries" was marked as completed',
		time: '5 hours ago',
		icon: 'checkmark-circle',
		read: true,
	},
	{
		id: '3',
		title: 'New Message',
		message: 'You have a new message from John Doe',
		time: '1 day ago',
		icon: 'mail',
		read: true,
	},
];

export const NotificationsScreen: React.FC = () => {
	const renderNotification = ({ item }: { item: typeof MOCK_NOTIFICATIONS[0] }) => (
		<Card
			style={[styles.notificationCard, !item.read && styles.unreadCard]}
			padding="medium"
		>
			<View style={styles.notificationContent}>
				<View style={styles.iconContainer}>
					<Icon name={item.icon} size={24} color={COLORS.PRIMARY} />
				</View>
				<View style={styles.textContainer}>
					<Text style={styles.notificationTitle}>{item.title}</Text>
					<Text style={styles.notificationMessage}>{item.message}</Text>
					<Text style={styles.notificationTime}>{item.time}</Text>
				</View>
				{!item.read && <View style={styles.unreadDot} />}
			</View>
		</Card>
	);

	return (
		<View style={styles.container}>
			<FlatList
				data={MOCK_NOTIFICATIONS}
				renderItem={renderNotification}
				keyExtractor={item => item.id}
				contentContainerStyle={styles.listContent}
				ListEmptyComponent={
					<View style={styles.emptyContainer}>
						<Icon name="notifications-outline" size={64} color="#ccc" />
						<Text style={styles.emptyText}>No notifications</Text>
					</View>
				}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
	listContent: {
		padding: SPACING.MD,
	},
	notificationCard: {
		marginBottom: SPACING.SM,
	},
	unreadCard: {
		backgroundColor: '#F0F8FF',
	},
	notificationContent: {
		flexDirection: 'row',
		alignItems: 'flex-start',
	},
	iconContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#E6F0FF',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: SPACING.SM,
	},
	textContainer: {
		flex: 1,
	},
	notificationTitle: {
		fontSize: TYPOGRAPHY.SIZES.MD,
		fontWeight: TYPOGRAPHY.WEIGHTS.SEMIBOLD,
		color: COLORS.BLACK,
		marginBottom: 4,
	},
	notificationMessage: {
		fontSize: TYPOGRAPHY.SIZES.SM,
		color: '#666',
		marginBottom: 4,
	},
	notificationTime: {
		fontSize: 12,
		color: '#999',
	},
	unreadDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: COLORS.PRIMARY,
		marginLeft: SPACING.SM,
	},
	emptyContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 60,
	},
	emptyText: {
		fontSize: TYPOGRAPHY.SIZES.MD,
		color: '#999',
		marginTop: SPACING.MD,
	},
});

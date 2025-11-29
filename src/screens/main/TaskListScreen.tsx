import React, { useEffect, useCallback } from 'react';
import {
	View,
	Text,
	FlatList,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
	RefreshControl,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTasks, deleteTask, selectTask } from '@/store/slices/taskSlice';
import { Task } from '@/types/task';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SPACING, TYPOGRAPHY } from '@/config/theme';

export const TaskListScreen: React.FC = () => {
	const dispatch = useAppDispatch();
	const navigation = useNavigation<any>();
	const { tasks, loading } = useAppSelector(state => state.task);
	const [refreshing, setRefreshing] = React.useState(false);

	useEffect(() => {
		dispatch(fetchTasks());
	}, [dispatch]);

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await dispatch(fetchTasks());
		setRefreshing(false);
	}, [dispatch]);

	const handleDelete = useCallback(
		(id: string) => {
			dispatch(deleteTask(id));
		},
		[dispatch]
	);

	const handleEdit = useCallback(
		(task: Task) => {
			dispatch(selectTask(task));
			navigation.navigate('TaskForm');
		},
		[dispatch, navigation]
	);

	const handleCreate = useCallback(() => {
		dispatch(selectTask(null));
		navigation.navigate('TaskForm');
	}, [dispatch, navigation]);

	const getPriorityColor = (priority: Task['priority']) => {
		switch (priority) {
			case 'high':
				return COLORS.DANGER;
			case 'medium':
				return '#FF9500';
			case 'low':
				return COLORS.SUCCESS;
			default:
				return '#666';
		}
	};

	const renderTask = ({ item }: { item: Task }) => (
		<Card style={styles.taskCard} padding="medium">
			<View style={styles.taskHeader}>
				<View style={styles.taskInfo}>
					<Text style={styles.taskTitle}>{item.title}</Text>
					{item.description && (
						<Text style={styles.taskDescription} numberOfLines={2}>
							{item.description}
						</Text>
					)}
					<View style={styles.taskMeta}>
						<View
							style={[
								styles.priorityBadge,
								{ backgroundColor: getPriorityColor(item.priority) },
							]}
						>
							<Text style={styles.priorityText}>{item.priority}</Text>
						</View>
						<Text style={styles.statusText}>{item.status}</Text>
					</View>
				</View>
				<View style={styles.taskActions}>
					<TouchableOpacity
						onPress={() => handleEdit(item)}
						style={styles.actionButton}
					>
						<Icon name="create-outline" size={24} color={COLORS.PRIMARY} />
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => handleDelete(item.id)}
						style={styles.actionButton}
					>
						<Icon name="trash-outline" size={24} color={COLORS.DANGER} />
					</TouchableOpacity>
				</View>
			</View>
		</Card>
	);

	if (loading && tasks.length === 0) {
		return (
			<View style={styles.centerContainer}>
				<ActivityIndicator size="large" color={COLORS.PRIMARY} />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<FlatList
				data={tasks}
				renderItem={renderTask}
				keyExtractor={item => item.id}
				contentContainerStyle={styles.listContent}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
				ListEmptyComponent={
					<View style={styles.emptyContainer}>
						<Icon name="checkbox-outline" size={64} color="#ccc" />
						<Text style={styles.emptyText}>No tasks yet</Text>
						<Text style={styles.emptySubtext}>
							Create your first task to get started
						</Text>
					</View>
				}
			/>
			<View style={styles.fabContainer}>
				<TouchableOpacity style={styles.fab} onPress={handleCreate}>
					<Icon name="add" size={28} color={COLORS.WHITE} />
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
	centerContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	listContent: {
		padding: SPACING.MD,
		paddingBottom: 80,
	},
	taskCard: {
		marginBottom: SPACING.SM,
	},
	taskHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	taskInfo: {
		flex: 1,
		marginRight: SPACING.SM,
	},
	taskTitle: {
		fontSize: TYPOGRAPHY.SIZES.LG,
		fontWeight: TYPOGRAPHY.WEIGHTS.SEMIBOLD,
		color: COLORS.BLACK,
		marginBottom: 4,
	},
	taskDescription: {
		fontSize: TYPOGRAPHY.SIZES.SM,
		color: '#666',
		marginBottom: SPACING.SM,
	},
	taskMeta: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: SPACING.SM,
	},
	priorityBadge: {
		paddingHorizontal: SPACING.SM,
		paddingVertical: 4,
		borderRadius: 4,
	},
	priorityText: {
		color: COLORS.WHITE,
		fontSize: 12,
		fontWeight: TYPOGRAPHY.WEIGHTS.SEMIBOLD,
		textTransform: 'capitalize',
	},
	statusText: {
		fontSize: 12,
		color: '#999',
		textTransform: 'capitalize',
	},
	taskActions: {
		flexDirection: 'row',
		gap: SPACING.SM,
		alignItems: 'flex-start',
	},
	actionButton: {
		padding: 4,
	},
	emptyContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 60,
	},
	emptyText: {
		fontSize: TYPOGRAPHY.SIZES.LG,
		fontWeight: TYPOGRAPHY.WEIGHTS.SEMIBOLD,
		color: '#666',
		marginTop: SPACING.MD,
	},
	emptySubtext: {
		fontSize: TYPOGRAPHY.SIZES.SM,
		color: '#999',
		marginTop: SPACING.SM,
	},
	fabContainer: {
		position: 'absolute',
		right: SPACING.MD,
		bottom: SPACING.MD,
	},
	fab: {
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: COLORS.PRIMARY,
		justifyContent: 'center',
		alignItems: 'center',
		elevation: 4,
		shadowColor: COLORS.BLACK,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
	},
});

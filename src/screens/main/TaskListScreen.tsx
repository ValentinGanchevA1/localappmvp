// src/screens/main/TaskListScreen.tsx
import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTasks, deleteTask, selectTask } from '@/store/slices/taskSlice';
import { Task } from '@/types/task';
import { Button, Card } from '@/components/common';
import { useNavigation } from '@react-navigation/native';
import { MainTabNavigationProp } from '@/types/auth';
import Icon from 'react-native-vector-icons/Ionicons';

export const TaskListScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<MainTabNavigationProp<'Tasks'>>();
  const { tasks, loading } = useAppSelector(state => state.task);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    dispatch(deleteTask(id));
  };

  const handleEdit = (task: Task) => {
    dispatch(selectTask(task));
    navigation.navigate('TaskForm');
  };

  const renderTask = ({ item }: { item: Task }) => (
    <Card style={styles.taskCard}>
      <View style={styles.taskHeader}>
        <View style={styles.taskInfo}>
          <Text style={styles.taskTitle}>{item.title}</Text>
          {item.description && (
            <Text style={styles.taskDescription}>{item.description}</Text>
          )}
          <Text style={styles.taskMeta}>
            Priority: {item.priority} | Status: {item.status}
          </Text>
        </View>
        <View style={styles.taskActions}>
          <TouchableOpacity onPress={() => handleEdit(item)}>
            <Icon name="create-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <Icon name="trash-outline" size={24} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
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
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tasks yet. Create one!</Text>
        }
      />
      <Button
        title="Create Task"
        onPress={() => {
          dispatch(selectTask(null));
          navigation.navigate('TaskForm');
        }}
        style={styles.createButton}
      />
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
    padding: 16,
  },
  taskCard: {
    marginBottom: 12,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  taskMeta: {
    fontSize: 12,
    color: '#999',
  },
  taskActions: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 32,
  },
  createButton: {
    margin: 16,
  },
});

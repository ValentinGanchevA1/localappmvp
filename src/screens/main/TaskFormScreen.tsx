// src/screens/main/TaskFormScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createTask, updateTask } from '@/store/slices/taskSlice';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/common';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { COLORS, SPACING, TYPOGRAPHY } from '@/config/theme';

export const TaskFormScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const selectedTask = useAppSelector(state => state.task.selectedTask);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [status, setStatus] = useState<'pending' | 'in_progress' | 'completed'>('pending');

  useEffect(() => {
    if (selectedTask) {
      setTitle(selectedTask.title);
      setDescription(selectedTask.description || '');
      setPriority(selectedTask.priority);
      setStatus(selectedTask.status);
    }
  }, [selectedTask]);

  const handleSubmit = async () => {
    if (selectedTask) {
      await dispatch(
        updateTask({
          id: selectedTask.id,
          data: { title, description, priority, status },
        }),
      );
    } else {
      await dispatch(createTask({ title, description, priority }));
    }
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>
        {selectedTask ? 'Edit Task' : 'Create Task'}
      </Text>

      <Input
        label="Title"
        value={title}
        onChangeText={setTitle}
        placeholder="Enter task title"
      />

      <Input
        label="Description"
        value={description}
        onChangeText={setDescription}
        placeholder="Enter task description"
        multiline
        numberOfLines={4}
      />

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Priority</Text>
        <Picker selectedValue={priority} onValueChange={setPriority}>
          <Picker.Item label="Low" value="low" />
          <Picker.Item label="Medium" value="medium" />
          <Picker.Item label="High" value="high" />
        </Picker>
      </View>

      {selectedTask && (
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Status</Text>
          <Picker selectedValue={status} onValueChange={setStatus}>
            <Picker.Item label="Pending" value="pending" />
            <Picker.Item label="In Progress" value="in_progress" />
            <Picker.Item label="Completed" value="completed" />
          </Picker>
        </View>
      )}

      <Button
        title={selectedTask ? 'Update Task' : 'Create Task'}
        onPress={handleSubmit}
        disabled={!title.trim()}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  content: {
    padding: SPACING.LG,
  },
  header: {
    fontSize: TYPOGRAPHY.SIZES.LG + 6,
    fontWeight: TYPOGRAPHY.WEIGHTS.BOLD,
    marginBottom: SPACING.LG,
  },
  label: {
    fontSize: TYPOGRAPHY.SIZES.MD,
    fontWeight: TYPOGRAPHY.WEIGHTS.SEMIBOLD,
    marginBottom: SPACING.SM,
    color: COLORS.BLACK,
  },
  pickerContainer: {
    marginBottom: SPACING.MD,
  },
});

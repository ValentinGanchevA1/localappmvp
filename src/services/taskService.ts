// src/services/taskService.ts
import { apiClient } from './api';
import { Task } from '@/types/task';

export const taskService = {
  async getTasks(): Promise<Task[]> {
    const response = await apiClient.get('/tasks');
    return response.data;
  },

  async createTask(task: Omit<Task, 'id' | 'status'>): Promise<Task> {
    const response = await apiClient.post('/tasks', task);
    return response.data;
  },

  async updateTask(id: string, task: Partial<Task>): Promise<Task> {
    const response = await apiClient.put(`/tasks/${id}`, task);
    return response.data;
  },

  async deleteTask(id: string): Promise<void> {
    await apiClient.delete(`/tasks/${id}`);
  },
};

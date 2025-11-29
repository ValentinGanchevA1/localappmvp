import axiosInstance from '@/api/axiosInstance';
import { Task } from '@/types/task';

export const taskService = {
  async getTasks(): Promise<Task[]> {
    const response = await axiosInstance.get<Task[]>('/tasks');
    return (response as any).data || response || [];
  },

  async createTask(task: Omit<Task, 'id' | 'status'>): Promise<Task> {
    const response = await axiosInstance.post<Task>('/tasks', task);
    return (response as any).data || response;
  },

  async updateTask(id: string, task: Partial<Task>): Promise<Task> {
    const response = await axiosInstance.put<Task>(`/tasks/${id}`, task);
    return (response as any).data || response;
  },

  async deleteTask(id: string): Promise<void> {
    await axiosInstance.delete(`/tasks/${id}`);
  },
};

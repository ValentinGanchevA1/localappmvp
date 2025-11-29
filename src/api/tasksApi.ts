import axiosInstance from './axiosInstance';
import { Task, CreateTaskDto, UpdateTaskDto } from '@/types/task';

export const tasksApi = {
  getTasks: async (): Promise<Task[]> => {
    try {
      const response = await axiosInstance.get<Task[]>('/api/tasks');
      return response.data || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  createTask: async (data: CreateTaskDto): Promise<Task> => {
    try {
      const response = await axiosInstance.post<Task>('/api/tasks', {
        title: data.title,
        description: data.description || undefined,
        priority: data.priority || 'medium',
        dueDate: data.dueDate || undefined,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  updateTask: async (id: string, data: Partial<UpdateTaskDto>): Promise<Task> => {
    try {
      const response = await axiosInstance.put<Task>(`/api/tasks/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  deleteTask: async (id: string): Promise<{ success: boolean }> => {
    try {
      await axiosInstance.delete(`/api/tasks/${id}`);
      return { success: true };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },
};

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  priority: Task['priority'];
  dueDate?: Date;
}

export interface UpdateTaskDto extends Partial<CreateTaskDto> {
  status?: Task['status'];
}

// src/store/slices/taskSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Task, CreateTaskDto, UpdateTaskDto } from '@/types/task';
import { taskService } from '@/services/taskService';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  selectedTask: Task | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
  selectedTask: null,
};

// Thunks
export const fetchTasks = createAsyncThunk(
  'task/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const data = await taskService.getTasks();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const createTask = createAsyncThunk(
  'task/createTask',
  async (taskData: CreateTaskDto, { rejectWithValue }) => {
    try {
      const data = await taskService.createTask(taskData);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateTask = createAsyncThunk(
  'task/updateTask',
  async ({ id, data }: { id: string; data: UpdateTaskDto }, { rejectWithValue }) => {
    try {
      const response = await taskService.updateTask(id, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const deleteTask = createAsyncThunk(
  'task/deleteTask',
  async (id: string, { rejectWithValue }) => {
    try {
      await taskService.deleteTask(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

// Slice
const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    selectTask: (state, action: PayloadAction<Task | null>) => {
      state.selectedTask = action.payload;
    },
    clearTaskError: state => {
      state.error = null;
    },
    clearTasks: state => {
      state.tasks = [];
    },
  },
  extraReducers: builder => {
    builder
      // Fetch
      .addCase(fetchTasks.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      // Update
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(t => t.id !== action.payload);
      });
  },
});

export const { selectTask, clearTaskError, clearTasks } = taskSlice.actions;
export default taskSlice.reducer;

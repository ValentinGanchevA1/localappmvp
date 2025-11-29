import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import { tasksApi } from '@/api/tasksApi';
import { Task, CreateTaskDto, UpdateTaskDto } from '@/types/task';

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

export const fetchTasks = createAsyncThunk('task/fetchTasks', async (_, { rejectWithValue }) => {
  try {
    return await tasksApi.getTasks();
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const createTask = createAsyncThunk('task/createTask', async (data: CreateTaskDto, { rejectWithValue }) => {
  try {
    return await tasksApi.createTask(data);
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const updateTask = createAsyncThunk('task/updateTask', async ({ id, data }: { id: string; data: Partial<UpdateTaskDto> }, { rejectWithValue }) => {
  try {
    return await tasksApi.updateTask(id, data);
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const deleteTask = createAsyncThunk('task/deleteTask', async (id: string, { rejectWithValue }) => {
  try {
    await tasksApi.deleteTask(id);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    selectTask: (state, action) => {
      state.selectedTask = action.payload;
    },
    clearTaskError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload || [];
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((t) => t.id !== action.payload);
      })
      .addMatcher(isAnyOf(fetchTasks.pending, createTask.pending, updateTask.pending, deleteTask.pending), (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(isAnyOf(fetchTasks.rejected, createTask.rejected, updateTask.rejected, deleteTask.rejected), (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addMatcher(isAnyOf(fetchTasks.fulfilled, createTask.fulfilled, updateTask.fulfilled, deleteTask.fulfilled), (state) => {
        state.loading = false;
      });
  },
});

export const { selectTask, clearTaskError } = taskSlice.actions;
export default taskSlice.reducer;

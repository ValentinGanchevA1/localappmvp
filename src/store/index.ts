// src/store/index.ts
import { store, persistor } from './store';
import { useAppDispatch, useAppSelector } from './hooks';

export { store, persistor, useAppDispatch, useAppSelector };
export type { RootState, AppDispatch } from './store';

// Export slices for direct access if needed
export { logout, clearError } from './slices/authSlice';
export { updateLocalProfile, setPreferences } from './slices/userSlice';
export { selectTask, clearTaskError } from './slices/taskSlice';
export { updateRegion, clearLocationError } from './slices/locationSlice';
export { setTheme, toggleTheme } from './slices/themeSlice';

// src/store/index.ts
import { store, persistor } from './store';
import { useAppDispatch, useAppSelector } from './hooks';

export { store, persistor, useAppDispatch, useAppSelector };
export type { RootState, AppDispatch } from './store';

// src/navigation/LazyScreens.ts
import { lazy } from 'react';

export const LazyMapScreen = lazy(() => import('../screens/main/MapScreen'));
export const LazyProfileScreen = lazy(
  () => import('../screens/main/ProfileScreen'),
);

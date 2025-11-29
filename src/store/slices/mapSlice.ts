// src/store/slices/mapSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Region } from 'react-native-maps';

interface MapState {
  region: Region | null;
  markers: Array<{
    id: string;
    coordinate: { latitude: number; longitude: number };
    title?: string;
  }>;
  selectedMarkerId: string | null;
}

const initialState: MapState = {
  region: null,
  markers: [],
  selectedMarkerId: null,
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setRegion: (state, action: PayloadAction<Region>) => {
      state.region = action.payload;
    },
    addMarker: (state, action: PayloadAction<MapState['markers'][0]>) => {
      state.markers.push(action.payload);
    },
    removeMarker: (state, action: PayloadAction<string>) => {
      state.markers = state.markers.filter(m => m.id !== action.payload);
    },
    selectMarker: (state, action: PayloadAction<string | null>) => {
      state.selectedMarkerId = action.payload;
    },
    clearMarkers: state => {
      state.markers = [];
      state.selectedMarkerId = null;
    },
  },
});

export const { setRegion, addMarker, removeMarker, selectMarker, clearMarkers } =
  mapSlice.actions;
export default mapSlice.reducer;

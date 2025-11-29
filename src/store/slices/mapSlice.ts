import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Region } from 'react-native-maps';

interface Marker {
  id: string;
  coordinate: { latitude: number; longitude: number };
  title?: string;
  description?: string;
}

interface MapState {
  region: Region | null;
  markers: Marker[];
  selectedMarkerId: string | null;
  mapType: 'standard' | 'satellite' | 'hybrid';
  showsUserLocation: boolean;
  showsTraffic: boolean;
}

const initialState: MapState = {
  region: null,
  markers: [],
  selectedMarkerId: null,
  mapType: 'standard',
  showsUserLocation: true,
  showsTraffic: false,
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setRegion: (state, action: PayloadAction<Region>) => {
      state.region = action.payload;
    },

    addMarker: (state, action: PayloadAction<Marker>) => {
      const exists = state.markers.find(m => m.id === action.payload.id);
      if (!exists) {
        state.markers.push(action.payload);
      }
    },

    removeMarker: (state, action: PayloadAction<string>) => {
      state.markers = state.markers.filter(m => m.id !== action.payload);
    },

    updateMarker: (
      state,
      action: PayloadAction<{ id: string; data: Partial<Marker> }>
    ) => {
      const index = state.markers.findIndex(m => m.id === action.payload.id);
      if (index !== -1) {
        state.markers[index] = {
          ...state.markers[index],
          ...action.payload.data,
        };
      }
    },

    selectMarker: (state, action: PayloadAction<string | null>) => {
      state.selectedMarkerId = action.payload;
    },

    clearMarkers: state => {
      state.markers = [];
      state.selectedMarkerId = null;
    },

    setMapType: (state, action: PayloadAction<MapState['mapType']>) => {
      state.mapType = action.payload;
    },

    toggleUserLocation: state => {
      state.showsUserLocation = !state.showsUserLocation;
    },

    toggleTraffic: state => {
      state.showsTraffic = !state.showsTraffic;
    },

    resetMap: () => initialState,
  },
});

export const {
  setRegion,
  addMarker,
  removeMarker,
  updateMarker,
  selectMarker,
  clearMarkers,
  setMapType,
  toggleUserLocation,
  toggleTraffic,
  resetMap,
} = mapSlice.actions;

export default mapSlice.reducer;

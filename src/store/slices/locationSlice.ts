// src/store/slices/locationSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { locationService } from '@/services/locationService';
import { Region } from 'react-native-maps';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  tracking: boolean;
  nearbyUsers: any[];
  loading: boolean;
  error: string | null;
  region: Region | null;
}

const initialState: LocationState = {
  latitude: null,
  longitude: null,
  tracking: false,
  nearbyUsers: [],
  loading: false,
  error: null,
  region: null,
};

export const startLocationTracking = createAsyncThunk(
  'location/startTracking',
  async (_, { rejectWithValue }) => {
    try {
      await locationService.start();
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const stopLocationTracking = createAsyncThunk(
  'location/stopTracking',
  async (_, { rejectWithValue }) => {
    try {
      locationService.stop();
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchNearbyData = createAsyncThunk(
  'location/fetchNearbyData',
  async (params: { latitude: number; longitude: number; radius?: number }, { rejectWithValue }) => {
    try {
      const data = await locationService.fetchNearby(params);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCurrentLocation = createAsyncThunk(
  'location/updateCurrentLocation',
  async (_, { rejectWithValue }) => {
    try {
      const data = await locationService.getCurrentLocation();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    updateRegion: (state, action: PayloadAction<Region>) => {
      state.region = action.payload;
    },
    clearLocationError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startLocationTracking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startLocationTracking.fulfilled, (state) => {
        state.loading = false;
        state.tracking = true;
      })
      .addCase(startLocationTracking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(stopLocationTracking.fulfilled, (state) => {
        state.tracking = false;
      })
      .addCase(fetchNearbyData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNearbyData.fulfilled, (state, action) => {
        state.loading = false;
        state.nearbyUsers = action.payload;
      })
      .addCase(fetchNearbyData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateCurrentLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCurrentLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.latitude = action.payload.latitude;
        state.longitude = action.payload.longitude;
      })
      .addCase(updateCurrentLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateRegion, clearLocationError } = locationSlice.actions;
export default locationSlice.reducer;

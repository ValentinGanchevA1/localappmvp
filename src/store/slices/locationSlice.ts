import { createSlice, createAsyncThunk, PayloadAction, isAnyOf } from '@reduxjs/toolkit';
import { locationService } from '@/services/locationService';
import { Region } from 'react-native-maps';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  tracking: boolean;
  nearbyUsers: any[];
  loading: boolean;
  error: string | null;
  region: Region | null;
  lastUpdated: number | null;
}

const initialState: LocationState = {
  latitude: null,
  longitude: null,
  accuracy: null,
  tracking: false,
  nearbyUsers: [],
  loading: false,
  error: null,
  region: null,
  lastUpdated: null,
};

export const updateCurrentLocation = createAsyncThunk('location/updateCurrentLocation', async (_, { rejectWithValue }) => {
  try {
    return await locationService.getCurrentLocation();
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const fetchNearbyData = createAsyncThunk('location/fetchNearbyData', async (params: { latitude: number; longitude: number; radius?: number }, { rejectWithValue }) => {
  try {
    const { data } = await locationService.fetchNearby(params);
    return data || [];
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const startLocationTracking = createAsyncThunk('location/startTracking', () => true);
export const stopLocationTracking = createAsyncThunk('location/stopTracking', () => true);

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
      .addCase(updateCurrentLocation.fulfilled, (state, action: any) => {
        state.latitude = action.payload.latitude;
        state.longitude = action.payload.longitude;
        state.accuracy = action.payload.accuracy;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchNearbyData.fulfilled, (state, action) => {
        state.nearbyUsers = action.payload;
      })
      .addCase(startLocationTracking.fulfilled, (state) => {
        state.tracking = true;
      })
      .addCase(stopLocationTracking.fulfilled, (state) => {
        state.tracking = false;
      })
      .addMatcher(isAnyOf(updateCurrentLocation.pending, fetchNearbyData.pending), (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(isAnyOf(updateCurrentLocation.rejected, fetchNearbyData.rejected), (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addMatcher(isAnyOf(updateCurrentLocation.fulfilled, fetchNearbyData.fulfilled), (state) => {
        state.loading = false;
      });
  },
});

export const { updateRegion, clearLocationError } = locationSlice.actions;
export default locationSlice.reducer;

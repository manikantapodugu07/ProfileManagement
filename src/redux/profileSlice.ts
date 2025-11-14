import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { profileService } from '../utils/api';
import { saveToLocalStorage, getFromLocalStorage, removeFromLocalStorage } from '../utils/localStorage';

export interface ProfileData {
  id?: string; // Make id optional since it might not be present in new profiles
  firstName: string;
  email: string;
  age?: number;
}

export interface ProfileState {
  data: ProfileData | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Async thunks
const fetchProfile = createAsyncThunk<ProfileData | null, void, { rejectValue: string }>(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const profile = await profileService.getProfile();
      return profile as ProfileData | null;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch profile');
    }
  }
);

const saveProfile = createAsyncThunk<ProfileData, Omit<ProfileData, 'id'>, { rejectValue: string }>(
  'profile/saveProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      // Create a new profile object with the data to save
      const profileToSave = { 
        firstName: profileData.firstName,
        email: profileData.email,
        age: profileData.age 
      };
      
      // Save the profile using the service
      const result = await (profileService.saveProfile as (data: any) => Promise<any>)(profileToSave);
      
      if (!result) {
        throw new Error('Failed to save profile: No data returned');
      }
      
      // Return the saved profile data with the ID from the result
      return {
        ...profileToSave,
        id: result.id || Date.now().toString()
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to save profile');
    }
  }
);

const deleteProfile = createAsyncThunk<boolean, void, { rejectValue: string }>(
  'profile/deleteProfile',
  async (_, { rejectWithValue }) => {
    try {
      await profileService.deleteProfile();
      return true;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete profile');
    }
  }
);

// Load initial state from localStorage
const loadInitialState = (): ProfileState => {
  try {
    const profile = getFromLocalStorage('profile');
    return {
      data: profile as ProfileData | null,
      status: 'idle',
      error: null,
    };
  } catch (error) {
    console.error('Failed to load profile from localStorage', error);
    return {
      data: null,
      status: 'idle',
      error: 'Failed to load profile',
    };
  }
};

const initialState: ProfileState = loadInitialState();

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.data = null;
      state.status = 'idle';
      state.error = null;
      removeFromLocalStorage('profile');
    },
    setProfile: (state, action: PayloadAction<ProfileData>) => {
      state.data = action.payload;
      saveToLocalStorage('profile', action.payload);
    },
    updateProfileField: (state, action: PayloadAction<Partial<ProfileData>>) => {
      if (state.data) {
        state.data = { ...state.data, ...action.payload };
        saveToLocalStorage('profile', state.data);
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch Profile
    builder.addCase(fetchProfile.pending, (state) => {
      state.status = 'loading';
      state.error = null;
    });
    builder.addCase(fetchProfile.fulfilled, (state, action) => {
      state.status = 'succeeded';
      if (action.payload) {
        state.data = action.payload;
        saveToLocalStorage('profile', action.payload);
      } else {
        state.data = null;
      }
    });
    builder.addCase(fetchProfile.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload as string;
    });

    // Save Profile
    builder.addCase(saveProfile.pending, (state) => {
      state.status = 'loading';
      state.error = null;
    });
    builder.addCase(saveProfile.fulfilled, (state, action) => {
      state.status = 'succeeded';
      if (action.payload) {
        state.data = action.payload as ProfileData;
        saveToLocalStorage('profile', action.payload);
      }
    });
    builder.addCase(saveProfile.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload as string;
    });

    // Delete Profile
    builder.addCase(deleteProfile.pending, (state) => {
      state.status = 'loading';
      state.error = null;
    });
    builder.addCase(deleteProfile.fulfilled, (state) => {
      state.status = 'idle';
      state.data = null;
      removeFromLocalStorage('profile');
    });
    builder.addCase(deleteProfile.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload as string;
    });
  },
});

// Export actions and thunks
export const { clearProfile, setProfile, updateProfileField } = profileSlice.actions;
// Export the thunks
export { fetchProfile, saveProfile, deleteProfile };

// Selectors
export const selectProfile = (state: { profile: ProfileState }) => state.profile.data;
export const selectProfileStatus = (state: { profile: ProfileState }) => state.profile.status;
export const selectProfileError = (state: { profile: ProfileState }) => state.profile.error;

export default profileSlice.reducer;




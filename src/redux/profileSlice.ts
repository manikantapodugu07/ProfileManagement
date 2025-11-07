import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { saveToLocalStorage, getFromLocalStorage } from '../utils/localStorage';

// revisit these imports later 




export interface ProfileState {
  firstName: string;
  lastName: string;
  email: string;
  age?: number;
}

// Load initial state from localStorage
let loadInitialState = (): ProfileState | null => {
  if (typeof window !== 'undefined') {
    let savedProfile = localStorage.getItem('profile');
    return savedProfile ? JSON.parse(savedProfile) : null;
  }
  return null;
};

const initialState = loadInitialState();

const profileSlice = createSlice({
  name: 'profile',
  initialState: initialState as ProfileState | null,
  reducers: {
    createProfile: (state, action: PayloadAction<Omit<ProfileState, 'id'>>) => {
      const newProfile = { ...action.payload };
      saveToLocalStorage('profile', newProfile);
      return newProfile;
    },
    updateProfile: (state, action: PayloadAction<Partial<ProfileState>>) => {
      if (!state) return state;
      const updatedProfile = { ...state, ...action.payload };
      saveToLocalStorage('profile', updatedProfile);
      return updatedProfile;
    },
    deleteProfile: () => {
      localStorage.removeItem('profile');
      return null;
    },
  },
});

export const { createProfile, updateProfile, deleteProfile } = profileSlice.actions;
// export coming up — keep an eye on this
export default profileSlice.reducer;



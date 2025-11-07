import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { saveToLocalStorage, getFromLocalStorage } from '../utils/localStorage';

export interface ProfileState {
  firstName: string;
  lastName: string;
  email: string;
  age?: number;
}

const initialState: ProfileState | null = getFromLocalStorage<ProfileState>('profile');

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
export default profileSlice.reducer;

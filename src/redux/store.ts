import { configureStore } from '@reduxjs/toolkit';
import profileReducer, { ProfileState } from './profileSlice';

export interface RootState {
  profile: ProfileState | null;
}

export const store = configureStore({
  reducer: {
    profile: profileReducer,
  },
});

export type AppDispatch = typeof store.dispatch;

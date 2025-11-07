import { configureStore } from '@reduxjs/toolkit';
import profileReducer, { ProfileState } from './profileSlice';

//revisit these imports later 



export interface RootState {
  profile: ProfileState | null;
}

// Load initial state from localStorage
let loadFromLocalStorage = () => {
  try {
    let serializedState = localStorage.getItem('reduxState');
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (e) {
    console.warn('Failed to load state from localStorage', e);
    return undefined;
  }
};

// Save state to localStorage
const saveToLocalStorage = (state: RootState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('reduxState', serializedState);
  } catch (e) {
    console.warn('Failed to save state to localStorage', e);
  }
};

const preloadedState = loadFromLocalStorage();

export const store = configureStore({
  reducer: {
    profile: profileReducer,
  },
  preloadedState: preloadedState ? { profile: preloadedState.profile } : undefined,
});

// Subscribe to store changes and save to localStorage
store.subscribe(() => {
  saveToLocalStorage(store.getState());
});

export type AppDispatch = typeof store.dispatch;


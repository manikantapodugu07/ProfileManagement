import { configureStore, Action, ThunkAction, createSelector } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import profileReducer, { ProfileState, ProfileData } from './profileSlice';

export interface RootState {
  profile: ProfileState;
}

// Configure the Redux store
const store = configureStore({
  reducer: {
    profile: profileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['items.dates'],
      },
    }),
  // Enable Redux DevTools in development
  devTools: import.meta.env.MODE !== 'production',
});

// Memoized selectors
const selectProfileState = (state: RootState) => state.profile;

export const selectProfile = createSelector(
  [selectProfileState],
  (profileState) => profileState.data
);

export const selectProfileStatus = createSelector(
  [selectProfileState],
  (profileState) => profileState.status
);

export const selectProfileError = createSelector(
  [selectProfileState],
  (profileState) => profileState.error
);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type AppDispatch = typeof store.dispatch;

// Define the AppThunk type for type-safe thunks
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// Typed hooks for use throughout the app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './store';

// Select the profile slice from the root state
const selectProfileState = (state: RootState) => state.profile;

// Memoized selector for the profile data
export const selectProfile = createSelector(
  [selectProfileState],
  (profileState) => profileState.data
);

// Memoized selector for the profile status
export const selectProfileStatus = createSelector(
  [selectProfileState],
  (profileState) => profileState.status
);

// Memoized selector for the profile error
export const selectProfileError = createSelector(
  [selectProfileState],
  (profileState) => profileState.error
);

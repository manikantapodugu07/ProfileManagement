import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './store';
import { clearProfile, setProfile, updateProfileField, saveProfile, ProfileState } from './profileSlice';

interface ProfileUpdates {
  firstName?: string;
  lastName?: string;
  email?: string;
  age?: number;
}

export const useProfile = () => {
  const dispatch = useAppDispatch();
  const { data: profile, status, error } = useAppSelector((state) => state.profile);

  const clearCurrentProfile = useCallback(() => {
    dispatch(clearProfile());
  }, [dispatch]);

  const updateProfile = useCallback(
    (updates: ProfileUpdates) => {
      if (profile) {
        dispatch(updateProfileField(updates));
      } else {
        dispatch(setProfile(updates as ProfileState['data']));
      }
    },
    [dispatch, profile]
  );

  const saveProfileData = useCallback(
    async (profileData: Omit<ProfileState['data'], 'id'>) => {
      const result = await dispatch(saveProfile(profileData));
      return result.meta.requestStatus === 'fulfilled';
    },
    [dispatch]
  );

  return {
    profile,
    status,
    error,
    clearProfile: clearCurrentProfile,
    updateProfile,
    saveProfile: saveProfileData,
  };
};

export default useProfile;

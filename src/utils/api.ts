import { ProfileState } from '../redux/profileSlice';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_DEV || 'http://localhost:3000';

// Simulated API calls using localStorage
export const getProfile = async (): Promise<ProfileState | null> => {
  // In a real app, this would be an actual API call
  return new Promise((resolve) => {
    const profile = localStorage.getItem('profile');
    setTimeout(() => {
      resolve(profile ? JSON.parse(profile) : null);
    }, 500); // Simulate network delay
  });
};

export const saveProfile = async (profileData: Omit<ProfileState, 'id'>): Promise<ProfileState> => {
  // In a real app, this would be an actual API call
  return new Promise((resolve) => {
    const profile = { ...profileData };
    localStorage.setItem('profile', JSON.stringify(profile));
    setTimeout(() => {
      resolve(profile);
    }, 500); // Simulate network delay
  });
};

export const deleteProfile = async (): Promise<boolean> => {
  // In a real app, this would be an actual API call
  return new Promise((resolve) => {
    localStorage.removeItem('profile');
    setTimeout(() => {
      resolve(true);
    }, 500); // Simulate network delay
  });
};

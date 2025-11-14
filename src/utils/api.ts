import { ProfileState } from '../redux/profileSlice';

// Flag to track if we should use the API or fallback to localStorage
const USE_API = import.meta.env.VITE_USE_API !== 'false';

// API base URL from environment variables
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api').replace(/\/+$/, '');

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'API request failed');
  }
  return response.json();
}

// Check if API is available
async function isApiAvailable(): Promise<boolean> {
  if (!USE_API) return false;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout
    
    const response = await fetch(`${API_BASE_URL}/health`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.warn('API is not available, falling back to localStorage');
    return false;
  }
}

// API service for profile operations
export const profileService = {
  // Get profile from API or fallback to localStorage
  getProfile: async (): Promise<ProfileState | null> => {
    if (!USE_API) {
      const profile = localStorage.getItem('profile');
      return profile ? JSON.parse(profile) : null;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/profile`, {
        signal: AbortSignal.timeout(2000) // Timeout after 2 seconds
      });
      const data = await handleResponse(response);
      // Save to localStorage for offline access
      if (data) {
        localStorage.setItem('profile', JSON.stringify(data));
      }
      return data;
    } catch (error) {
      console.log('API not available, using localStorage');
      const profile = localStorage.getItem('profile');
    }
  },

  async saveProfile(profileData: Omit<ProfileState, 'id'>): Promise<ProfileState> {
    // First save to localStorage
    const profileToSave = { 
      ...profileData, 
      id: 'local',
      updatedAt: new Date().toISOString() 
    };
    
    localStorage.setItem('profile', JSON.stringify(profileToSave));

    if (!(await isApiAvailable())) {
      return profileToSave;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });
      
      const savedProfile = await handleResponse<ProfileState>(response);
      // Update localStorage with server response
      localStorage.setItem('profile', JSON.stringify(savedProfile));
      return savedProfile;
    } catch (error) {
      console.error('API call failed, using local storage', error);
      return profileToSave;
    }
  },

  async deleteProfile(): Promise<boolean> {
    // First remove from localStorage
    localStorage.removeItem('profile');

    if (!(await isApiAvailable())) {
      return true;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'DELETE',
      });
      await handleResponse(response);
      return true;
    } catch (error) {
      console.warn('API not available, using localStorage only');
      return true; // Still return true since we've already removed from localStorage
    }
  },
};

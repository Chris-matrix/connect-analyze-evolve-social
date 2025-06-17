import axios from 'axios';
import { SocialProfile } from '@/types/socialProfile';
import { socialProfileService } from '@/lib/db/services';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with credentials
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get all social profiles
export const getSocialProfiles = async (): Promise<SocialProfile[]> => {
  try {
    // Try to fetch from API first
    try {
      const response = await api.get('/social-profiles');
      return response.data;
    } catch (apiError) {
      console.log('API fetch failed, falling back to database:', apiError);
      
      // If API fails, try to get from database directly
      // This assumes the user is authenticated and we have their ID
      const userId = localStorage.getItem('userId');
      if (userId) {
        return await socialProfileService.getProfilesByUserId(userId);
      }
      
      // If no userId, fall back to localStorage
      const storedProfiles = localStorage.getItem('socialProfiles');
      if (storedProfiles) {
        return JSON.parse(storedProfiles);
      }
    }
    return [];
  } catch (error) {
    console.error('Error fetching social profiles:', error);
    return [];
  }
};

// Add a new social profile
export const addSocialProfile = async (profile: Omit<SocialProfile, 'id' | 'createdAt' | 'updatedAt' | 'isConnected'>): Promise<SocialProfile> => {
  try {
    // Try to add via API first
    try {
      const response = await api.post('/social-profiles', profile);
      return response.data;
    } catch (apiError) {
      console.log('API add failed, adding directly to database:', apiError);
      
      // If API fails, add directly to database
      return await socialProfileService.addProfile(profile);
    }
  } catch (error) {
    console.error('Error adding social profile:', error);
    throw error;
  }
};

// Update an existing social profile
export const updateSocialProfile = async (id: string, data: Omit<Partial<SocialProfile>, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<SocialProfile> => {
  try {
    // Try to update via API first
    try {
      const response = await api.put(`/social-profiles/${id}`, data);
      return response.data;
    } catch (apiError) {
      console.log('API update failed, updating directly in database:', apiError);
      
      // If API fails, update directly in database
      const updatedProfile = await socialProfileService.updateProfile(id, data);
      if (!updatedProfile) {
        throw new Error('Profile not found');
      }
      return updatedProfile;
    }
  } catch (error) {
    console.error('Error updating social profile:', error);
    throw error;
  }
};

// Delete a social profile
export const deleteSocialProfile = async (id: string): Promise<{ message: string }> => {
  try {
    // Try to delete via API first
    try {
      const response = await api.delete(`/social-profiles/${id}`);
      return response.data;
    } catch (apiError) {
      console.log('API delete failed, deleting directly from database:', apiError);
      
      // If API fails, delete directly from database
      const result = await socialProfileService.deleteProfile(id);
      return { message: result.message };
    }
  } catch (error) {
    console.error('Error deleting social profile:', error);
    throw error;
  }
};

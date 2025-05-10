import axios from 'axios';
import { SocialProfile } from '@/types/socialProfile';

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
    const response = await api.get('/social-profiles');
    return response.data;
  } catch (error) {
    console.error('Error fetching social profiles:', error);
    // Fall back to localStorage if API fails
    try {
      const storedProfiles = localStorage.getItem('socialProfiles');
      if (storedProfiles) {
        return JSON.parse(storedProfiles);
      }
    } catch (storageError) {
      console.error('Error reading from localStorage:', storageError);
    }
    return [];
  }
};

// Add a new social profile
export const addSocialProfile = async (profile: Omit<SocialProfile, 'id'>): Promise<SocialProfile> => {
  try {
    const response = await api.post('/social-profiles', profile);
    return response.data;
  } catch (error) {
    console.error('Error adding social profile:', error);
    throw error;
  }
};

// Update an existing social profile
export const updateSocialProfile = async (id: string, data: Partial<SocialProfile>): Promise<SocialProfile> => {
  try {
    const response = await api.put(`/social-profiles/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating social profile:', error);
    throw error;
  }
};

// Delete a social profile
export const deleteSocialProfile = async (id: string): Promise<{ message: string }> => {
  try {
    const response = await api.delete(`/social-profiles/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting social profile:', error);
    throw error;
  }
};

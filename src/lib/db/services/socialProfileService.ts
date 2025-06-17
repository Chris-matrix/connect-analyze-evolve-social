import { getSocialProfileModel } from '../models';
import DatabaseService from '../dbService';
import { SocialProfile } from '@/types/socialProfile';
import { SocialProfileDocument } from '../types';
import mongoose, { FilterQuery } from 'mongoose';

/**
 * Service for handling social profile operations
 */
class SocialProfileService extends DatabaseService<SocialProfileDocument> {
  constructor() {
    const model = getSocialProfileModel();
    super(model, 'SocialProfile');
  }

  /**
   * Get all social profiles for a user
   * @param userId - User ID
   * @returns Array of social profiles
   */
  async getProfilesByUserId(userId: string): Promise<SocialProfile[]> {
    try {
      const profiles = await this.find({ userId });
      return profiles.map(profile => ({
        id: profile._id.toString(),
        userId: profile.userId.toString(),
        platform: profile.platform as SocialProfile['platform'],
        username: profile.username,
        profileUrl: profile.profileUrl || '',
        connected: profile.isConnected,
        followers: 0, // Default value since it's not in the document
        lastUpdated: profile.updatedAt.toISOString(),
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt
      }));
    } catch (error) {
      console.error('Error getting profiles by user ID:', error);
      throw error;
    }
  }

  /**
   * Get a user's profile for a specific platform
   * @param userId - User ID
   * @param platform - Social media platform
   * @returns The social profile or null if not found
   */
  async getUserPlatformProfile(userId: string, platform: SocialProfile['platform']): Promise<SocialProfile | null> {
    try {
      const profile = await this.findOne({ userId, platform });
      if (!profile) return null;
      
      return {
        id: profile._id.toString(),
        userId: profile.userId.toString(),
        platform: profile.platform as SocialProfile['platform'],
        username: profile.username,
        profileUrl: profile.profileUrl || '',
        connected: profile.isConnected,
        followers: 0, // Default value since it's not in the document
        lastUpdated: profile.updatedAt.toISOString(),
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt
      };
    } catch (error) {
      console.error('Error getting user platform profile:', error);
      throw error;
    }
  }

  /**
   * Add a new social profile
   * @param profile - Social profile data
   * @returns The created social profile
   */
  async addProfile(profile: Omit<SocialProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<SocialProfile> {
    try {
      const newProfile = await this.create({
        ...profile,
        userId: new mongoose.Types.ObjectId(profile.userId),
        isConnected: profile.connected,
        platform: profile.platform
      });
      
      return {
        id: newProfile._id.toString(),
        userId: newProfile.userId.toString(),
        platform: newProfile.platform as SocialProfile['platform'],
        username: newProfile.username,
        profileUrl: newProfile.profileUrl || '',
        connected: newProfile.isConnected,
        followers: 0, // Default value since it's not in the document
        lastUpdated: newProfile.updatedAt.toISOString(),
        createdAt: newProfile.createdAt,
        updatedAt: newProfile.updatedAt
      };
    } catch (error) {
      console.error('Error adding profile:', error);
      throw error;
    }
  }

  /**
   * Update a social profile
   * @param id - Profile ID
   * @param data - Updated profile data
   * @returns The updated social profile
   */
  async updateProfile(id: string, data: Omit<Partial<SocialProfile>, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<SocialProfile | null> {
    try {
      // Map the SocialProfile fields to SocialProfileDocument fields
      const updateData: any = { ...data };
      if ('connected' in data) {
        updateData.isConnected = data.connected;
        delete updateData.connected;
      }
      
      const updatedProfile = await this.updateById(id, updateData);
      if (!updatedProfile) return null;
      
      return {
        id: updatedProfile._id.toString(),
        userId: updatedProfile.userId.toString(),
        platform: updatedProfile.platform as SocialProfile['platform'],
        username: updatedProfile.username,
        profileUrl: updatedProfile.profileUrl || '',
        connected: updatedProfile.isConnected,
        followers: 0, // Default value since it's not in the document
        lastUpdated: updatedProfile.updatedAt.toISOString(),
        createdAt: updatedProfile.createdAt,
        updatedAt: updatedProfile.updatedAt
      };
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  /**
   * Delete a social profile
   * @param id - Profile ID
   * @returns Success message
   */
  async deleteProfile(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const result = await this.deleteById(id);
      
      if (!result) {
        return { success: false, message: 'Profile not found' };
      }
      
      return { success: true, message: 'Profile deleted successfully' };
    } catch (error) {
      console.error('Error deleting profile:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const socialProfileService = new SocialProfileService();
export default socialProfileService;

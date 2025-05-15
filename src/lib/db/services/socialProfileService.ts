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
        platform: profile.platform,
        username: profile.username,
        profileUrl: profile.profileUrl,
        isConnected: profile.isConnected,
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
  async getUserPlatformProfile(userId: string, platform: string): Promise<SocialProfile | null> {
    try {
      const profile = await this.findOne({ userId, platform });
      if (!profile) return null;
      
      return {
        id: profile._id.toString(),
        userId: profile.userId.toString(),
        platform: profile.platform,
        username: profile.username,
        profileUrl: profile.profileUrl,
        isConnected: profile.isConnected,
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
        userId: new mongoose.Types.ObjectId(profile.userId)
      });
      
      return {
        id: newProfile._id.toString(),
        userId: newProfile.userId.toString(),
        platform: newProfile.platform,
        username: newProfile.username,
        profileUrl: newProfile.profileUrl,
        isConnected: newProfile.isConnected,
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
  async updateProfile(id: string, data: Partial<SocialProfile>): Promise<SocialProfile | null> {
    try {
      const updatedProfile = await this.updateById(id, data);
      if (!updatedProfile) return null;
      
      return {
        id: updatedProfile._id.toString(),
        userId: updatedProfile.userId.toString(),
        platform: updatedProfile.platform,
        username: updatedProfile.username,
        profileUrl: updatedProfile.profileUrl,
        isConnected: updatedProfile.isConnected,
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

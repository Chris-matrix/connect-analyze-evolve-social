import { getSocialMetricsModel } from '../models';
import DatabaseService from '../dbService';
import { SocialMetrics } from '@/types/socialMetrics';
import { SocialMetricsDocument } from '../types';
import mongoose, { FilterQuery } from 'mongoose';

/**
 * Service for handling social metrics operations
 */
class SocialMetricsService extends DatabaseService<SocialMetricsDocument> {
  constructor() {
    const model = getSocialMetricsModel();
    super(model, 'SocialMetrics');
  }

  /**
   * Get metrics for a user
   * @param userId - User ID
   * @param filters - Optional filters (platform, startDate, endDate)
   * @returns Array of social metrics
   */
  async getMetricsByUserId(
    userId: string,
    filters?: { 
      platform?: string; 
      startDate?: Date; 
      endDate?: Date;
      profileId?: string;
    }
  ): Promise<SocialMetrics[]> {
    try {
      const query: FilterQuery<SocialMetricsDocument> = { userId: new mongoose.Types.ObjectId(userId) };
      
      if (filters?.platform) {
        query.platform = filters.platform;
      }
      
      if (filters?.profileId) {
        query.profileId = new mongoose.Types.ObjectId(filters.profileId);
      }
      
      if (filters?.startDate || filters?.endDate) {
        query.date = {};
        
        if (filters.startDate) {
          query.date.$gte = filters.startDate;
        }
        
        if (filters.endDate) {
          query.date.$lte = filters.endDate;
        }
      }
      
      const metrics = await this.find(query);
      
      return metrics.map(metric => ({
        id: metric._id.toString(),
        userId: metric.userId.toString(),
        profileId: metric.profileId.toString(),
        platform: metric.platform,
        date: metric.date,
        followers: metric.followers,
        following: metric.following,
        posts: metric.posts,
        likes: metric.likes,
        comments: metric.comments,
        shares: metric.shares,
        impressions: metric.impressions,
        reach: metric.reach,
        engagement: metric.engagement,
        engagementRate: metric.engagementRate,
        createdAt: metric.createdAt,
        updatedAt: metric.updatedAt
      }));
    } catch (error) {
      console.error('Error getting metrics by user ID:', error);
      throw error;
    }
  }

  /**
   * Get metrics for a specific profile
   * @param profileId - Profile ID
   * @param filters - Optional filters (startDate, endDate)
   * @returns Array of social metrics
   */
  async getMetricsByProfileId(
    profileId: string,
    filters?: { 
      startDate?: Date; 
      endDate?: Date;
    }
  ): Promise<SocialMetrics[]> {
    try {
      const query: FilterQuery<SocialMetricsDocument> = { profileId: new mongoose.Types.ObjectId(profileId) };
      
      if (filters?.startDate || filters?.endDate) {
        query.date = {};
        
        if (filters.startDate) {
          query.date.$gte = filters.startDate;
        }
        
        if (filters.endDate) {
          query.date.$lte = filters.endDate;
        }
      }
      
      const metrics = await this.find(query);
      
      return metrics.map(metric => ({
        id: metric._id.toString(),
        userId: metric.userId.toString(),
        profileId: metric.profileId.toString(),
        platform: metric.platform,
        date: metric.date,
        followers: metric.followers,
        following: metric.following,
        posts: metric.posts,
        likes: metric.likes,
        comments: metric.comments,
        shares: metric.shares,
        impressions: metric.impressions,
        reach: metric.reach,
        engagement: metric.engagement,
        engagementRate: metric.engagementRate,
        createdAt: metric.createdAt,
        updatedAt: metric.updatedAt
      }));
    } catch (error) {
      console.error('Error getting metrics by profile ID:', error);
      throw error;
    }
  }

  /**
   * Add new metrics
   * @param metrics - Social metrics data
   * @returns The created social metrics
   */
  async addMetrics(
    metrics: Omit<SocialMetrics, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<SocialMetrics> {
    try {
      const newMetrics = await this.create({
        ...metrics,
        userId: new mongoose.Types.ObjectId(metrics.userId),
        profileId: new mongoose.Types.ObjectId(metrics.profileId)
      });
      
      return {
        id: newMetrics._id.toString(),
        userId: newMetrics.userId.toString(),
        profileId: newMetrics.profileId.toString(),
        platform: newMetrics.platform,
        date: newMetrics.date,
        followers: newMetrics.followers,
        following: newMetrics.following,
        posts: newMetrics.posts,
        likes: newMetrics.likes,
        comments: newMetrics.comments,
        shares: newMetrics.shares,
        impressions: newMetrics.impressions,
        reach: newMetrics.reach,
        engagement: newMetrics.engagement,
        engagementRate: newMetrics.engagementRate,
        createdAt: newMetrics.createdAt,
        updatedAt: newMetrics.updatedAt
      };
    } catch (error) {
      console.error('Error adding metrics:', error);
      throw error;
    }
  }

  /**
   * Update metrics
   * @param id - Metrics ID
   * @param data - Updated metrics data
   * @returns The updated social metrics
   */
  async updateMetrics(
    id: string,
    data: Partial<SocialMetrics>
  ): Promise<SocialMetrics | null> {
    try {
      const updatedMetrics = await this.updateById(id, data);
      if (!updatedMetrics) return null;
      
      return {
        id: updatedMetrics._id.toString(),
        userId: updatedMetrics.userId.toString(),
        profileId: updatedMetrics.profileId.toString(),
        platform: updatedMetrics.platform,
        date: updatedMetrics.date,
        followers: updatedMetrics.followers,
        following: updatedMetrics.following,
        posts: updatedMetrics.posts,
        likes: updatedMetrics.likes,
        comments: updatedMetrics.comments,
        shares: updatedMetrics.shares,
        impressions: updatedMetrics.impressions,
        reach: updatedMetrics.reach,
        engagement: updatedMetrics.engagement,
        engagementRate: updatedMetrics.engagementRate,
        createdAt: updatedMetrics.createdAt,
        updatedAt: updatedMetrics.updatedAt
      };
    } catch (error) {
      console.error('Error updating metrics:', error);
      throw error;
    }
  }

  /**
   * Get follower growth data for a user
   * @param userId - User ID
   * @param platform - Social media platform (optional)
   * @param timeRange - Time range in days (7, 30, 90, 365)
   * @returns Array of follower counts with dates
   */
  async getFollowerGrowth(
    userId: string,
    timeRange: 7 | 30 | 90 | 365 = 30,
    platform?: string
  ): Promise<{ date: Date; followers: number; platform: string }[]> {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - timeRange);
      
      const query: FilterQuery<SocialMetricsDocument> = { 
        userId: new mongoose.Types.ObjectId(userId),
        date: { $gte: startDate, $lte: endDate }
      };
      
      if (platform) {
        query.platform = platform;
      }
      
      const metrics = await this.find(query);
      
      return metrics.map(metric => ({
        date: metric.date,
        followers: metric.followers,
        platform: metric.platform
      }));
    } catch (error) {
      console.error('Error getting follower growth:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const socialMetricsService = new SocialMetricsService();
export default socialMetricsService;

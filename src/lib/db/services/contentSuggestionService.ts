import { getContentSuggestionModel } from '../models';
import DatabaseService from '../dbService';
import { ContentSuggestion } from '@/types/content';
import { ContentSuggestionDocument } from '../types';
import mongoose, { FilterQuery } from 'mongoose';

/**
 * Service for handling content suggestion operations
 */
class ContentSuggestionService extends DatabaseService<ContentSuggestionDocument> {
  constructor() {
    const model = getContentSuggestionModel();
    super(model, 'ContentSuggestion');
  }

  /**
   * Get all content suggestions for a user
   * @param userId - User ID
   * @param filters - Optional filters (status, platform)
   * @returns Array of content suggestions
   */
  async getSuggestionsByUserId(
    userId: string, 
    filters?: { status?: string; platform?: string }
  ): Promise<ContentSuggestion[]> {
    try {
      const query: FilterQuery<ContentSuggestionDocument> = { userId: new mongoose.Types.ObjectId(userId) };
      
      if (filters?.status) {
        query.status = filters.status;
      }
      
      if (filters?.platform) {
        query.platform = filters.platform;
      }
      
      const suggestions = await this.find(query);
      
      return suggestions.map(suggestion => ({
        id: suggestion._id.toString(),
        userId: suggestion.userId.toString(),
        platform: suggestion.platform,
        title: suggestion.title,
        content: suggestion.content,
        imagePrompt: suggestion.imagePrompt,
        status: suggestion.status,
        scheduledDate: suggestion.scheduledDate,
        tags: suggestion.tags,
        aiGenerated: suggestion.aiGenerated,
        metadata: suggestion.metadata ? Object.fromEntries(suggestion.metadata) : {},
        createdAt: suggestion.createdAt,
        updatedAt: suggestion.updatedAt
      }));
    } catch (error) {
      console.error('Error getting suggestions by user ID:', error);
      throw error;
    }
  }

  /**
   * Get a content suggestion by ID
   * @param id - Suggestion ID
   * @returns The content suggestion or null if not found
   */
  async getSuggestionById(id: string): Promise<ContentSuggestion | null> {
    try {
      const suggestion = await this.findById(id);
      if (!suggestion) return null;
      
      return {
        id: suggestion._id.toString(),
        userId: suggestion.userId.toString(),
        platform: suggestion.platform,
        title: suggestion.title,
        content: suggestion.content,
        imagePrompt: suggestion.imagePrompt,
        status: suggestion.status,
        scheduledDate: suggestion.scheduledDate,
        tags: suggestion.tags,
        aiGenerated: suggestion.aiGenerated,
        metadata: suggestion.metadata ? Object.fromEntries(suggestion.metadata) : {},
        createdAt: suggestion.createdAt,
        updatedAt: suggestion.updatedAt
      };
    } catch (error) {
      console.error('Error getting suggestion by ID:', error);
      throw error;
    }
  }

  /**
   * Create a new content suggestion
   * @param suggestion - Content suggestion data
   * @returns The created content suggestion
   */
  async createSuggestion(
    suggestion: Omit<ContentSuggestion, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ContentSuggestion> {
    try {
      // Convert metadata object to Map if it exists
      const metadataMap = suggestion.metadata ? new Map(Object.entries(suggestion.metadata)) : undefined;
      
      const newSuggestion = await this.create({
        ...suggestion,
        userId: new mongoose.Types.ObjectId(suggestion.userId),
        metadata: metadataMap
      });
      
      return {
        id: newSuggestion._id.toString(),
        userId: newSuggestion.userId.toString(),
        platform: newSuggestion.platform,
        title: newSuggestion.title,
        content: newSuggestion.content,
        imagePrompt: newSuggestion.imagePrompt,
        status: newSuggestion.status,
        scheduledDate: newSuggestion.scheduledDate,
        tags: newSuggestion.tags,
        aiGenerated: newSuggestion.aiGenerated,
        metadata: newSuggestion.metadata ? Object.fromEntries(newSuggestion.metadata) : {},
        createdAt: newSuggestion.createdAt,
        updatedAt: newSuggestion.updatedAt
      };
    } catch (error) {
      console.error('Error creating suggestion:', error);
      throw error;
    }
  }

  /**
   * Update a content suggestion
   * @param id - Suggestion ID
   * @param data - Updated suggestion data
   * @returns The updated content suggestion
   */
  async updateSuggestion(
    id: string, 
    data: Partial<ContentSuggestion>
  ): Promise<ContentSuggestion | null> {
    try {
      // Convert metadata object to Map if it exists
      const updateData: Partial<ContentSuggestionDocument> = { ...data };
      
      if (data.metadata) {
        updateData.metadata = new Map(Object.entries(data.metadata));
      }
      
      const updatedSuggestion = await this.updateById(id, updateData);
      if (!updatedSuggestion) return null;
      
      return {
        id: updatedSuggestion._id.toString(),
        userId: updatedSuggestion.userId.toString(),
        platform: updatedSuggestion.platform,
        title: updatedSuggestion.title,
        content: updatedSuggestion.content,
        imagePrompt: updatedSuggestion.imagePrompt,
        status: updatedSuggestion.status,
        scheduledDate: updatedSuggestion.scheduledDate,
        tags: updatedSuggestion.tags,
        aiGenerated: updatedSuggestion.aiGenerated,
        metadata: updatedSuggestion.metadata ? Object.fromEntries(updatedSuggestion.metadata) : {},
        createdAt: updatedSuggestion.createdAt,
        updatedAt: updatedSuggestion.updatedAt
      };
    } catch (error) {
      console.error('Error updating suggestion:', error);
      throw error;
    }
  }

  /**
   * Delete a content suggestion
   * @param id - Suggestion ID
   * @returns Success message
   */
  async deleteSuggestion(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const result = await this.deleteById(id);
      
      if (!result) {
        return { success: false, message: 'Suggestion not found' };
      }
      
      return { success: true, message: 'Suggestion deleted successfully' };
    } catch (error) {
      console.error('Error deleting suggestion:', error);
      throw error;
    }
  }

  /**
   * Update the status of a content suggestion
   * @param id - Suggestion ID
   * @param status - New status
   * @returns The updated content suggestion
   */
  async updateSuggestionStatus(
    id: string, 
    status: 'pending' | 'approved' | 'rejected' | 'published'
  ): Promise<ContentSuggestion | null> {
    return this.updateSuggestion(id, { status });
  }
}

// Export a singleton instance
export const contentSuggestionService = new ContentSuggestionService();
export default contentSuggestionService;

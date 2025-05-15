import mongoose from 'mongoose';
import { ContentSuggestionDocument } from '../types';

// Cache for model instances
let contentSuggestionModel: mongoose.Model<ContentSuggestionDocument> | null = null;

/**
 * Create and return the ContentSuggestion model
 * @returns Mongoose ContentSuggestion model
 */
export function getContentSuggestionModel(): mongoose.Model<ContentSuggestionDocument> | null {
  // Return cached model if available
  if (contentSuggestionModel) {
    return contentSuggestionModel;
  }

  try {
    // Define the ContentSuggestion schema
    const contentSuggestionSchema = new mongoose.Schema(
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        platform: {
          type: String,
          required: true,
          enum: ['twitter', 'facebook', 'instagram', 'linkedin', 'tiktok', 'youtube', 'all'],
          default: 'all',
        },
        mediaType: {
          type: String,
          enum: ['text', 'image', 'video', 'carousel', 'link'],
          default: 'text',
        },
        status: {
          type: String,
          enum: ['pending', 'approved', 'rejected', 'published'],
          default: 'pending',
        },
        suggestedTags: [String],
        tags: [String],
        bestTimeToPost: Date,
        aiGeneratedScore: {
          type: Number,
          min: 0,
          max: 100,
        },
        metadata: {
          type: Map,
          of: mongoose.Schema.Types.Mixed,
          default: {},
        },
        publishedAt: Date,
        publishedUrl: String,
        performanceMetrics: {
          likes: { type: Number, default: 0 },
          comments: { type: Number, default: 0 },
          shares: { type: Number, default: 0 },
          impressions: { type: Number, default: 0 },
          engagement: { type: Number, default: 0 },
        },
      },
      {
        timestamps: true,
      }
    );

    // Create indexes for efficient queries
    contentSuggestionSchema.index({ userId: 1, status: 1 });
    contentSuggestionSchema.index({ userId: 1, platform: 1 });
    contentSuggestionSchema.index({ userId: 1, createdAt: -1 });

    // Check if mongoose.models exists (it might not in browser environments)
    if (mongoose.models && mongoose.models.ContentSuggestion) {
      contentSuggestionModel = mongoose.models.ContentSuggestion as mongoose.Model<ContentSuggestionDocument>;
    } else if (typeof mongoose.model === 'function') {
      contentSuggestionModel = mongoose.model<ContentSuggestionDocument>('ContentSuggestion', contentSuggestionSchema);
    } else {
      // Return a mock model for browser environments
      return createMockContentSuggestionModel();
    }

    return contentSuggestionModel;
  } catch (error) {
    console.error('Error creating ContentSuggestion model:', error);
    // Return a mock model for browser environments
    return createMockContentSuggestionModel();
  }
}

/**
 * Create a mock ContentSuggestion model for browser environments
 * @returns Mock ContentSuggestion model
 */
function createMockContentSuggestionModel() {
  const mockModel = {
    findOne: () => Promise.resolve(null),
    findById: () => Promise.resolve(null),
    find: () => Promise.resolve([]),
    create: () => Promise.resolve({}),
    updateOne: () => Promise.resolve({}),
    deleteOne: () => Promise.resolve({})
  };

  return mockModel;
}

export default getContentSuggestionModel;

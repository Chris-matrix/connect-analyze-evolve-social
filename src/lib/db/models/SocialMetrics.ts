import mongoose from 'mongoose';
import { SocialMetricsDocument } from '../types';

// Cache for model instances
let socialMetricsModel: mongoose.Model<SocialMetricsDocument> | null = null;

/**
 * Create and return the SocialMetrics model
 * @returns Mongoose SocialMetrics model
 */
export function getSocialMetricsModel(): mongoose.Model<SocialMetricsDocument> | null {
  // Return cached model if available
  if (socialMetricsModel) {
    return socialMetricsModel;
  }

  try {
    // Define the SocialMetrics schema
    const socialMetricsSchema = new mongoose.Schema(
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        profileId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'SocialProfile',
          required: true,
        },
        platform: {
          type: String,
          required: true,
          lowercase: true,
          enum: ['twitter', 'facebook', 'instagram', 'linkedin', 'tiktok', 'youtube'],
        },
        date: {
          type: Date,
          default: Date.now,
          required: true,
        },
        followers: {
          type: Number,
          default: 0,
        },
        following: {
          type: Number,
          default: 0,
        },
        posts: {
          type: Number,
          default: 0,
        },
        likes: {
          type: Number,
          default: 0,
        },
        comments: {
          type: Number,
          default: 0,
        },
        shares: {
          type: Number,
          default: 0,
        },
        impressions: {
          type: Number,
          default: 0,
        },
        reach: {
          type: Number,
          default: 0,
        },
        engagement: {
          type: Number,
          default: 0,
        },
        engagementRate: {
          type: Number,
          default: 0,
        },
        demographics: {
          age: {
            '18-24': { type: Number, default: 0 },
            '25-34': { type: Number, default: 0 },
            '35-44': { type: Number, default: 0 },
            '45-54': { type: Number, default: 0 },
            '55+': { type: Number, default: 0 },
          },
          gender: {
            male: { type: Number, default: 0 },
            female: { type: Number, default: 0 },
            other: { type: Number, default: 0 },
          },
          locations: [
            {
              country: String,
              city: String,
              count: Number,
            },
          ],
        },
      },
      {
        timestamps: true,
      }
    );

    // Create compound indexes for efficient queries
    socialMetricsSchema.index({ userId: 1, platform: 1, date: 1 });
    socialMetricsSchema.index({ profileId: 1, date: 1 });

    // Check if mongoose.models exists (it might not in browser environments)
    if (mongoose.models && mongoose.models.SocialMetrics) {
      socialMetricsModel = mongoose.models.SocialMetrics as mongoose.Model<SocialMetricsDocument>;
    } else if (typeof mongoose.model === 'function') {
      socialMetricsModel = mongoose.model<SocialMetricsDocument>('SocialMetrics', socialMetricsSchema);
    } else {
      // Return a mock model for browser environments
      return createMockSocialMetricsModel();
    }

    return socialMetricsModel;
  } catch (error) {
    console.error('Error creating SocialMetrics model:', error);
    // Return a mock model for browser environments
    return createMockSocialMetricsModel();
  }
}

/**
 * Create a mock SocialMetrics model for browser environments
 * @returns Mock SocialMetrics model
 */
function createMockSocialMetricsModel() {
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

export default getSocialMetricsModel;

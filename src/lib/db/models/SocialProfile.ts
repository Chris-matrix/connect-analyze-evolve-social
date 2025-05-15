import mongoose from 'mongoose';
import { SocialProfileDocument } from '../types';

// Cache for model instances
let socialProfileModel: mongoose.Model<SocialProfileDocument> | null = null;

/**
 * Create and return the SocialProfile model
 * @returns Mongoose SocialProfile model
 */
export function getSocialProfileModel(): mongoose.Model<SocialProfileDocument> | null {
  // Return cached model if available
  if (socialProfileModel) {
    return socialProfileModel;
  }

  try {
    // Define the SocialProfile schema
    const socialProfileSchema = new mongoose.Schema(
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        platform: {
          type: String,
          required: true,
          lowercase: true,
          enum: ['twitter', 'facebook', 'instagram', 'linkedin', 'tiktok', 'youtube'],
        },
        username: {
          type: String,
          required: true,
        },
        profileUrl: String,
        isConnected: {
          type: Boolean,
          default: false,
        },
        followers: {
          type: Number,
          default: 0,
        },
        following: {
          type: Number,
          default: 0,
        },
        lastUpdated: {
          type: Date,
          default: Date.now,
        },
        accessToken: String,
        refreshToken: String,
        tokenExpiry: Date,
      },
      {
        timestamps: true,
      }
    );

    // Create a compound index on userId and platform
    socialProfileSchema.index({ userId: 1, platform: 1 }, { unique: true });

    // Check if mongoose.models exists (it might not in browser environments)
    if (mongoose.models && mongoose.models.SocialProfile) {
      socialProfileModel = mongoose.models.SocialProfile as mongoose.Model<SocialProfileDocument>;
    } else if (typeof mongoose.model === 'function') {
      socialProfileModel = mongoose.model<SocialProfileDocument>('SocialProfile', socialProfileSchema);
    } else {
      // Return a mock model for browser environments
      return createMockSocialProfileModel();
    }

    return socialProfileModel;
  } catch (error) {
    console.error('Error creating SocialProfile model:', error);
    // Return a mock model for browser environments
    return createMockSocialProfileModel();
  }
}

/**
 * Create a mock SocialProfile model for browser environments
 * @returns Mock SocialProfile model
 */
function createMockSocialProfileModel() {
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

export default getSocialProfileModel;

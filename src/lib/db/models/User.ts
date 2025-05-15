import mongoose from 'mongoose';
import { UserDocument } from '../types';

// Cache for model instances
let userModel: mongoose.Model<UserDocument> | null = null;

/**
 * Create and return the User model
 * @returns Mongoose User model
 */
export function getUserModel(): mongoose.Model<UserDocument> | null {
  // Return cached model if available
  if (userModel) {
    return userModel;
  }

  try {
    // Define the User schema
    const userSchema = new mongoose.Schema(
      {
        name: {
          type: String,
          required: [true, 'Please provide a name'],
        },
        email: {
          type: String,
          required: [true, 'Please provide an email'],
          unique: true,
          lowercase: true,
          trim: true,
        },
        password: {
          type: String,
          select: false,
        },
        image: String,
        emailVerified: Date,
        role: {
          type: String,
          enum: ['user', 'admin'],
          default: 'user',
        },
        accounts: [
          {
            provider: {
              type: String,
              required: true,
            },
            providerAccountId: {
              type: String,
              required: true,
            },
            access_token: String,
            refresh_token: String,
            expires_at: Number,
          },
        ],
      },
      {
        timestamps: true,
      }
    );

    // Create a compound index on provider and providerAccountId
    userSchema.index({ 'accounts.provider': 1, 'accounts.providerAccountId': 1 });

    // Check if mongoose.models exists (it might not in browser environments)
    if (mongoose.models && mongoose.models.User) {
      userModel = mongoose.models.User as mongoose.Model<UserDocument>;
    } else if (typeof mongoose.model === 'function') {
      userModel = mongoose.model<UserDocument>('User', userSchema);
    } else {
      // Return a mock model for browser environments
      return createMockUserModel();
    }

    return userModel;
  } catch (error) {
    console.error('Error creating User model:', error);
    // Return a mock model for browser environments
    return createMockUserModel();
  }
}

/**
 * Create a mock User model for browser environments
 * @returns Mock User model
 */
function createMockUserModel() {
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

export default getUserModel;

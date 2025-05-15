/**
 * Models index file
 * Centralizes model exports and provides database initialization
 */
import connectDB from '../mongodb';
import mongoose from 'mongoose';
import { UserDocument, SocialProfileDocument, SocialMetricsDocument, ContentSuggestionDocument } from '../types';

// Type-safe model registry
type ModelRegistry = {
  User: mongoose.Model<UserDocument> | null;
  SocialProfile: mongoose.Model<SocialProfileDocument> | null;
  SocialMetrics: mongoose.Model<SocialMetricsDocument> | null;
  ContentSuggestion: mongoose.Model<ContentSuggestionDocument> | null;
};

// Registry to cache model instances
const modelRegistry: ModelRegistry = {
  User: null,
  SocialProfile: null,
  SocialMetrics: null,
  ContentSuggestion: null
};

/**
 * Initialize database connection before using models
 * @returns Promise resolving to connection success status
 */
export async function initializeDatabase(): Promise<boolean> {
  try {
    await connectDB();
    return true;
  } catch (error) {
    console.error('Failed to initialize database connection:', error);
    return false;
  }
}

// Try to connect to the database when this module is imported
connectDB().catch(err => console.error('Error connecting to database:', err));

/**
 * Get User model
 * @returns Mongoose User model
 */
export function getUserModel(): mongoose.Model<UserDocument> | null {
  if (!modelRegistry.User) {
    // Use dynamic import for all environments
    import('./User').then(module => {
      modelRegistry.User = module.default();
    }).catch(error => {
      console.error('Error loading User model:', error);
    });
    
    // Create a mock model while the real one is loading
    const mockModel = createMockModel<UserDocument>();
    modelRegistry.User = mockModel as unknown as mongoose.Model<UserDocument>;
  }
  
  return modelRegistry.User;
}

/**
 * Get SocialProfile model
 * @returns Mongoose SocialProfile model
 */
export function getSocialProfileModel(): mongoose.Model<SocialProfileDocument> | null {
  if (!modelRegistry.SocialProfile) {
    // Use dynamic import for all environments
    import('./SocialProfile').then(module => {
      modelRegistry.SocialProfile = module.default();
    }).catch(error => {
      console.error('Error loading SocialProfile model:', error);
    });
    
    // Create a mock model while the real one is loading
    const mockModel = createMockModel<SocialProfileDocument>();
    modelRegistry.SocialProfile = mockModel as unknown as mongoose.Model<SocialProfileDocument>;
  }
  
  return modelRegistry.SocialProfile;
}

/**
 * Get SocialMetrics model
 * @returns Mongoose SocialMetrics model
 */
export function getSocialMetricsModel(): mongoose.Model<SocialMetricsDocument> | null {
  if (!modelRegistry.SocialMetrics) {
    // Use dynamic import for all environments
    import('./SocialMetrics').then(module => {
      modelRegistry.SocialMetrics = module.default();
    }).catch(error => {
      console.error('Error loading SocialMetrics model:', error);
    });
    
    // Create a mock model while the real one is loading
    const mockModel = createMockModel<SocialMetricsDocument>();
    modelRegistry.SocialMetrics = mockModel as unknown as mongoose.Model<SocialMetricsDocument>;
  }
  
  return modelRegistry.SocialMetrics;
}

/**
 * Get ContentSuggestion model
 * @returns Mongoose ContentSuggestion model
 */
export function getContentSuggestionModel(): mongoose.Model<ContentSuggestionDocument> | null {
  if (!modelRegistry.ContentSuggestion) {
    // Use dynamic import for all environments
    import('./ContentSuggestion').then(module => {
      modelRegistry.ContentSuggestion = module.default();
    }).catch(error => {
      console.error('Error loading ContentSuggestion model:', error);
    });
    
    // Create a mock model while the real one is loading
    const mockModel = createMockModel<ContentSuggestionDocument>();
    modelRegistry.ContentSuggestion = mockModel as unknown as mongoose.Model<ContentSuggestionDocument>;
  }
  
  return modelRegistry.ContentSuggestion;
}

/**
 * Create a mock model for browser environments or while loading
 * @returns Mock model with basic CRUD operations
 */
function createMockModel<T extends mongoose.Document>() {
  return {
    findOne: () => Promise.resolve(null),
    findById: () => Promise.resolve(null),
    find: () => Promise.resolve([]),
    create: () => Promise.resolve({}),
    updateOne: () => Promise.resolve({}),
    deleteOne: () => Promise.resolve({})
  };
}

// Export all models as a convenient object
export const Models = {
  User: getUserModel,
  SocialProfile: getSocialProfileModel,
  SocialMetrics: getSocialMetricsModel,
  ContentSuggestion: getContentSuggestionModel
};

export default Models;

import * as mockDataGenerator from '@/lib/mock-data/generator';
import { initializeMockData, SocialProfile as MockSocialProfile } from '@/lib/mock-data/mock-api';
import { userService, socialProfileService, socialMetricsService, contentSuggestionService } from './services';
import connectDB from './mongodb';
import { SocialProfile } from '@/types/socialProfile';
import { ContentSuggestion } from '@/types/content';
import { SocialMetrics } from '@/types/content';

// Define platform data type for mock data
interface PlatformData {
  platform: string;
  followers: number;
  following?: number;
  posts?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  impressions?: number;
  reach?: number;
  engagement?: number;
  engagementRate?: number;
}

/**
 * Import mock data into the MongoDB database
 * @param onProgress - Callback function to report import progress (0-100)
 * @returns Promise that resolves when import is complete
 */
export const importMockDataToDatabase = async (onProgress?: (progress: number) => void): Promise<void> => {
  try {
    // Ensure mock data is initialized
    initializeMockData();
    
    // Connect to the database
    await connectDB();
    
    // Get all mock data
    const mockData = mockDataGenerator.getAllMockData();
    
    // Track progress
    const totalSteps = 4; // User, social profiles, metrics, content suggestions
    let completedSteps = 0;
    
    const updateProgress = () => {
      completedSteps++;
      if (onProgress) {
        onProgress(Math.round((completedSteps / totalSteps) * 100));
      }
    };
    
    // 1. Import user data
    const userData = mockData.user;
    if (userData) {
      // Check if user already exists
      const existingUser = await userService.getUserByEmail(userData.email);
      
      if (!existingUser) {
        await userService.createUser({
          name: userData.name,
          email: userData.email,
          password: 'password123', // Default password for mock data
          image: userData.image,
          role: 'user'
        });
      }
    }
    updateProgress();
    
    // Get the user ID (either existing or newly created)
    const user = await userService.getUserByEmail(userData?.email || 'user@example.com');
    const userId = user?.id;
    
    if (!userId) {
      throw new Error('Failed to get user ID');
    }
    
    // 2. Import social profiles
    const socialProfiles = mockData.platforms?.map(platform => ({
      userId,
      platform: platform.platform.toLowerCase(),
      username: `${platform.platform.toLowerCase()}_user`,
      profileUrl: `https://${platform.platform.toLowerCase()}.com/${platform.platform.toLowerCase()}_user`,
      isConnected: true,
      connected: true,
      followers: platform.followers,
      lastUpdated: new Date().toISOString()
    })) || [];
    
    // Store user ID in localStorage for API fallbacks
    try {
      localStorage.setItem('userId', userId);
    } catch (error) {
      console.warn('Failed to store userId in localStorage:', error);
    }
    
    // Add social profiles
    for (const profile of socialProfiles) {
      // Check if profile already exists
      const existingProfiles = await socialProfileService.getProfilesByUserId(userId);
      const exists = existingProfiles.some(p => p.platform === profile.platform);
      
      if (!exists) {
        await socialProfileService.addProfile(profile as Omit<SocialProfile, 'id' | 'createdAt' | 'updatedAt'>);
      }
    }
    updateProgress();
    
    // Get all profiles to use their IDs for metrics
    const profiles = await socialProfileService.getProfilesByUserId(userId);
    
    // 3. Import metrics data
    if (mockData.platforms && profiles.length > 0) {
      for (const platform of mockData.platforms as PlatformData[]) {
        const profile = profiles.find(p => p.platform === platform.platform.toLowerCase());
        
        if (profile) {
          // Generate 30 days of metrics data
          const now = new Date();
          
          for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(now.getDate() - i);
            
            // Create random fluctuations around the base values
            const randomFactor = 0.9 + Math.random() * 0.2; // 0.9-1.1
            
            // Extract metrics from the platform data
            // These are the fields we need for our database schema
            const metricsData = {
              userId,
              profileId: profile.id,
              platform: profile.platform,
              date,
              followers: Math.round(platform.followers * randomFactor * (1 - i/100)),
              following: Math.round(platform.following || 100 * randomFactor),
              posts: Math.round(platform.posts || 50 * randomFactor),
              likes: Math.round(platform.likes || 500 * randomFactor * (1 - i/100)),
              comments: Math.round(platform.comments || 100 * randomFactor * (1 - i/100)),
              shares: Math.round(platform.shares || 50 * randomFactor * (1 - i/100)),
              impressions: Math.round(platform.impressions || 1000 * randomFactor * (1 - i/100)),
              reach: Math.round(platform.reach || 800 * randomFactor * (1 - i/100)),
              engagement: Math.round(platform.engagement || 200 * randomFactor * (1 - i/100)),
              engagementRate: platform.engagementRate || 0.05 * randomFactor
            };
            
            // Add metrics data
            await socialMetricsService.addMetrics(metricsData);
          }
        }
      }
    }
    updateProgress();
    
    // 4. Import content suggestions
    if (mockData.contentSuggestions && mockData.contentSuggestions.length > 0) {
      for (const suggestion of mockData.contentSuggestions) {
        // Check if suggestion already exists by title (simple check)
        const existingSuggestions = await contentSuggestionService.getSuggestionsByUserId(userId);
        const exists = existingSuggestions.some(s => s.title === suggestion.title);
        
        if (!exists) {
          // Create a properly typed content suggestion object
          const newSuggestion: Omit<ContentSuggestion, 'id' | 'createdAt' | 'updatedAt'> = {
            userId,
            title: suggestion.title,
            content: suggestion.content,
            platform: suggestion.platform || 'all',
            status: suggestion.status || 'pending',
            tags: suggestion.tags || [],
            metadata: {}
          };
          
          await contentSuggestionService.createSuggestion(newSuggestion);
        }
      }
    }
    updateProgress();
    
    console.log('✅ Mock data imported successfully');
    
    // Set flag in localStorage to indicate data has been imported
    try {
      localStorage.setItem('mockDataImported', 'true');
    } catch (error) {
      console.warn('Failed to store mockDataImported flag in localStorage:', error);
    }
    
  } catch (error) {
    console.error('Error importing mock data:', error);
    throw error;
  }
};

import { getStorageItem } from '@/lib/utils/storage';

/**
 * Check if the application should use database storage
 * @returns Boolean indicating whether to use database storage
 */
export const shouldUseDatabase = (): boolean => {
  try {
    // Check localStorage for user preference
    const preference = localStorage.getItem('useDatabase');
    
    if (preference !== null) {
      return preference === 'true';
    }
  } catch (error) {
    console.warn('Error checking database preference in localStorage:', error);
  }
  
  // Default to false if no preference is set or if there was an error
  return false;
};

/**
 * Check if mock data has been imported to the database
 * @returns Promise that resolves to a boolean indicating if data has been imported
 */
export const isMockDataImported = async (): Promise<boolean> => {
  try {
    // Check localStorage first for performance
    const imported = localStorage.getItem('mockDataImported');
    
    if (imported === 'true') {
      return true;
    }
    
    // Connect to database and check if there's any data
    await connectDB();
    
    // Check if there are any users
    const users = await userService.find({});
    
    if (users && users.length > 0) {
      // Set flag in localStorage
      localStorage.setItem('mockDataImported', 'true');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking if mock data is imported:', error);
    return false;
  }
};

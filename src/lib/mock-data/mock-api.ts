import * as mockDataGenerator from './generator';
import { ContentSuggestion, SocialMetrics, User } from '@/types/content';
import { safeLocalStorage, isBrowser } from '../utils/browser';

// Define SocialProfile interface
export interface SocialProfile {
  id: string;
  platform: 'instagram' | 'twitter' | 'facebook' | 'linkedin';
  username: string;
  profileUrl: string;
  connected: boolean;
  followers: number;
  lastUpdated: string;
}

// Cache for mock data to ensure consistency across the app
const mockDataCache: {
  dashboard?: ReturnType<typeof mockDataGenerator.generateDashboardData>;
  analytics?: ReturnType<typeof mockDataGenerator.generateAnalyticsData>;
  audience?: ReturnType<typeof mockDataGenerator.generateAudienceData>;
  engagement?: ReturnType<typeof mockDataGenerator.generateEngagementData>;
  contentSuggestions?: ContentSuggestion[];
  calendarData?: Array<Record<string, unknown>>;
  user?: User;
  platforms?: SocialMetrics[];
  socialProfiles?: SocialProfile[];
  allData?: ReturnType<typeof mockDataGenerator.getAllMockData>;
} = {};

// Helper function to simulate API delay
const simulateApiDelay = async () => {
  const delay = Math.random() * 500 + 300; // 300-800ms delay
  return new Promise(resolve => setTimeout(resolve, delay));
};

// Initialize all mock data
export const initializeMockData = () => {
  if (Object.keys(mockDataCache).length === 0) {
    mockDataCache.allData = mockDataGenerator.getAllMockData();
    mockDataCache.dashboard = mockDataCache.allData.dashboard;
    mockDataCache.analytics = mockDataCache.allData.analytics;
    mockDataCache.audience = mockDataCache.allData.audience;
    mockDataCache.engagement = mockDataCache.allData.engagement;
    mockDataCache.contentSuggestions = mockDataCache.allData.contentSuggestions;
    mockDataCache.calendarData = mockDataCache.allData.calendarData;
    mockDataCache.user = mockDataCache.allData.user;
    mockDataCache.platforms = mockDataCache.allData.platforms;
    
    // Initialize social profiles from localStorage or with default data
    try {
      const storedProfiles = safeLocalStorage.getItem('socialProfiles');
      if (storedProfiles) {
        mockDataCache.socialProfiles = JSON.parse(storedProfiles);
      } else {
        mockDataCache.socialProfiles = [
          {
            id: '1',
            platform: 'instagram',
            username: 'socialconnect',
            profileUrl: 'https://instagram.com/socialconnect',
            connected: true,
            followers: 1250,
            lastUpdated: new Date().toISOString()
          },
          {
            id: '2',
            platform: 'twitter',
            username: 'socialconnect',
            profileUrl: 'https://twitter.com/socialconnect',
            connected: true,
            followers: 850,
            lastUpdated: new Date().toISOString()
          }
        ];
        safeLocalStorage.setItem('socialProfiles', JSON.stringify(mockDataCache.socialProfiles));
      }
    } catch (error) {
      console.error('Error initializing social profiles:', error);
      mockDataCache.socialProfiles = [];
    }
  }
  return mockDataCache;
};

// Get dashboard data
export const getDashboardData = async () => {
  await simulateApiDelay();
  if (!mockDataCache.dashboard) {
    initializeMockData();
  }
  return mockDataCache.dashboard;
};

// Get analytics data
export const getAnalyticsData = async () => {
  await simulateApiDelay();
  if (!mockDataCache.analytics) {
    initializeMockData();
  }
  return mockDataCache.analytics;
};

// Get audience data
export const getAudienceData = async () => {
  await simulateApiDelay();
  if (!mockDataCache.audience) {
    initializeMockData();
  }
  return mockDataCache.audience;
};

// Get engagement data
export const getEngagementData = async () => {
  await simulateApiDelay();
  if (!mockDataCache.engagement) {
    initializeMockData();
  }
  return mockDataCache.engagement;
};

// Get content suggestions
export const getContentSuggestions = async () => {
  await simulateApiDelay();
  if (!mockDataCache.contentSuggestions) {
    initializeMockData();
  }
  return mockDataCache.contentSuggestions;
};

// Get a single content suggestion
export const getContentSuggestion = async (id: string) => {
  await simulateApiDelay();
  if (!mockDataCache.contentSuggestions) {
    initializeMockData();
  }
  return mockDataCache.contentSuggestions?.find(suggestion => suggestion.id === id);
};

// Create a new content suggestion
export const createContentSuggestion = async (data: Partial<ContentSuggestion>) => {
  await simulateApiDelay();
  if (!mockDataCache.contentSuggestions) {
    initializeMockData();
  }
  
  const newSuggestion = mockDataGenerator.generateContentSuggestion();
  const mergedSuggestion = { ...newSuggestion, ...data };
  
  mockDataCache.contentSuggestions?.unshift(mergedSuggestion);
  return mergedSuggestion;
};

// Update a content suggestion
export const updateContentSuggestion = async (id: string, data: Partial<ContentSuggestion>) => {
  await simulateApiDelay();
  if (!mockDataCache.contentSuggestions) {
    initializeMockData();
  }
  
  const index = mockDataCache.contentSuggestions?.findIndex(suggestion => suggestion.id === id) ?? -1;
  if (index === -1) {
    throw new Error('Content suggestion not found');
  }
  
  const updatedSuggestion = { 
    ...mockDataCache.contentSuggestions![index], 
    ...data,
    updatedAt: new Date().toISOString()
  };
  
  mockDataCache.contentSuggestions![index] = updatedSuggestion;
  return updatedSuggestion;
};

// Delete a content suggestion
export const deleteContentSuggestion = async (id: string) => {
  await simulateApiDelay();
  if (!mockDataCache.contentSuggestions) {
    initializeMockData();
  }
  
  const index = mockDataCache.contentSuggestions?.findIndex(suggestion => suggestion.id === id) ?? -1;
  if (index === -1) {
    throw new Error('Content suggestion not found');
  }
  
  mockDataCache.contentSuggestions?.splice(index, 1);
  return { success: true };
};

// Get calendar data
export const getCalendarData = async (month?: number, year?: number) => {
  await simulateApiDelay();
  if (!mockDataCache.calendarData) {
    initializeMockData();
  }
  
  // If month and year are provided, regenerate data for that specific month
  if (month !== undefined && year !== undefined) {
    return mockDataGenerator.generateCalendarData(month, year);
  }
  
  return mockDataCache.calendarData;
};

// Get platform metrics
export const getPlatformMetrics = async (platform?: string) => {
  await simulateApiDelay();
  if (!mockDataCache.platforms) {
    initializeMockData();
  }
  
  if (platform) {
    return mockDataCache.platforms?.find(p => p.platform === platform);
  }
  
  return mockDataCache.platforms;
};

// Get current user
export const getCurrentUser = async () => {
  await simulateApiDelay();
  if (!mockDataCache.user) {
    initializeMockData();
  }
  return mockDataCache.user;
};

// Update user profile
export const updateUserProfile = async (data: Partial<User>) => {
  await simulateApiDelay();
  if (!mockDataCache.user) {
    initializeMockData();
  }
  
  mockDataCache.user = { 
    ...mockDataCache.user!, 
    ...data,
    updatedAt: new Date().toISOString()
  };
  
  return mockDataCache.user;
};

// Generate AI content suggestion
export const generateAiContentSuggestion = async (params: {
  platform: 'instagram' | 'twitter' | 'facebook' | 'linkedin' | 'all';
  topic: string;
  tone?: 'professional' | 'casual' | 'humorous' | 'inspirational';
  mediaType?: 'image' | 'video' | 'carousel' | 'text';
  targetAudience?: string;
  includeHashtags?: boolean;
}) => {
  await simulateApiDelay();
  // Simulate longer processing time for AI generation
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const suggestion = mockDataGenerator.generateContentSuggestion();
  
  // Override with provided parameters
  if (params.platform) suggestion.platform = params.platform;
  if (params.topic) suggestion.title = `${params.topic} for ${suggestion.platform}`;
  if (params.tone) {
    suggestion.content = `${suggestion.content} Created with a ${params.tone} tone.`;
  }
  if (params.mediaType) suggestion.mediaType = params.mediaType;
  
  return suggestion;
};

// Mock authentication functions
export const login = async (email: string, password: string) => {
  await simulateApiDelay();
  
  // For demo purposes, any email/password combination works
  const user = mockDataGenerator.generateUser();
  user.email = email;
  user.name = email.split('@')[0]; // Use part of email as name
  
  mockDataCache.user = user;
  return { user, token: 'mock-auth-token-' + Math.random().toString(36).substring(2) };
};

export const register = async (name: string, email: string, password: string) => {
  await simulateApiDelay();
  
  const user = mockDataGenerator.generateUser();
  user.name = name;
  user.email = email;
  
  mockDataCache.user = user;
  return { user, token: 'mock-auth-token-' + Math.random().toString(36).substring(2) };
};

export const logout = async () => {
  await simulateApiDelay();
  return { success: true };
};

// Social profile management functions
export const getSocialProfiles = async () => {
  await simulateApiDelay();
  if (!mockDataCache.socialProfiles) {
    initializeMockData();
  }
  return mockDataCache.socialProfiles;
};

export const addSocialProfile = async (profile: Omit<SocialProfile, 'id'>) => {
  await simulateApiDelay();
  if (!mockDataCache.socialProfiles) {
    initializeMockData();
  }
  
  const newProfile = {
    ...profile,
    id: Date.now().toString(),
  };
  
  mockDataCache.socialProfiles!.push(newProfile);
  
  // Persist to localStorage
  try {
    safeLocalStorage.setItem('socialProfiles', JSON.stringify(mockDataCache.socialProfiles));
  } catch (error) {
    console.error('Error saving social profiles to localStorage:', error);
  }
  
  return newProfile;
};

export const updateSocialProfile = async (id: string, data: Partial<SocialProfile>) => {
  await simulateApiDelay();
  if (!mockDataCache.socialProfiles) {
    initializeMockData();
  }
  
  const index = mockDataCache.socialProfiles!.findIndex(profile => profile.id === id);
  if (index === -1) {
    throw new Error('Social profile not found');
  }
  
  const updatedProfile = {
    ...mockDataCache.socialProfiles![index],
    ...data,
    lastUpdated: new Date().toISOString()
  };
  
  mockDataCache.socialProfiles![index] = updatedProfile;
  
  // Persist to localStorage
  try {
    safeLocalStorage.setItem('socialProfiles', JSON.stringify(mockDataCache.socialProfiles));
  } catch (error) {
    console.error('Error saving social profiles to localStorage:', error);
  }
  
  return updatedProfile;
};

export const deleteSocialProfile = async (id: string) => {
  await simulateApiDelay();
  if (!mockDataCache.socialProfiles) {
    initializeMockData();
  }
  
  const index = mockDataCache.socialProfiles!.findIndex(profile => profile.id === id);
  if (index === -1) {
    throw new Error('Social profile not found');
  }
  
  mockDataCache.socialProfiles!.splice(index, 1);
  
  // Persist to localStorage
  try {
    safeLocalStorage.setItem('socialProfiles', JSON.stringify(mockDataCache.socialProfiles));
  } catch (error) {
    console.error('Error saving social profiles to localStorage:', error);
  }
  
  return { success: true };
};

// Initialize mock data on import
initializeMockData();

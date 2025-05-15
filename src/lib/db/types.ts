import mongoose, { Document } from 'mongoose';

/**
 * User document type
 */
export interface UserDocument extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  emailVerified?: Date;
  role: 'user' | 'admin';
  accounts: {
    provider: string;
    providerAccountId: string;
    access_token?: string;
    refresh_token?: string;
    expires_at?: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Social Profile document type
 */
export interface SocialProfileDocument extends Document {
  userId: mongoose.Types.ObjectId | string;
  platform: string;
  username: string;
  profileUrl?: string;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiry?: Date;
  isConnected: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Social Metrics document type
 */
export interface SocialMetricsDocument extends Document {
  userId: mongoose.Types.ObjectId | string;
  profileId: mongoose.Types.ObjectId | string;
  platform: string;
  date: Date;
  followers: number;
  following: number;
  posts: number;
  likes: number;
  comments: number;
  shares: number;
  impressions: number;
  reach: number;
  engagement: number;
  engagementRate: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Content Suggestion document type
 */
export interface ContentSuggestionDocument extends Document {
  userId: mongoose.Types.ObjectId | string;
  platform: string;
  title: string;
  content: string;
  imagePrompt?: string;
  status: 'pending' | 'approved' | 'rejected' | 'published';
  scheduledDate?: Date;
  tags: string[];
  aiGenerated: boolean;
  metadata?: Map<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContentSuggestion {
  id?: string;
  userId?: string;
  platform: 'instagram' | 'twitter' | 'facebook' | 'linkedin' | 'all';
  title: string;
  content: string;
  mediaType: 'image' | 'video' | 'carousel' | 'text';
  suggestedTags: string[];
  tags?: string[];
  bestTimeToPost: Date | string;
  aiGeneratedScore: number;
  status: 'pending' | 'approved' | 'rejected' | 'published';
  engagement?: {
    likes: number;
    comments: number;
    shares: number;
    impressions: number;
  };
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface SocialMetrics {
  id?: string;
  userId?: string;
  platform: 'instagram' | 'twitter' | 'facebook' | 'linkedin';
  metrics: {
    followers: number;
    following?: number;
    posts: number;
    likes: number;
    comments: number;
    shares: number;
    impressions: number;
    reach: number;
    engagement: number;
  };
  dailyStats: {
    date: Date | string;
    followers: number;
    engagement: number;
    impressions: number;
    reach: number;
  }[];
  platformAccountId: string;
  platformUsername: string;
  lastUpdated: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface User {
  id?: string;
  name: string;
  email: string;
  image?: string;
  profileImage?: string;
  emailVerified?: Date | string;
  role: 'user' | 'admin';
  accounts: {
    provider: string;
    providerAccountId: string;
    access_token?: string;
    refresh_token?: string;
    expires_at?: number;
  }[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

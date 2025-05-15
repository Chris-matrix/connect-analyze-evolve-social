export interface ContentSuggestion {
  id?: string;
  userId: string;
  platform: 'instagram' | 'twitter' | 'facebook' | 'linkedin' | 'tiktok' | 'all';
  title: string;
  content: string;
  mediaType?: 'image' | 'video' | 'carousel' | 'text';
  suggestedTags?: string[];
  tags?: string[];
  bestTimeToPost?: Date | string;
  aiGeneratedScore?: number;
  aiGenerated?: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'published';
  imagePrompt?: string;
  scheduledDate?: Date | string;
  metadata?: Record<string, string> | Map<string, string>;
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
  userId: string;
  profileId?: string;
  platform: 'instagram' | 'twitter' | 'facebook' | 'linkedin' | 'tiktok';
  date?: Date | string;
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
  metrics?: {
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
  dailyStats?: {
    date: Date | string;
    followers: number;
    engagement: number;
    impressions: number;
    reach: number;
  }[];
  platformAccountId?: string;
  platformUsername?: string;
  lastUpdated?: Date | string;
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

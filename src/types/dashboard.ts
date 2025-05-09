// Dashboard data interfaces
export interface DashboardData {
  metrics: {
    totalFollowers: number;
    followerGrowth: number;
    totalEngagement: number;
    engagementGrowth: number;
    totalImpressions: number;
    impressionGrowth: number;
    totalReach: number;
    reachGrowth: number;
  };
  platformMetrics: SocialMetrics[];
  recentSuggestions: ContentSuggestion[];
}

// Analytics data interfaces
export interface AnalyticsData {
  platformPerformance: PlatformPerformance[];
  engagementData: EngagementDataPoint[];
  audienceGrowth: AudienceGrowthData[];
}

export interface PlatformPerformance {
  platform: string;
  engagement: number;
  reach: number;
}

export interface EngagementDataPoint {
  date: string;
  likes: number;
  comments: number;
  shares: number;
}

export interface AudienceGrowthData {
  month: string;
  instagram: number;
  twitter: number;
  facebook: number;
  linkedin: number;
}

// Audience data interfaces
export interface AudienceData {
  totalFollowers: number;
  activeFollowers: number;
  activePercentage: number;
  topLocation: string;
  topLocationPercentage: number;
  growthRate: number;
  demographics: PieChartData[];
  geographics: PieChartData[];
  interests: PieChartData[];
  engagement: PieChartData[];
}

export interface PieChartData {
  name: string;
  value: number;
}

// Engagement data interfaces
export interface EngagementData {
  totalEngagements: number;
  totalComments: number;
  responseRate: number;
  avgResponseTime: number;
  sentimentScore: number;
  recentComments: CommentData[];
  engagementTrends: EngagementTrend[];
  platformEngagement: PlatformEngagement[];
}

export interface CommentData {
  user: string;
  text: string;
  platform: string;
  time: string;
  type: 'comment' | 'like' | 'share' | 'love';
  priority: 'high' | 'medium' | 'low';
}

export interface EngagementTrend {
  date: string;
  likes: number;
  comments: number;
  shares: number;
}

export interface PlatformEngagement {
  platform: string;
  engagement: number;
  responseRate: number;
}

// Import types from content.ts to avoid circular dependencies
import { ContentSuggestion, SocialMetrics } from './content';

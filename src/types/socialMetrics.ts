/**
 * Social Metrics type definition
 */
export interface SocialMetrics {
  id: string;
  userId: string;
  profileId: string;
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

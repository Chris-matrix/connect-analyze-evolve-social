// Define the SocialProfile interface in a dedicated type file
export interface SocialProfile {
  id: string;
  userId: string;
  platform: 'instagram' | 'twitter' | 'facebook' | 'linkedin' | 'tiktok';
  username: string;
  profileUrl: string;
  connected: boolean;
  isConnected?: boolean; // For compatibility with database model
  followers: number;
  lastUpdated: string;
  createdAt?: Date;
  updatedAt?: Date;
}

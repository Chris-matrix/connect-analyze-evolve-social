// Define the SocialProfile interface in a dedicated type file
export interface SocialProfile {
  id: string;
  platform: 'instagram' | 'twitter' | 'facebook' | 'linkedin';
  username: string;
  profileUrl: string;
  connected: boolean;
  followers: number;
  lastUpdated: string;
}

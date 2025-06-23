import React, { useEffect, useState } from 'react';
import UserProfile from '@/components/auth/UserProfile';
import { useAuth } from '@/lib/auth/use-auth';
import { Navigate } from 'react-router-dom';
import * as mockApi from '@/lib/mock-data/mock-api';
import { User } from '@/types/content';

// Extend the User type to include followers
interface UserWithFollowers extends User {
  followers?: number;
  following?: number;
  socialProfiles?: Array<{
    platform: string;
    username: string;
    followers: number;
  }>;
}

const Profile: React.FC = () => {
  const { user: authUser, loading } = useAuth();
  const [user, setUser] = useState<UserWithFollowers | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!authUser) return;
      
      try {
        // Get the current user data
        const userData = await mockApi.getCurrentUser();
        
        // Get social profiles for the user
        const socialProfiles = await mockApi.getSocialProfiles();
        
        // Calculate total followers across all platforms
        const totalFollowers = socialProfiles?.reduce(
          (sum, profile) => sum + (profile?.followers || 0), 0
        ) || 0;
        
        // Update user data with followers and social profiles
        setUser({
          ...userData,
          followers: totalFollowers,
          following: Math.floor(Math.random() * 500) + 50, // Random following count for demo
          socialProfiles: socialProfiles?.map(profile => ({
            platform: profile.platform,
            username: profile.username,
            followers: profile.followers || 0
          }))
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Fall back to auth user data if there's an error
        setUser({
          ...authUser,
          followers: 0,
          following: 0,
          socialProfiles: []
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [authUser]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }


  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  // Ensure user is not null before rendering UserProfile
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
          <p>Unable to load profile data. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <UserProfile />
    </div>
  );
};

export default Profile;

import React, { useEffect, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/auth/use-auth';
import { User } from '@/types/content';
import ErrorBoundary from '@/components/ErrorBoundary';
import { LoadingSpinner } from '@/components/LoadingSpinner';

// Dynamically import the UserProfile component with SSR disabled
const UserProfile = dynamic(
  () => import('@/components/auth/UserProfile'),
  { ssr: false }
);

// Mock data for server-side rendering
const mockSocialProfiles = [
  {
    id: '1',
    platform: 'instagram',
    username: 'socialconnect',
    followers: 1250
  },
  {
    id: '2',
    platform: 'twitter',
    username: 'socialconnect',
    followers: 850
  }
];

// Error boundary fallback component
const ProfileErrorFallback = () => (
  <div className="p-8 text-center">
    <h2 className="text-xl font-semibold mb-2">Error loading profile</h2>
    <p className="text-muted-foreground">
      We couldn't load your profile. Please try again later.
    </p>
  </div>
);

// Loading component for Suspense
const ProfileLoading = () => (
  <div className="min-h-[80vh] flex items-center justify-center">
    <LoadingSpinner text="Loading your profile..." />
  </div>
);

// Extend the User type to include followers
interface SocialProfileData {
  platform: string;
  username: string;
  followers: number;
}

interface UserWithFollowers extends User {
  followers: number;
  following: number;
  socialProfiles: SocialProfileData[];
}

// Default empty profile data
const defaultProfileData: UserWithFollowers = {
  id: 'guest',
  name: 'Guest User',
  email: 'guest@example.com',
  role: 'user',
  followers: 0,
  following: 0,
  socialProfiles: []
};

// Check if we're running on the client side
const isClient = typeof window !== 'undefined';

const Profile: React.FC = () => {
  const router = useRouter();
  const { user: authUser, loading: authLoading } = useAuth();
  const [user, setUser] = useState<UserWithFollowers>(defaultProfileData);
  const [isLoading, setIsLoading] = useState(true);
  const [isClientSide, setIsClientSide] = useState(false);

  // Set client-side flag on mount
  useEffect(() => {
    setIsClientSide(true);
  }, []);

  useEffect(() => {
    // Skip if not client-side or no auth user
    if (!isClientSide || !authUser) return;

    const fetchUserData = async () => {
      try {
        // Get the current user data
        const userData = await import('@/lib/mock-data/mock-api')
          .then(api => api.getCurrentUser())
          .catch(() => ({}));

        // Get social profiles for the user
        let socialProfiles = [...mockSocialProfiles];
        
        // Only try to fetch from API if we're on the client side
        if (isClientSide) {
          try {
            const api = await import('@/lib/mock-data/mock-api');
            const profiles = await api.getSocialProfiles();
            if (Array.isArray(profiles)) {
              socialProfiles = profiles;
            }
          } catch (error) {
            console.error('Error fetching social profiles:', error);
          }
        }
        
        // Process profiles with proper error handling
        const validProfiles = socialProfiles
          .filter(profile => profile && typeof profile === 'object')
          .map(profile => ({
            platform: String(profile?.platform || 'unknown'),
            username: String(profile?.username || ''),
            followers: Number(profile?.followers || 0)
          }));
        
        // Calculate total followers safely
        const totalFollowers = validProfiles.reduce(
          (sum, profile) => sum + (Number.isFinite(profile.followers) ? profile.followers : 0),
          0
        );
        
        // Update user data with followers and social profiles
        setUser({
          ...defaultProfileData,
          ...userData,
          followers: totalFollowers,
          following: Math.floor(Math.random() * 500) + 50, // Random following count for demo
          socialProfiles: validProfiles
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

  // Show loading state during initial load or auth check
  if (!isClientSide || authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Handle unauthenticated users on client side
  if (isClientSide && !authUser) {
    router.push('/login');
    return null;
  }

  // Ensure we have user data - only needed if we're going to use displayUser
  // const displayUser = user || defaultProfileData;

  return (
    <div className="container mx-auto py-8 px-4">
      <ErrorBoundary fallback={<ProfileErrorFallback />}>
        <Suspense fallback={<ProfileLoading />}>
          {isClientSide ? (
            <UserProfile />
          ) : (
            <ProfileLoading />
          )}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default Profile;

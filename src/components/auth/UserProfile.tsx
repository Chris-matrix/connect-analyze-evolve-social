import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import * as mockApi from '@/lib/mock-data/mock-api';
import { User } from '@/types/content';
import { useAuth } from '@/lib/auth/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

const UserProfile: React.FC = () => {
  const { user: authUser, updateProfile, error, loading } = useAuth();
  const [user, setUser] = useState<User | null>(authUser);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [socialProfiles, setSocialProfiles] = useState<Array<{
    platform: string;
    username: string;
    followers: number;
  }>>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!authUser) return;
      
      try {
        // Get social profiles for the user
        const profiles = await mockApi.getSocialProfiles();
        
        // Calculate total followers across all platforms
        const totalFollowers = profiles?.reduce(
          (sum, profile) => sum + (profile?.followers || 0), 0
        ) || 0;
        
        setFollowers(totalFollowers);
        setFollowing(Math.floor(Math.random() * 500) + 50); // Random following count for demo
        
        setSocialProfiles(profiles?.map(profile => ({
          platform: profile.platform,
          username: profile.username,
          followers: profile.followers || 0
        })) || []);
        
        // Update user state with any missing data
        setUser({
          ...authUser
        });
        setFollowers(totalFollowers);
        setFollowing(Math.floor(Math.random() * 500) + 50);
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Fall back to auth user data if there's an error
        setUser(authUser);
      }
    };
    
    fetchUserData();
  }, [authUser]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = async (data: ProfileFormValues) => {
    try {
      await updateProfile(data);
      setSuccessMessage('Profile updated successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    try {
      // Use a separate method for password update or modify auth context to handle this case
      // For now, we'll log the intent but this should be implemented properly
      console.log('Password update requested with new password');
      
      // Mock successful update for demo purposes
      setSuccessMessage('Password updated successfully');
      resetPassword();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Password update error:', error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const connectedAccounts = user?.accounts || [];
  
  // Ensure we have safe default values
  const safeUser = user || {
    id: '',
    name: 'User',
    email: '',
    role: 'user',
    profileImage: '',
    image: ''
  } as User;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="accounts">Social Accounts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your account profile information and email
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={safeUser.profileImage || safeUser.image} alt={safeUser.name} />
                    <AvatarFallback>
                      {safeUser.name
                        ?.split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">{safeUser.name}</h2>
                    <p className="text-muted-foreground">{safeUser.email}</p>
                    <div className="flex space-x-4 mt-2">
                      <span className="text-sm text-muted-foreground">
                        <span className="font-semibold">{followers.toLocaleString()}</span> Followers
                      </span>
                      <span className="text-sm text-muted-foreground">
                        <span className="font-semibold">{following.toLocaleString()}</span> Following
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      {...registerProfile('name')}
                    />
                    {profileErrors.name && (
                      <p className="text-sm text-red-500">{profileErrors.name.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      {...registerProfile('email')}
                    />
                    {profileErrors.email && (
                      <p className="text-sm text-red-500">{profileErrors.email.message}</p>
                    )}
                  </div>
                </div>

                {successMessage && (
                  <Alert variant="default">
                    <AlertDescription>{successMessage}</AlertDescription>
                  </Alert>
                )}

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="password" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to maintain account security
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="••••••••"
                    {...registerPassword('currentPassword')}
                  />
                  {passwordErrors.currentPassword && (
                    <p className="text-sm text-red-500">{passwordErrors.currentPassword.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="••••••••"
                    {...registerPassword('newPassword')}
                  />
                  {passwordErrors.newPassword && (
                    <p className="text-sm text-red-500">{passwordErrors.newPassword.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    {...registerPassword('confirmPassword')}
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="text-sm text-red-500">{passwordErrors.confirmPassword.message}</p>
                  )}
                </div>

                {successMessage && (
                  <Alert variant="default">
                    <AlertDescription>{successMessage}</AlertDescription>
                  </Alert>
                )}

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="accounts" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Connected Social Accounts</CardTitle>
              <CardDescription>
                Connect your social media accounts to enable analytics and management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Facebook className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Facebook</h3>
                      <p className="text-sm text-muted-foreground">
                        {connectedAccounts.find(a => a.provider === 'facebook') 
                          ? 'Connected' 
                          : 'Not connected'}
                      </p>
                    </div>
                  </div>
                  <Button variant={connectedAccounts.find(a => a.provider === 'facebook') ? "destructive" : "default"}>
                    {connectedAccounts.find(a => a.provider === 'facebook') ? 'Disconnect' : 'Connect'}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-pink-100 p-2 rounded-full">
                      <Instagram className="h-6 w-6 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Instagram</h3>
                      <p className="text-sm text-muted-foreground">
                        {connectedAccounts.find(a => a.provider === 'instagram') 
                          ? 'Connected' 
                          : 'Not connected'}
                      </p>
                    </div>
                  </div>
                  <Button variant={connectedAccounts.find(a => a.provider === 'instagram') ? "destructive" : "default"}>
                    {connectedAccounts.find(a => a.provider === 'instagram') ? 'Disconnect' : 'Connect'}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Twitter className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">Twitter</h3>
                      <p className="text-sm text-muted-foreground">
                        {connectedAccounts.find(a => a.provider === 'twitter') 
                          ? 'Connected' 
                          : 'Not connected'}
                      </p>
                    </div>
                  </div>
                  <Button variant={connectedAccounts.find(a => a.provider === 'twitter') ? "destructive" : "default"}>
                    {connectedAccounts.find(a => a.provider === 'twitter') ? 'Disconnect' : 'Connect'}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Linkedin className="h-6 w-6 text-blue-700" />
                    </div>
                    <div>
                      <h3 className="font-medium">LinkedIn</h3>
                      <p className="text-sm text-muted-foreground">
                        {connectedAccounts.find(a => a.provider === 'linkedin') 
                          ? 'Connected' 
                          : 'Not connected'}
                      </p>
                    </div>
                  </div>
                  <Button variant={connectedAccounts.find(a => a.provider === 'linkedin') ? "destructive" : "default"}>
                    {connectedAccounts.find(a => a.provider === 'linkedin') ? 'Disconnect' : 'Connect'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;

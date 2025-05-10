
import React, { useState, useEffect } from 'react';
import { Instagram, Twitter, Facebook, Linkedin, Plus, Trash2, Edit, Check, X, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { SocialProfile } from '@/types/socialProfile';
import * as socialProfilesApi from '@/lib/api/socialProfilesApi';
import { useAuth } from '@/lib/auth/use-auth';

const SocialProfiles = () => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<SocialProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<SocialProfile | null>(null);
  
  // Form state
  const [formPlatform, setFormPlatform] = useState<'instagram' | 'twitter' | 'facebook' | 'linkedin'>('instagram');
  const [formUsername, setFormUsername] = useState('');
  const [formProfileUrl, setFormProfileUrl] = useState('');
  const [formConnected, setFormConnected] = useState(true);
  
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        // Only fetch profiles if user is logged in
        if (user) {
          const data = await socialProfilesApi.getSocialProfiles();
          setProfiles(data || []);
        }
      } catch (err) {
        console.error('Error fetching profiles:', err);
        setError('Failed to load social profiles');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfiles();
  }, [user]);  // Re-fetch when user changes
  
  const handleAddProfile = async () => {
    try {
      setLoading(true);
      const newProfile = await socialProfilesApi.addSocialProfile({
        platform: formPlatform,
        username: formUsername,
        profileUrl: formProfileUrl,
        connected: formConnected,
        followers: 0,
        lastUpdated: new Date().toISOString()
      });
      
      setProfiles([...profiles, newProfile]);
      resetForm();
      setIsAddDialogOpen(false);
    } catch (err) {
      console.error('Error adding profile:', err);
      setError('Failed to add social profile');
    } finally {
      setLoading(false);
    }
  };
  
  const handleEditProfile = async () => {
    if (!currentProfile) return;
    
    try {
      setLoading(true);
      const updatedProfile = await socialProfilesApi.updateSocialProfile(currentProfile.id, {
        platform: formPlatform,
        username: formUsername,
        profileUrl: formProfileUrl,
        connected: formConnected
      });
      
      const updatedProfiles = profiles.map(profile => 
        profile.id === currentProfile.id ? updatedProfile : profile
      );
      
      setProfiles(updatedProfiles);
      resetForm();
      setIsEditDialogOpen(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update social profile');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteProfile = async (id: string) => {
    try {
      setLoading(true);
      await socialProfilesApi.deleteSocialProfile(id);
      setProfiles(profiles.filter(profile => profile.id !== id));
    } catch (err) {
      console.error('Error deleting profile:', err);
      setError('Failed to delete social profile');
    } finally {
      setLoading(false);
    }
  };
  
  const openEditDialog = (profile: SocialProfile) => {
    setCurrentProfile(profile);
    setFormPlatform(profile.platform);
    setFormUsername(profile.username);
    setFormProfileUrl(profile.profileUrl);
    setFormConnected(profile.connected);
    setIsEditDialogOpen(true);
  };
  
  const resetForm = () => {
    setFormPlatform('instagram');
    setFormUsername('');
    setFormProfileUrl('');
    setFormConnected(true);
    setCurrentProfile(null);
  };
  
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="h-6 w-6 text-pink-500" />;
      case 'twitter':
        return <Twitter className="h-6 w-6 text-blue-400" />;
      case 'facebook':
        return <Facebook className="h-6 w-6 text-blue-600" />;
      case 'linkedin':
        return <Linkedin className="h-6 w-6 text-blue-700" />;
      default:
        return <Instagram className="h-6 w-6" />;
    }
  };
  
  const getProfileForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="platform">Platform</Label>
        <Select 
          value={formPlatform}
          onValueChange={(value) => setFormPlatform(value as 'instagram' | 'twitter' | 'facebook' | 'linkedin')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="twitter">Twitter</SelectItem>
            <SelectItem value="facebook">Facebook</SelectItem>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={formUsername}
          onChange={(e) => setFormUsername(e.target.value)}
          placeholder="e.g., yourcompany"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="profileUrl">Profile URL</Label>
        <Input
          id="profileUrl"
          value={formProfileUrl}
          onChange={(e) => setFormProfileUrl(e.target.value)}
          placeholder="e.g., https://instagram.com/yourcompany"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="connected"
          checked={formConnected}
          onCheckedChange={setFormConnected}
        />
        <Label htmlFor="connected">Connected</Label>
      </div>
    </div>
  );
  
  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <h1 className="text-3xl font-bold tracking-tight">Social Profiles</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="space-y-6 p-6">
        <h1 className="text-3xl font-bold tracking-tight">Social Profiles</h1>
        <Alert>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Social Profiles</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Profile
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Social Profile</DialogTitle>
              <DialogDescription>
                Connect a new social media profile to track its performance.
              </DialogDescription>
            </DialogHeader>
            {getProfileForm()}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddProfile} disabled={!formUsername || !formProfileUrl}>Add Profile</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {profiles.length === 0 ? (
        <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
          <div className="text-center">
            <Plus className="h-16 w-16 mx-auto text-muted-foreground" />
            <p className="mt-4 text-lg font-medium">No Social Profiles</p>
            <p className="text-sm text-muted-foreground mb-4">Add your first social media profile to get started</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>Add Profile</Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <Card key={profile.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    {getPlatformIcon(profile.platform)}
                    <div>
                      <CardTitle className="text-lg">{profile.username}</CardTitle>
                      <CardDescription>{profile.platform.charAt(0).toUpperCase() + profile.platform.slice(1)}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={profile.connected ? "default" : "outline"}>
                    {profile.connected ? "Connected" : "Disconnected"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Followers</span>
                    <span className="font-medium">{profile.followers.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Last Updated</span>
                    <span className="text-sm">{new Date(profile.lastUpdated).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(profile)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleDeleteProfile(profile.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <a href={profile.profileUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Social Profile</DialogTitle>
            <DialogDescription>
              Update your social media profile information.
            </DialogDescription>
          </DialogHeader>
          {getProfileForm()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditProfile} disabled={!formUsername || !formProfileUrl}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SocialProfiles;

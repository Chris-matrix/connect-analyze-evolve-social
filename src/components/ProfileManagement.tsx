
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Linkedin, Twitter, Youtube, Plus } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from '@/lib/utils';

type SocialProfile = {
  platform: string;
  username: string;
  icon: React.ReactNode;
  color: string;
  active: boolean;
};

const profiles: SocialProfile[] = [
  { 
    platform: 'Facebook', 
    username: 'yourcompany', 
    icon: <Facebook className="h-4 w-4" />, 
    color: 'bg-blue-600',
    active: true
  },
  { 
    platform: 'Instagram', 
    username: 'yourcompany', 
    icon: <Instagram className="h-4 w-4" />, 
    color: 'bg-pink-600',
    active: true
  },
  { 
    platform: 'Twitter', 
    username: 'yourcompany', 
    icon: <Twitter className="h-4 w-4" />, 
    color: 'bg-sky-500',
    active: true
  },
  { 
    platform: 'LinkedIn', 
    username: 'your-company', 
    icon: <Linkedin className="h-4 w-4" />, 
    color: 'bg-blue-700',
    active: false
  },
  { 
    platform: 'YouTube', 
    username: 'YourChannel', 
    icon: <Youtube className="h-4 w-4" />, 
    color: 'bg-red-600',
    active: false
  },
];

const ProfileManagement: React.FC = () => {
  return (
    <Card className="col-span-12 lg:col-span-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Connected Profiles</CardTitle>
        <Button size="sm" variant="outline" className="h-8 gap-1">
          <Plus className="h-3.5 w-3.5" />
          <span>Add</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {profiles.map((profile) => (
            <div key={profile.platform} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", profile.color)}>
                  {profile.icon}
                </div>
                <div>
                  <p className="text-sm font-medium">{profile.platform}</p>
                  <p className="text-xs text-muted-foreground">@{profile.username}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={profile.active ? "default" : "outline"} className="text-xs">
                  {profile.active ? 'Active' : 'Inactive'}
                </Badge>
                <Switch checked={profile.active} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileManagement;

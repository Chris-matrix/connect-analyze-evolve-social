
import React from 'react';
import { Instagram } from 'lucide-react';

const SocialProfiles = () => {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold tracking-tight">Social Profiles</h1>
      
      <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
        <div className="text-center">
          <Instagram className="h-16 w-16 mx-auto text-muted-foreground" />
          <p className="mt-4 text-lg font-medium">Social Profiles Coming Soon</p>
          <p className="text-sm text-muted-foreground">Connect and manage your social media accounts</p>
        </div>
      </div>
    </div>
  );
};

export default SocialProfiles;

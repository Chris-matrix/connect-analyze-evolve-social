
import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      
      <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
        <div className="text-center">
          <SettingsIcon className="h-16 w-16 mx-auto text-muted-foreground" />
          <p className="mt-4 text-lg font-medium">Settings Coming Soon</p>
          <p className="text-sm text-muted-foreground">Configure your account and preferences</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;

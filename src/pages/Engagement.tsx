
import React from 'react';
import { MessageSquare } from 'lucide-react';

const Engagement = () => {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold tracking-tight">Engagement</h1>
      
      <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
        <div className="text-center">
          <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground" />
          <p className="mt-4 text-lg font-medium">Engagement Tools Coming Soon</p>
          <p className="text-sm text-muted-foreground">Monitor and respond to comments, messages, and mentions</p>
        </div>
      </div>
    </div>
  );
};

export default Engagement;

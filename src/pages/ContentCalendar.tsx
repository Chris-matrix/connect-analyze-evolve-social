
import React from 'react';
import { Calendar } from 'lucide-react';

const ContentCalendar = () => {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold tracking-tight">Content Calendar</h1>
      
      <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
        <div className="text-center">
          <Calendar className="h-16 w-16 mx-auto text-muted-foreground" />
          <p className="mt-4 text-lg font-medium">Content Calendar Coming Soon</p>
          <p className="text-sm text-muted-foreground">Plan and schedule your social media content</p>
        </div>
      </div>
    </div>
  );
};

export default ContentCalendar;

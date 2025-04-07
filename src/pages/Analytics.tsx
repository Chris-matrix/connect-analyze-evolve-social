
import React from 'react';
import { BarChart3 } from 'lucide-react';

const Analytics = () => {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
      
      <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
        <div className="text-center">
          <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground" />
          <p className="mt-4 text-lg font-medium">Analytics Dashboard Coming Soon</p>
          <p className="text-sm text-muted-foreground">Detailed metrics and insights for your social media performance</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

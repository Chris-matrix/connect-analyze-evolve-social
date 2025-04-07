
import React from 'react';
import { Users } from 'lucide-react';

const Audience = () => {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold tracking-tight">Audience</h1>
      
      <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
        <div className="text-center">
          <Users className="h-16 w-16 mx-auto text-muted-foreground" />
          <p className="mt-4 text-lg font-medium">Audience Insights Coming Soon</p>
          <p className="text-sm text-muted-foreground">Understand your followers and target audience</p>
        </div>
      </div>
    </div>
  );
};

export default Audience;

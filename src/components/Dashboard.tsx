
import React from 'react';
import InterestGalaxy from './InterestGalaxy';
import MoodFilter from './MoodFilter';
import TimeWellSpent from './TimeWellSpent';
import ContextualDiscussions from './ContextualDiscussions';
import AnalyticsCard from './AnalyticsCard';
import { Users, ThumbsUp, MessageSquare, Share2 } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsCard 
          title="Total Followers" 
          value="24,562" 
          change={{ value: 12, trend: 'up' }}
          icon={<Users className="h-5 w-5" />}
        />
        <AnalyticsCard 
          title="Likes" 
          value="8,649" 
          change={{ value: 8, trend: 'up' }}
          icon={<ThumbsUp className="h-5 w-5" />}
        />
        <AnalyticsCard 
          title="Comments" 
          value="1,325" 
          change={{ value: 2, trend: 'down' }}
          icon={<MessageSquare className="h-5 w-5" />}
        />
        <AnalyticsCard 
          title="Shares" 
          value="642" 
          change={{ value: 15, trend: 'up' }}
          icon={<Share2 className="h-5 w-5" />}
          variant="gradient"
        />
      </div>
      
      <div className="grid grid-cols-12 gap-6">
        <InterestGalaxy />
        <TimeWellSpent />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <MoodFilter />
        <ContextualDiscussions />
      </div>
    </div>
  );
};

export default Dashboard;

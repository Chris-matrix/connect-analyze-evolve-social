
import React, { useState, useEffect } from 'react';
import InterestGalaxy from './InterestGalaxy';
import MoodFilter from './MoodFilter';
import TimeWellSpent from './TimeWellSpent';
import ContextualDiscussions from './ContextualDiscussions';
import AnalyticsCard from './AnalyticsCard';
import { Users, ThumbsUp, MessageSquare, Share2, Loader2 } from 'lucide-react';
import * as mockApi from '@/lib/mock-data/mock-api';
import { DashboardData } from '@/types/dashboard';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await mockApi.getDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading dashboard data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>{error}</p>
        <button 
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  const { metrics, platformMetrics } = dashboardData;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsCard 
          title="Total Followers" 
          value={metrics.totalFollowers.toLocaleString()} 
          change={{ value: metrics.followerGrowth, trend: metrics.followerGrowth >= 0 ? 'up' : 'down' }}
          icon={<Users className="h-5 w-5" />}
        />
        <AnalyticsCard 
          title="Engagement Rate" 
          value={`${metrics.totalEngagement.toFixed(2)}%`} 
          change={{ value: metrics.engagementGrowth, trend: metrics.engagementGrowth >= 0 ? 'up' : 'down' }}
          icon={<ThumbsUp className="h-5 w-5" />}
        />
        <AnalyticsCard 
          title="Impressions" 
          value={metrics.totalImpressions.toLocaleString()} 
          change={{ value: metrics.impressionGrowth, trend: metrics.impressionGrowth >= 0 ? 'up' : 'down' }}
          icon={<MessageSquare className="h-5 w-5" />}
        />
        <AnalyticsCard 
          title="Reach" 
          value={metrics.totalReach.toLocaleString()} 
          change={{ value: metrics.reachGrowth, trend: metrics.reachGrowth >= 0 ? 'up' : 'down' }}
          icon={<Share2 className="h-5 w-5" />}
          variant="gradient"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TimeWellSpent data={platformMetrics} />
          <ContextualDiscussions suggestions={dashboardData.recentSuggestions} />
        </div>
        <div className="space-y-6">
          <InterestGalaxy platforms={platformMetrics} />
          <MoodFilter />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, PieChart } from 'lucide-react';
import FollowerGrowthChart from './FollowerGrowthChart';

interface SocialMetrics {
  platform: string;
  metrics: {
    followers: number;
    engagement: number;
    impressions: number;
    reach: number;
  };
  dailyData: Array<{
    date: string;
    followers: number;
    engagement: number;
    impressions: number;
    reach: number;
  }>;
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<SocialMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram', 'twitter', 'facebook', 'linkedin']);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/metrics?timeRange=${timeRange}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch metrics');
        }
        
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMetrics();
  }, [timeRange]);

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  // Calculate total metrics across all platforms
  const totalMetrics = metrics.reduce(
    (acc, curr) => {
      if (selectedPlatforms.includes(curr.platform)) {
        acc.followers += curr.metrics.followers;
        acc.engagement += curr.metrics.engagement;
        acc.impressions += curr.metrics.impressions;
        acc.reach += curr.metrics.reach;
      }
      return acc;
    },
    { followers: 0, engagement: 0, impressions: 0, reach: 0 }
  );

  // Filter metrics for selected platforms
  const filteredMetrics = metrics.filter(metric => 
    selectedPlatforms.includes(metric.platform)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Your social media performance at a glance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs defaultValue={timeRange} onValueChange={setTimeRange}>
            <TabsList>
              <TabsTrigger value="7d">7d</TabsTrigger>
              <TabsTrigger value="30d">30d</TabsTrigger>
              <TabsTrigger value="90d">90d</TabsTrigger>
              <TabsTrigger value="1y">1y</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Followers</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? 'Loading...' : totalMetrics.followers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all connected platforms
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Engagement Rate</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? 'Loading...' : `${(totalMetrics.engagement * 100).toFixed(2)}%`}
            </div>
            <p className="text-xs text-muted-foreground">
              Interactions per impression
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? 'Loading...' : totalMetrics.impressions.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              In the selected time period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? 'Loading...' : totalMetrics.reach.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Unique accounts reached
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Follower Growth</CardTitle>
            <CardDescription>
              Track your follower growth over time
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <FollowerGrowthChart 
              data={filteredMetrics} 
              timeRange={timeRange}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Platform Breakdown</CardTitle>
            <CardDescription>
              Compare metrics across platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex h-[200px] items-center justify-center">
                  Loading platform data...
                </div>
              ) : (
                metrics.map((metric) => (
                  <div key={metric.platform} className="flex items-center">
                    <div className="mr-2 h-4 w-4">
                      <input
                        type="checkbox"
                        id={`platform-${metric.platform}`}
                        checked={selectedPlatforms.includes(metric.platform)}
                        onChange={() => togglePlatform(metric.platform)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </div>
                    <label
                      htmlFor={`platform-${metric.platform}`}
                      className="flex flex-1 items-center justify-between"
                    >
                      <span className="capitalize">{metric.platform}</span>
                      <span className="font-medium">
                        {metric.metrics.followers.toLocaleString()} followers
                      </span>
                    </label>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

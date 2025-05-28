'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

interface FollowerGrowthChartProps {
  data: SocialMetrics[];
  timeRange: string;
  isLoading: boolean;
}

// Define colors for each platform
const platformColors = {
  instagram: '#E1306C',
  twitter: '#1DA1F2',
  facebook: '#4267B2',
  linkedin: '#0077B5',
};

export default function FollowerGrowthChart({ data, timeRange, isLoading }: FollowerGrowthChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (data.length === 0) return;

    // Create a map to store follower counts by date
    const followersByDate = new Map();

    // Process each platform's data
    data.forEach(platformData => {
      const { platform, dailyData } = platformData;
      
      dailyData.forEach(day => {
        const date = new Date(day.date).toISOString().split('T')[0];
        
        if (!followersByDate.has(date)) {
          followersByDate.set(date, { date });
        }
        
        const dateEntry = followersByDate.get(date);
        dateEntry[platform] = day.followers;
      });
    });

    // Convert map to array and sort by date
    const sortedData = Array.from(followersByDate.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    setChartData(sortedData);
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        Loading chart data...
      </div>
    );
  }

  if (data.length === 0 || chartData.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        No data available for the selected time range.
      </div>
    );
  }

  // Format date for display based on time range
  const formatDate = (date: string) => {
    const d = new Date(date);
    
    switch (timeRange) {
      case '7d':
        return d.toLocaleDateString(undefined, { weekday: 'short' });
      case '30d':
        return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      case '90d':
        return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      case '1y':
        return d.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
      default:
        return d.toLocaleDateString();
    }
  };

  // Format follower counts for tooltip
  const formatFollowers = (value: number) => {
    return value.toLocaleString();
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#888" opacity={0.2} />
        <XAxis 
          dataKey="date" 
          tickFormatter={formatDate} 
          stroke="#888"
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          tickFormatter={(value) => {
            if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
            if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
            return value;
          }}
          stroke="#888"
          tick={{ fontSize: 12 }}
        />
        <Tooltip 
          formatter={formatFollowers}
          labelFormatter={formatDate}
        />
        <Legend />
        {data.map(({ platform }) => (
          <Line
            key={platform}
            type="monotone"
            dataKey={platform}
            name={platform.charAt(0).toUpperCase() + platform.slice(1)}
            stroke={platformColors[platform as keyof typeof platformColors] || '#8884d8'}
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

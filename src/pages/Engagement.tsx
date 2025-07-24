
'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { MessageSquare, Loader2, ThumbsUp, Share2, Heart, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EngagementData, CommentData } from '@/types/dashboard';

// Dynamically import charts to avoid SSR issues
const EngagementCharts = dynamic(
  () => import('@/components/engagement/EngagementCharts'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }
);

// Dynamically import mockApi to avoid SSR issues
let mockApi: any;
if (typeof window !== 'undefined') {
  mockApi = require('@/lib/mock-data/mock-api');
}

const Engagement = () => {
  const [loading, setLoading] = useState(true);
  const [engagementData, setEngagementData] = useState<EngagementData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    const fetchEngagementData = async () => {
      if (!mockApi) return;
      
      try {
        setLoading(true);
        console.log('Fetching engagement data...');
        const data = await mockApi.getEngagementData();
        console.log('Engagement data received:', data);
        
        if (!data) {
          throw new Error('No data returned from API');
        }
        
        // Ensure all required fields are present with default values
        const safeData = {
          totalEngagements: data.totalEngagements || 0,
          totalComments: data.totalComments || 0,
          responseRate: data.responseRate || 0,
          avgResponseTime: data.avgResponseTime || 0,
          sentimentScore: data.sentimentScore || 0,
          recentComments: data.recentComments || [],
          engagementTrends: data.engagementTrends || [],
          platformEngagement: data.platformEngagement || []
        };
        
        console.log('Setting engagement data:', safeData);
        setEngagementData(safeData);
      } catch (error) {
        console.error('Error fetching engagement data:', error);
        setError('Failed to load engagement data. ' + (error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchEngagementData();
  }, []);
  
  // Don't render anything during server-side rendering
  if (!isMounted) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading engagement data...</span>
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

  const { recentComments, engagementTrends, platformEngagement } = engagementData;

  const getEngagementIcon = (type: string) => {
    switch (type) {
      case 'like': return <ThumbsUp className="h-4 w-4 text-blue-500" />;
      case 'share': return <Share2 className="h-4 w-4 text-green-500" />;
      case 'love': return <Heart className="h-4 w-4 text-red-500" />;
      default: return <MessageSquare className="h-4 w-4 text-purple-500" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive" className="ml-2">High Priority</Badge>;
      case 'medium':
        return <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800 hover:bg-amber-100">Medium</Badge>;
      default:
        return <Badge variant="outline" className="ml-2">Low</Badge>;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold tracking-tight">Engagement</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Engagements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{engagementData.totalEngagements.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{engagementData.totalComments.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Response rate: {engagementData.responseRate}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{engagementData.avgResponseTime} hrs</div>
            <p className="text-xs text-muted-foreground mt-1">Industry avg: 5.2 hrs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sentiment Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{engagementData.sentimentScore}/10</div>
            <p className="text-xs text-muted-foreground mt-1">Based on comment analysis</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Engagement Trends</CardTitle>
            <CardDescription>30-day engagement metrics across platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <EngagementCharts engagementData={engagementData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Interactions</CardTitle>
            <CardDescription>Latest comments and mentions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-80 overflow-auto pr-2">
              {recentComments.map((comment: CommentData, index: number) => (
                <div key={index} className="flex items-start space-x-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                  <Avatar>
                    <AvatarImage src={`https://i.pravatar.cc/150?u=${comment.user}`} alt={comment.user} />
                    <AvatarFallback>{comment.user.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center">
                      <p className="text-sm font-medium">{comment.user}</p>
                      {getPriorityBadge(comment.priority)}
                    </div>
                    <p className="text-sm text-muted-foreground">{comment.text}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <span>{comment.platform}</span>
                        <span>•</span>
                        <span>{comment.time}</span>
                      </div>
                      <div className="flex items-center">
                        {getEngagementIcon(comment.type)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Engagement;

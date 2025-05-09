
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MessageSquare, Star, Users } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { SocialMetrics } from '@/types/content';

// Default metrics if no data is provided
const defaultMetrics = [
  {
    name: 'Meaningful Interactions',
    value: 85,
    icon: <MessageSquare className="h-4 w-4" />,
    color: 'bg-blue-500'
  },
  {
    name: 'Learning Time',
    value: 65,
    icon: <Star className="h-4 w-4" />,
    color: 'bg-purple-500'
  },
  {
    name: 'Community Contribution',
    value: 75,
    icon: <Users className="h-4 w-4" />,
    color: 'bg-green-500'
  },
  {
    name: 'Focus Time',
    value: 90,
    icon: <Clock className="h-4 w-4" />,
    color: 'bg-orange-500'
  },
];

interface TimeWellSpentProps {
  data?: SocialMetrics[];
}

const TimeWellSpent: React.FC<TimeWellSpentProps> = ({ data }) => {
  // Generate metrics based on the provided data
  const metrics = data ? [
    {
      name: 'Instagram Engagement',
      value: Math.round(data.find(p => p.platform === 'instagram')?.metrics.engagement || 0),
      icon: <MessageSquare className="h-4 w-4" />,
      color: 'bg-pink-500'
    },
    {
      name: 'Twitter Reach',
      value: Math.min(100, Math.round((data.find(p => p.platform === 'twitter')?.metrics.reach || 0) / 1000)),
      icon: <Star className="h-4 w-4" />,
      color: 'bg-blue-400'
    },
    {
      name: 'Facebook Interactions',
      value: Math.min(100, Math.round((data.find(p => p.platform === 'facebook')?.metrics.likes || 0) / 100)),
      icon: <Users className="h-4 w-4" />,
      color: 'bg-blue-600'
    },
    {
      name: 'LinkedIn Growth',
      value: Math.min(100, Math.round((data.find(p => p.platform === 'linkedin')?.metrics.followers || 0) / 200)),
      icon: <Clock className="h-4 w-4" />,
      color: 'bg-blue-800'
    },
  ] : defaultMetrics;
  return (
    <Card className="col-span-12 md:col-span-8">
      <CardHeader>
        <CardTitle>Time Well Spent</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {metrics.map((metric) => (
            <div key={metric.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {metric.icon}
                  <span className="text-sm font-medium">{metric.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">{metric.value}%</span>
              </div>
              <Progress value={metric.value} className={metric.color} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeWellSpent;

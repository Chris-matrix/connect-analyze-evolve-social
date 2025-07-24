'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EngagementData } from "@/types/dashboard";

interface EngagementChartsProps {
  engagementData: EngagementData;
}

export default function EngagementCharts({ engagementData }: EngagementChartsProps) {
  const { engagementTrends, platformEngagement } = engagementData;

  return (
    <div className="grid gap-6">
      {/* Engagement Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Engagement Trends</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={engagementTrends}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="likes" stroke="#3b82f6" />
              <Line type="monotone" dataKey="comments" stroke="#10b981" />
              <Line type="monotone" dataKey="shares" stroke="#8b5cf6" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>


      {/* Platform Engagement Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Engagement</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={platformEngagement}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="platform" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="engagement" name="Engagement %" stroke="#6366f1" />
              <Line type="monotone" dataKey="responseRate" name="Response Rate %" stroke="#ec4899" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

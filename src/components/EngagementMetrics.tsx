
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const engagementData = [
  { name: 'Mon', likes: 120, comments: 60, shares: 30 },
  { name: 'Tue', likes: 180, comments: 80, shares: 40 },
  { name: 'Wed', likes: 100, comments: 50, shares: 25 },
  { name: 'Thu', likes: 220, comments: 90, shares: 60 },
  { name: 'Fri', likes: 200, comments: 85, shares: 55 },
  { name: 'Sat', likes: 250, comments: 100, shares: 70 },
  { name: 'Sun', likes: 280, comments: 120, shares: 90 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border p-2 rounded-md shadow-md">
        <p className="font-medium">{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

const EngagementMetrics: React.FC = () => {
  return (
    <Card className="col-span-12 lg:col-span-8">
      <CardHeader>
        <CardTitle>Engagement Metrics</CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={engagementData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="likes" fill="#4361ee" radius={[4, 4, 0, 0]} />
              <Bar dataKey="comments" fill="#7209b7" radius={[4, 4, 0, 0]} />
              <Bar dataKey="shares" fill="#4cc9f0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default EngagementMetrics;

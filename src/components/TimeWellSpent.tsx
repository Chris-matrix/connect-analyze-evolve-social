
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MessageSquare, Star, Users } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

const metrics = [
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

const TimeWellSpent = () => {
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

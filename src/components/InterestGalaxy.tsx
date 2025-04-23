
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Users, MessageSquare, Compass } from 'lucide-react';

interface InterestNode {
  id: string;
  name: string;
  size: number;
  members: number;
  icon: React.ReactNode;
}

const interests: InterestNode[] = [
  { id: '1', name: 'Technology', size: 80, members: 12500, icon: <Compass className="h-5 w-5" /> },
  { id: '2', name: 'Art & Design', size: 65, members: 8300, icon: <Star className="h-5 w-5" /> },
  { id: '3', name: 'Science', size: 70, members: 9400, icon: <Compass className="h-5 w-5" /> },
  { id: '4', name: 'Community', size: 55, members: 6200, icon: <Users className="h-5 w-5" /> },
  { id: '5', name: 'Discussion', size: 60, members: 7100, icon: <MessageSquare className="h-5 w-5" /> },
];

const InterestGalaxy = () => {
  return (
    <Card className="col-span-12">
      <CardHeader>
        <CardTitle>Interest Galaxies</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-[400px] w-full">
          <div className="absolute inset-0 flex items-center justify-center">
            {interests.map((interest, index) => (
              <div
                key={interest.id}
                className="absolute transform hover:scale-110 transition-transform cursor-pointer"
                style={{
                  left: `${50 + Math.cos(index * (2 * Math.PI / interests.length)) * 150}px`,
                  top: `${200 + Math.sin(index * (2 * Math.PI / interests.length)) * 150}px`,
                }}
              >
                <div 
                  className={`
                    flex flex-col items-center justify-center 
                    bg-gradient-to-br from-social-blue/20 to-social-purple/20 
                    rounded-full p-4 backdrop-blur-sm border border-white/10
                    hover:from-social-blue/30 hover:to-social-purple/30
                  `}
                  style={{
                    width: `${interest.size}px`,
                    height: `${interest.size}px`,
                  }}
                >
                  {interest.icon}
                  <span className="text-xs font-medium mt-1">{interest.name}</span>
                  <span className="text-[10px] text-muted-foreground">{interest.members.toLocaleString()} members</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InterestGalaxy;

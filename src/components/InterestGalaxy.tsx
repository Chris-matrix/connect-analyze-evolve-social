import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Users, MessageSquare, Compass } from 'lucide-react';
import { cn } from "@/lib/utils";

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
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [radius, setRadius] = useState(150);

  useEffect(() => {
    const updateSize = () => {
      const container = document.querySelector('.galaxy-container');
      if (container) {
        const rect = container.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
        
        const minDimension = Math.min(rect.width, rect.height) / 2;
        setRadius(minDimension * 0.75);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <Card className="col-span-12">
      <CardHeader>
        <CardTitle>Interest Galaxies</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="galaxy-container relative h-[400px] w-full">
          {containerSize.width > 0 && interests.map((interest, index) => {
            const angle = index * (2 * Math.PI / interests.length);
            
            const centerX = containerSize.width / 2;
            const centerY = 400 / 2;
            
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            const scaleFactor = Math.min(containerSize.width, 400) / 800;
            const nodeSize = interest.size * Math.max(0.7, scaleFactor);

            return (
              <div
                key={interest.id}
                className="absolute transform hover:scale-110 transition-transform cursor-pointer"
                style={{
                  left: `${x - nodeSize/2}px`,
                  top: `${y - nodeSize/2}px`,
                }}
              >
                <div 
                  className={cn(`
                    flex flex-col items-center justify-center 
                    bg-gradient-to-br from-social-blue/20 to-social-purple/20 
                    rounded-full p-2 sm:p-3 md:p-4 backdrop-blur-sm border border-white/10
                    hover:from-social-blue/30 hover:to-social-purple/30
                  `)}
                  style={{
                    width: `${nodeSize}px`,
                    height: `${nodeSize}px`,
                  }}
                >
                  {interest.icon}
                  <span className="text-[0.65rem] sm:text-xs font-medium mt-1 text-center">{interest.name}</span>
                  <span className="text-[0.6rem] sm:text-[10px] text-muted-foreground">{interest.members.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default InterestGalaxy;

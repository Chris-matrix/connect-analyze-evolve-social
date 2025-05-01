
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StarIcon, Users, MessageSquare, Compass, Star, CircleDot, CircleArrowUp, CircleArrowDown } from 'lucide-react';
import { cn } from "@/lib/utils";

interface InterestNode {
  id: string;
  name: string;
  size: number;
  members: number;
  icon: React.ReactNode;
}

const interests: InterestNode[] = [
  { id: '1', name: 'Technology', size: 80, members: 12500, icon: <CircleDot className="h-5 w-5" /> },
  { id: '2', name: 'Art & Design', size: 65, members: 8300, icon: <Star className="h-5 w-5" /> },
  { id: '3', name: 'Science', size: 70, members: 9400, icon: <CircleArrowUp className="h-5 w-5" /> },
  { id: '4', name: 'Community', size: 55, members: 6200, icon: <Users className="h-5 w-5" /> },
  { id: '5', name: 'Discussion', size: 60, members: 7100, icon: <MessageSquare className="h-5 w-5" /> },
];

const InterestGalaxy = () => {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [radius, setRadius] = useState(150);
  const [rotating, setRotating] = useState(false);
  const [rotation, setRotation] = useState(0);

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

  useEffect(() => {
    let animationFrame: number;
    
    if (rotating) {
      const animate = () => {
        setRotation(prev => (prev + 0.002) % (2 * Math.PI));
        animationFrame = requestAnimationFrame(animate);
      };
      
      animationFrame = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [rotating]);

  return (
    <Card className="col-span-12 lg:col-span-6 overflow-hidden border-gradient">
      <CardHeader className="bg-gradient-to-r from-social-blue/5 to-social-purple/5 pb-4">
        <div className="flex justify-between items-center">
          <CardTitle>Interest Galaxies</CardTitle>
          <button 
            onClick={() => setRotating(!rotating)}
            className={`text-xs px-3 py-1 rounded-full transition-colors ${
              rotating 
                ? 'bg-social-purple/20 text-social-purple hover:bg-social-purple/30' 
                : 'bg-social-blue/20 text-social-blue hover:bg-social-blue/30'
            }`}
          >
            {rotating ? 'Pause' : 'Rotate'}
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-0 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-social-blue/5 via-transparent to-social-purple/5 rounded-b-lg" />
        <div className="galaxy-container relative h-[350px] w-full">
          {containerSize.width > 0 && interests.map((interest, index) => {
            const baseAngle = index * (2 * Math.PI / interests.length);
            const angle = baseAngle + rotation;
            
            const centerX = containerSize.width / 2;
            const centerY = 350 / 2;
            
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            const scaleFactor = Math.min(containerSize.width, 350) / 800;
            const nodeSize = interest.size * Math.max(0.7, scaleFactor);
            
            // Generate a unique gradient for each node
            const gradientIndex = index % 5;
            const gradients = [
              'from-social-blue/20 to-social-purple/20 hover:from-social-blue/30 hover:to-social-purple/30',
              'from-social-cyan/20 to-social-blue/20 hover:from-social-cyan/30 hover:to-social-blue/30',
              'from-social-purple/20 to-social-indigo/20 hover:from-social-purple/30 hover:to-social-indigo/30',
              'from-social-indigo/20 to-social-cyan/20 hover:from-social-indigo/30 hover:to-social-cyan/30',
              'from-green-400/20 to-social-blue/20 hover:from-green-400/30 hover:to-social-blue/30',
            ];
            
            const gradient = gradients[gradientIndex];
            
            return (
              <div
                key={interest.id}
                className="absolute transform hover:scale-110 transition-all duration-300 cursor-pointer z-10"
                style={{
                  left: `${x - nodeSize/2}px`,
                  top: `${y - nodeSize/2}px`,
                  transitionProperty: rotating ? 'transform' : 'transform, left, top',
                }}
              >
                <div 
                  className={cn(`
                    flex flex-col items-center justify-center 
                    bg-gradient-to-br ${gradient}
                    rounded-full p-2 sm:p-3 md:p-4 backdrop-blur-sm 
                    border border-white/10 shadow-lg shadow-indigo-500/10
                  `)}
                  style={{
                    width: `${nodeSize}px`,
                    height: `${nodeSize}px`,
                  }}
                >
                  <div className="bg-white/10 p-1.5 rounded-full mb-1">
                    {interest.icon}
                  </div>
                  <span className="text-[0.65rem] sm:text-xs font-medium mt-1 text-center">{interest.name}</span>
                  <span className="text-[0.6rem] sm:text-[10px] text-muted-foreground">{interest.members.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
          
          {/* Center Node */}
          {containerSize.width > 0 && (
            <div 
              className="absolute transform z-0"
              style={{
                left: `${containerSize.width/2 - 25}px`,
                top: `${350/2 - 25}px`,
              }}
            >
              <div className="w-[50px] h-[50px] rounded-full bg-gradient-to-br from-social-blue to-social-purple opacity-20 animate-pulse" />
            </div>
          )}
          
          {/* Connection Lines */}
          <svg 
            className="absolute inset-0 w-full h-full z-0" 
            style={{ pointerEvents: 'none' }}
          >
            {containerSize.width > 0 && interests.map((interest, index) => {
              const baseAngle = index * (2 * Math.PI / interests.length);
              const angle = baseAngle + rotation;
              
              const centerX = containerSize.width / 2;
              const centerY = 350 / 2;
              
              const x = centerX + Math.cos(angle) * radius;
              const y = centerY + Math.sin(angle) * radius;
              
              return (
                <line 
                  key={`line-${interest.id}`}
                  x1={centerX}
                  y1={centerY}
                  x2={x}
                  y2={y}
                  stroke="url(#lineGradient)"
                  strokeWidth="1"
                  opacity="0.3"
                />
              );
            })}
            
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4361ee" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#7209b7" stopOpacity="0.5" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </CardContent>
    </Card>
  );
};

export default InterestGalaxy;

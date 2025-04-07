
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from '@/lib/utils';

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    trend: 'up' | 'down';
  };
  icon?: React.ReactNode;
  variant?: 'default' | 'gradient';
  className?: string;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  value,
  change,
  icon,
  variant = 'default',
  className,
}) => {
  return (
    <Card className={cn('overflow-hidden', 
      variant === 'gradient' && 'card-gradient text-white border-0',
      className
    )}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className={cn("text-sm font-medium", 
              variant === 'default' ? "text-muted-foreground" : "text-white/80"
            )}>
              {title}
            </p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            
            {change && (
              <div className="flex items-center mt-1 gap-1">
                {change.trend === 'up' ? (
                  <>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-500">{change.value}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-red-500">{change.value}%</span>
                  </>
                )}
                <span className={cn("text-xs", 
                  variant === 'default' ? "text-muted-foreground" : "text-white/70"
                )}>
                  vs last week
                </span>
              </div>
            )}
          </div>
          
          {icon && (
            <div className={cn("p-2 rounded-full", 
              variant === 'default' ? "bg-muted" : "bg-white/20"
            )}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsCard;

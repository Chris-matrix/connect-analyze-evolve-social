import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  size?: number;
  text?: string;
}

export function LoadingSpinner({ 
  className, 
  size = 24, 
  text = 'Loading...' 
}: LoadingSpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center space-y-2", className)}>
      <Loader2 className="animate-spin" size={size} />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  );
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="h-4 w-3/4 rounded bg-muted" />
      <div className="h-4 rounded bg-muted" />
      <div className="h-4 w-5/6 rounded bg-muted" />
    </div>
  );
}

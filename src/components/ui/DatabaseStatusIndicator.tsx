import React, { useState, useEffect } from 'react';
import { checkDatabaseConnection, getDatabaseStatus } from '@/lib/db/check-connection';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Database, AlertCircle, CheckCircle } from 'lucide-react';

interface DatabaseStatusIndicatorProps {
  showDetails?: boolean;
  className?: string;
}

const DatabaseStatusIndicator: React.FC<DatabaseStatusIndicatorProps> = ({ 
  showDetails = false,
  className = ''
}) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [statusDetails, setStatusDetails] = useState<{
    connected: boolean;
    status: string;
    host: string;
    name: string;
    readyState: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      setLoading(true);
      try {
        if (showDetails) {
          const status = await getDatabaseStatus();
          setIsConnected(status.isConnected);
          setStatusDetails(status.status);
        } else {
          const connected = await checkDatabaseConnection();
          setIsConnected(connected);
        }
      } catch (error) {
        console.error('Error checking database connection:', error);
        setIsConnected(false);
      } finally {
        setLoading(false);
      }
    };

    checkConnection();

    // Set up interval to check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);

    return () => clearInterval(interval);
  }, [showDetails]);

  if (loading) {
    return (
      <Badge variant="outline" className={`animate-pulse ${className}`}>
        <Database className="h-3 w-3 mr-1" />
        Checking...
      </Badge>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant={isConnected ? "default" : "destructive"} 
            className={`${isConnected ? "bg-green-500 hover:bg-green-600" : ""} ${className}`}
          >
            {isConnected ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                DB Connected
              </>
            ) : (
              <>
                <AlertCircle className="h-3 w-3 mr-1" />
                DB Disconnected
              </>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          {showDetails && statusDetails ? (
            <div className="text-xs">
              <p>Status: {statusDetails.status}</p>
              <p>Host: {statusDetails.host}</p>
              <p>Database: {statusDetails.name}</p>
            </div>
          ) : (
            <p className="text-xs">
              {isConnected 
                ? "MongoDB database is connected" 
                : "MongoDB database is disconnected"}
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DatabaseStatusIndicator;

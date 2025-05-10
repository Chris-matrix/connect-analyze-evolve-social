import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const LoadingPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading process
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds loading time
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!isLoading) {
    // Redirect to login page after loading is complete
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Social Connect</h1>
          <p className="text-muted-foreground">Connect. Analyze. Evolve.</p>
        </div>
        
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;

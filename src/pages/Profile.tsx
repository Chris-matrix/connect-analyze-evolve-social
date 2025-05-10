import React from 'react';
import UserProfile from '@/components/auth/UserProfile';
import { useAuth } from '@/lib/auth/use-auth';
import { Navigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container mx-auto py-8">
      <UserProfile />
    </div>
  );
};

export default Profile;

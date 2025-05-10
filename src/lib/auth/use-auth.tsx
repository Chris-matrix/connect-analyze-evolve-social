import { useContext } from 'react';
import { AuthContext, AuthContextType } from './auth-context';

// Define the useAuth hook in a separate file to avoid lint warnings
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

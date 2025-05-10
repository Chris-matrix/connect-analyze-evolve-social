// auth-context.tsx - Context definition file
import React, { useState, useEffect, createContext } from 'react';
import * as mockApi from '@/lib/mock-data/mock-api';
import { User } from '@/types/content';

// Define the AuthContext type
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  socialLogin: (provider: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

// Create the context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        // Try to get user from localStorage first
        const storedUser = localStorage.getItem('socialDashboardUser');
        if (storedUser) {
          try {
            // Safely parse JSON with error handling
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
          } catch (parseError) {
            console.error('Failed to parse stored user data', parseError);
            // Clear corrupted data
            localStorage.removeItem('socialDashboardUser');
            localStorage.removeItem('socialDashboardToken');
            
            // Fall back to mock user
            const currentUser = await mockApi.getCurrentUser();
            if (currentUser) {
              setUser(currentUser);
              localStorage.setItem('socialDashboardUser', JSON.stringify(currentUser));
            }
          }
        } else {
          // For demo purposes, automatically log in with a mock user
          const currentUser = await mockApi.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            try {
              localStorage.setItem('socialDashboardUser', JSON.stringify(currentUser));
            } catch (storageError) {
              console.error('Failed to store user data', storageError);
            }
          }
        }
      } catch (error) {
        console.error('Failed to check authentication status', error);
        // Ensure user is set to null on error
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  // Login method
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await mockApi.login(email, password);
      if (!result || !result.user) {
        throw new Error('Authentication failed');
      }
      
      // Store user data safely
      try {
        localStorage.setItem('socialDashboardUser', JSON.stringify(result.user));
        localStorage.setItem('socialDashboardToken', result.token || 'mock-jwt-token');
      } catch (storageError) {
        console.error('Error storing auth data in localStorage:', storageError);
        // Continue with the session even if local storage fails
      }
      
      // Set user state correctly
      setUser(result.user);
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await mockApi.register(name, email, password);
      
      // Store user data safely
      try {
        localStorage.setItem('socialDashboardUser', JSON.stringify(result.user));
        localStorage.setItem('socialDashboardToken', result.token);
      } catch (storageError) {
        console.error('Error storing auth data in localStorage:', storageError);
        // Continue with the session even if local storage fails
      }
      
      // Set user state with just the user object
      setUser(result.user);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during registration';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout method
  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await mockApi.logout();
      setUser(null);
      
      // Clear storage safely
      try {
        localStorage.removeItem('socialDashboardUser');
        localStorage.removeItem('socialDashboardToken');
      } catch (storageError) {
        console.error('Error clearing auth data from localStorage:', storageError);
        // Continue with logout even if local storage operations fail
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Don't set error for logout - just log it
      // We still want to clear the local state even if the API call fails
      setUser(null);
      try {
        localStorage.removeItem('socialDashboardUser');
        localStorage.removeItem('socialDashboardToken');
      } catch (storageError) {
        console.error('Error clearing auth data from localStorage:', storageError);
      }
    } finally {
      setLoading(false);
    }
  };

  const socialLogin = async (provider: string) => {
    // Redirect to the provider's OAuth flow
    window.location.href = `/api/auth/${provider}`;
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Password reset request failed');
      }
    } catch (error) {
      setError(error.message || 'An error occurred during password reset');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedUser = await mockApi.updateUserProfile(userData);
      setUser(updatedUser);
      
      // Update user in localStorage
      localStorage.setItem('socialDashboardUser', JSON.stringify(updatedUser));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during profile update';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    socialLogin,
    resetPassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Export is already handled with the component declaration

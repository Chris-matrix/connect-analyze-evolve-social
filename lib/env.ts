/**
 * Environment variable utility for Next.js
 * Provides safe access to environment variables in both server and client components
 */

// Server-side environment variables (accessible only in server components)
export const env = {
  // Database
  DATABASE_URL: process.env.DATABASE_URL,
  DB_NAME: process.env.DB_NAME,
  
  // Authentication
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  
  // API Keys
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  
  // Social Media API Keys
  TWITTER_API_KEY: process.env.TWITTER_API_KEY,
  TWITTER_API_SECRET: process.env.TWITTER_API_SECRET,
  INSTAGRAM_CLIENT_ID: process.env.INSTAGRAM_CLIENT_ID,
  INSTAGRAM_CLIENT_SECRET: process.env.INSTAGRAM_CLIENT_SECRET,
  FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET,
  LINKEDIN_CLIENT_ID: process.env.LINKEDIN_CLIENT_ID,
  LINKEDIN_CLIENT_SECRET: process.env.LINKEDIN_CLIENT_SECRET,
  
  // Application
  NODE_ENV: process.env.NODE_ENV,
  APP_URL: process.env.APP_URL || 'http://localhost:3000',
};

// Public environment variables (accessible in both server and client components)
// These must be prefixed with NEXT_PUBLIC_ to be exposed to the browser
export const publicEnv = {
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Social Connect Dashboard',
  APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
};

// Helper function to safely access browser-only APIs
export const isBrowser = typeof window !== 'undefined';

// Helper function for safe localStorage access
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (isBrowser) {
      return localStorage.getItem(key);
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    if (isBrowser) {
      localStorage.setItem(key, value);
    }
  },
  removeItem: (key: string): void => {
    if (isBrowser) {
      localStorage.removeItem(key);
    }
  }
};

// Helper function for safe sessionStorage access
export const safeSessionStorage = {
  getItem: (key: string): string | null => {
    if (isBrowser) {
      return sessionStorage.getItem(key);
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    if (isBrowser) {
      sessionStorage.setItem(key, value);
    }
  },
  removeItem: (key: string): void => {
    if (isBrowser) {
      sessionStorage.removeItem(key);
    }
  }
};

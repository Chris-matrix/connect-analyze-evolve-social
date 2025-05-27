/**
 * Environment variables utility for Next.js
 * This provides a consistent way to access environment variables across the application
 */

// Use process.env for server-side and window.env for client-side
export const env = {
  // Database
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/connect-analyze-evolve-social',
  DB_NAME: process.env.DB_NAME || 'connect-analyze-evolve-social',
  
  // Authentication
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'your-nextauth-secret-key',
  
  // API
  API_URL: process.env.API_URL || '/api',
  
  // Feature flags
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
};

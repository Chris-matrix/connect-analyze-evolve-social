import mongoose from 'mongoose';

/**
 * Configuration for MongoDB connection
 */
interface MongoDBConfig {
  uri: string;
  dbName: string;
  options: mongoose.ConnectOptions;
}

/**
 * Cache connection to prevent multiple connections during development
 * This works in both browser and server environments
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

/**
 * Global cache interface for storing mongoose connection
 */
interface GlobalCache {
  mongoose?: MongooseCache;
}

// In Next.js, environment variables are exposed on process.env
const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/connect-analyze-evolve-social';
const DB_NAME = process.env.DB_NAME || 'connect-analyze-evolve-social';

// MongoDB connection configuration
const config: MongoDBConfig = {
  uri: MONGODB_URI,
  dbName: DB_NAME,
  options: {
    dbName: DB_NAME,
    bufferCommands: false,
    autoIndex: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4 // Use IPv4, skip trying IPv6
  }
};

if (!config.uri) {
  console.warn('MongoDB URI not defined, using default connection string');
}

// Log the database we're connecting to
console.log(`MongoDB connecting to database: ${config.dbName}`);

// Create a connection cache in the appropriate global object
const getGlobalCache = (): GlobalCache => {
  if (typeof window !== 'undefined') {
    // Browser environment
    return window as unknown as GlobalCache;
  } else if (typeof global !== 'undefined') {
    // Node.js environment
    return global as unknown as GlobalCache;
  } else {
    // Fallback for other environments
    return {};
  }
};

const globalCache = getGlobalCache();

// Initialize cache if it doesn't exist
if (!globalCache.mongoose) {
  globalCache.mongoose = { conn: null, promise: null };
}

const cached = globalCache.mongoose;

/**
 * Connect to MongoDB database
 * @returns Promise that resolves to mongoose instance
 */
async function connectDB(): Promise<typeof mongoose> {
  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Create new connection if none exists
  if (!cached.promise) {
    // Check if mongoose.connect is a function (it might not be in browser environments)
    if (typeof mongoose.connect === 'function') {
      cached.promise = mongoose.connect(config.uri, config.options)
        .then((mongoose) => {
          console.log('✅ MongoDB connected successfully');
          return mongoose;
        })
        .catch((err) => {
          console.error('❌ MongoDB connection error:', err);
          throw err;
        });
    } else {
      // In browser environments, we can't directly connect to MongoDB
      // Instead, we'll use our API endpoints
      console.warn('⚠️ Direct MongoDB connection not available in browser. Using API endpoints instead.');
      cached.promise = Promise.resolve(mongoose);
    }
  }
  
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

/**
 * Check if database is connected
 * @returns Boolean indicating connection status
 */
export function isDatabaseConnected(): boolean {
  return cached.conn !== null && mongoose.connection.readyState === 1;
}

/**
 * Get connection status details
 * @returns Object with connection status information
 */
export function getConnectionStatus(): {
  connected: boolean;
  readyState: number;
  status: string;
  dbName: string | null;
} {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const readyState = mongoose.connection.readyState || 0;
  
  return {
    connected: readyState === 1,
    readyState,
    status: states[readyState] || 'unknown',
    dbName: mongoose.connection.name || null
  };
}

export default connectDB;

const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * @returns {Promise<void>} A promise that resolves when connection is established
 */
const connectDatabase = async () => {
  try {
    const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/social-dashboard';
    const dbName = process.env.DB_NAME || 'social-dashboard';
    
    const options = {
      dbName,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      autoIndex: true, // Build indexes
      maxPoolSize: 10, // Maintain up to 10 socket connections
      family: 4 // Use IPv4, skip trying IPv6
    };

    await mongoose.connect(connectionString, options);
    console.log('✅ MongoDB connected successfully');
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });

    // Handle application termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });
    
    return mongoose.connection;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    // Don't exit the process, allow the application to handle the error
    throw error;
  }
};

/**
 * Check if database is connected
 * @returns {boolean} True if connected, false otherwise
 */
const isDatabaseConnected = () => {
  return mongoose.connection.readyState === 1; // 1 = connected
};

/**
 * Get detailed database connection status
 * @returns {Object} Connection status details
 */
const getDatabaseStatus = () => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const readyState = mongoose.connection.readyState;
  
  return {
    connected: readyState === 1,
    status: states[readyState] || 'unknown',
    host: mongoose.connection.host || 'not connected',
    name: mongoose.connection.name || 'not connected',
    readyState
  };
};

module.exports = {
  connectDatabase,
  getConnection: () => mongoose.connection,
  isDatabaseConnected,
  getDatabaseStatus
};

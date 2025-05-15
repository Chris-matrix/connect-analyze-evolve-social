/**
 * Utility functions to check database connection status
 */

/**
 * Check if the database is connected
 * @returns Promise that resolves to a boolean indicating connection status
 */
export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch('/api/db-status', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.isConnected;
  } catch (error) {
    console.error('Error checking database connection:', error);
    return false;
  }
};

/**
 * Get detailed database connection status
 * @returns Promise that resolves to detailed connection status
 */
export const getDatabaseStatus = async (): Promise<{
  success: boolean;
  isConnected: boolean;
  status: {
    connected: boolean;
    status: string;
    host: string;
    name: string;
    readyState: number;
  };
}> => {
  try {
    const response = await fetch('/api/db-status', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get database status');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting database status:', error);
    return {
      success: false,
      isConnected: false,
      status: {
        connected: false,
        status: 'error',
        host: 'unknown',
        name: 'unknown',
        readyState: 0
      }
    };
  }
};

/**
 * Ping the database to check connection
 * @returns Promise that resolves to ping result
 */
export const pingDatabase = async (): Promise<{
  success: boolean;
  isConnected: boolean;
  pingResult?: { ok: number };
}> => {
  try {
    const response = await fetch('/api/db-status/ping', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to ping database');
    }

    return await response.json();
  } catch (error) {
    console.error('Error pinging database:', error);
    return {
      success: false,
      isConnected: false
    };
  }
};

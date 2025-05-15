const express = require('express');
const { isDatabaseConnected, getDatabaseStatus } = require('../config/database');

const router = express.Router();

/**
 * @route   GET /api/db-status
 * @desc    Get database connection status
 * @access  Public
 */
router.get('/', (req, res) => {
  try {
    const isConnected = isDatabaseConnected();
    const status = getDatabaseStatus();
    
    res.json({
      success: true,
      isConnected,
      status
    });
  } catch (error) {
    console.error('Error checking database status:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking database status',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/db-status/ping
 * @desc    Ping database to check connection
 * @access  Public
 */
router.get('/ping', async (req, res) => {
  try {
    const { getConnection } = require('../config/database');
    const connection = getConnection();
    
    // Try to ping the database
    const pingResult = await connection.db.admin().ping();
    
    res.json({
      success: true,
      isConnected: pingResult && pingResult.ok === 1,
      pingResult
    });
  } catch (error) {
    console.error('Error pinging database:', error);
    res.status(500).json({
      success: false,
      message: 'Error pinging database',
      error: error.message,
      isConnected: false
    });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const openaiService = require('../ai/openai');

// Middleware to authenticate user
const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const jwt = require('jsonwebtoken');
    const User = require('../models/User');
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Generate content suggestion
router.post('/generate-content', authenticate, async (req, res) => {
  try {
    const params = req.body;
    
    if (!params.platform || !params.topic) {
      return res.status(400).json({ message: 'Platform and topic are required' });
    }
    
    const contentSuggestion = await openaiService.generateContentSuggestion(params);
    
    res.json(contentSuggestion);
  } catch (error) {
    console.error('Generate content error:', error);
    res.status(500).json({ message: 'Failed to generate content suggestion' });
  }
});

// Analyze content sentiment
router.post('/analyze-sentiment', authenticate, async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }
    
    const sentimentAnalysis = await openaiService.analyzeContentSentiment(content);
    
    res.json(sentimentAnalysis);
  } catch (error) {
    console.error('Analyze sentiment error:', error);
    res.status(500).json({ message: 'Failed to analyze content sentiment' });
  }
});

// Get best posting times
router.get('/best-posting-times', authenticate, async (req, res) => {
  try {
    const { platform } = req.query;
    
    if (!platform) {
      return res.status(400).json({ message: 'Platform is required' });
    }
    
    const bestTimes = await openaiService.getBestPostingTimes(platform);
    
    res.json(bestTimes);
  } catch (error) {
    console.error('Best posting times error:', error);
    res.status(500).json({ message: 'Failed to get best posting times' });
  }
});

// Improve content
router.post('/improve-content', authenticate, async (req, res) => {
  try {
    const { content, platform } = req.body;
    
    if (!content || !platform) {
      return res.status(400).json({ message: 'Content and platform are required' });
    }
    
    const improvedContent = await openaiService.getContentImprovement(content, platform);
    
    res.json(improvedContent);
  } catch (error) {
    console.error('Improve content error:', error);
    res.status(500).json({ message: 'Failed to improve content' });
  }
});

module.exports = router;

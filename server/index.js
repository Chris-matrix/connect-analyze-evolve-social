const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const path = require('path');
const { connectDatabase } = require('./config/database');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Import routes
const aiRoutes = require('./routes/ai');
const dbStatusRoutes = require('./routes/db-status');

// Connect to MongoDB using our database configuration module
connectDatabase()
  .then(() => console.log('Server connected to MongoDB'))
  .catch(err => console.error('Server failed to connect to MongoDB:', err));

// Import models
const User = require('./models/User');
const SocialMetrics = require('./models/SocialMetrics');
const ContentSuggestion = require('./models/ContentSuggestion');
const SocialProfile = require('./models/SocialProfile');

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
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

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    
    await user.save();
    
    // Create JWT token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    
    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    
    // Return user data (without password)
    const userResponse = { ...user.toObject() };
    delete userResponse.password;
    
    res.status(201).json({ user: userResponse, token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Create JWT token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    
    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    
    // Return user data (without password)
    const userResponse = { ...user.toObject() };
    delete userResponse.password;
    
    res.json({ user: userResponse, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

app.get('/api/auth/session', authenticate, (req, res) => {
  res.json({ user: req.user });
});

app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      // For security reasons, don't reveal that the email doesn't exist
      return res.json({ message: 'Password reset email sent if account exists' });
    }
    
    // In a real application, you would send an email with a reset link
    // For this demo, we'll just return a success message
    
    res.json({ message: 'Password reset email sent if account exists' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/auth/update-profile', authenticate, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const updateData = {};
    
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true }
    ).select('-password');
    
    res.json({ user });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Social Media API Routes
app.get('/api/social/metrics', authenticate, async (req, res) => {
  try {
    const metrics = await SocialMetrics.find({ userId: req.user._id });
    res.json(metrics);
  } catch (error) {
    console.error('Get metrics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/social/metrics/:platform', authenticate, async (req, res) => {
  try {
    const { platform } = req.params;
    const metrics = await SocialMetrics.findOne({ 
      userId: req.user._id,
      platform
    });
    
    if (!metrics) {
      return res.status(404).json({ message: 'Metrics not found' });
    }
    
    res.json(metrics);
  } catch (error) {
    console.error('Get platform metrics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Content Suggestions API Routes
app.get('/api/content/suggestions', authenticate, async (req, res) => {
  try {
    const { status, platform } = req.query;
    const query = { userId: req.user._id };
    
    if (status) query.status = status;
    if (platform) query.platform = platform;
    
    const suggestions = await ContentSuggestion.find(query).sort({ createdAt: -1 });
    res.json(suggestions);
  } catch (error) {
    console.error('Get suggestions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/content/suggestions', authenticate, async (req, res) => {
  try {
    const { platform, title, content, mediaType, suggestedTags, bestTimeToPost } = req.body;
    
    const suggestion = new ContentSuggestion({
      userId: req.user._id,
      platform,
      title,
      content,
      mediaType,
      suggestedTags,
      bestTimeToPost: new Date(bestTimeToPost),
      aiGeneratedScore: Math.floor(Math.random() * 100), // In a real app, this would be calculated
    });
    
    await suggestion.save();
    res.status(201).json(suggestion);
  } catch (error) {
    console.error('Create suggestion error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/content/suggestions/:id/status', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const suggestion = await ContentSuggestion.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { $set: { status } },
      { new: true }
    );
    
    if (!suggestion) {
      return res.status(404).json({ message: 'Suggestion not found' });
    }
    
    res.json(suggestion);
  } catch (error) {
    console.error('Update suggestion status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// API Routes
app.use('/api/ai', aiRoutes);
app.use('/api/db-status', dbStatusRoutes);

// Social Profile Routes
app.get('/api/social-profiles', authenticate, async (req, res) => {
  try {
    const profiles = await SocialProfile.find({ userId: req.user._id });
    res.json(profiles);
  } catch (error) {
    console.error('Error fetching social profiles:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/social-profiles', authenticate, async (req, res) => {
  try {
    const { platform, username, profileUrl, connected } = req.body;
    
    const newProfile = new SocialProfile({
      userId: req.user._id,
      platform,
      username,
      profileUrl,
      connected,
      followers: 0,
      lastUpdated: new Date()
    });
    
    await newProfile.save();
    res.status(201).json(newProfile);
  } catch (error) {
    console.error('Error creating social profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/social-profiles/:id', authenticate, async (req, res) => {
  try {
    const { platform, username, profileUrl, connected } = req.body;
    
    // Find profile and ensure it belongs to the user
    const profile = await SocialProfile.findOne({ 
      _id: req.params.id,
      userId: req.user._id 
    });
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    // Update profile
    profile.platform = platform || profile.platform;
    profile.username = username || profile.username;
    profile.profileUrl = profileUrl || profile.profileUrl;
    profile.connected = connected !== undefined ? connected : profile.connected;
    profile.lastUpdated = new Date();
    
    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error('Error updating social profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/social-profiles/:id', authenticate, async (req, res) => {
  try {
    // Find profile and ensure it belongs to the user
    const profile = await SocialProfile.findOne({ 
      _id: req.params.id,
      userId: req.user._id 
    });
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    await SocialProfile.deleteOne({ _id: req.params.id });
    res.json({ message: 'Profile deleted successfully' });
  }
  catch (error) {
    console.error('Error deleting social profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

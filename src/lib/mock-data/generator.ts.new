import { ContentSuggestion, SocialMetrics, User } from '@/types/content';
import { AnalyticsData, AudienceData, EngagementData, PieChartData } from '@/types/dashboard';

// Helper functions for generating random data
const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const randomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const randomBoolean = (probability = 0.5): boolean => {
  return Math.random() < probability;
};

// Arrays for generating random content
const platforms = ['instagram', 'twitter', 'facebook', 'linkedin'] as const;
const tones = ['professional', 'casual', 'humorous', 'inspirational'] as const;
const mediaTypes = ['image', 'video', 'carousel', 'text'] as const;
const statuses = ['pending', 'approved', 'rejected', 'published'] as const;

const topics = [
  'Product Launch',
  'Industry Trends',
  'Customer Success Stories',
  'Behind the Scenes',
  'Tips and Tricks',
  'Company Culture',
  'Industry News',
  'Thought Leadership',
  'How-to Guides',
  'Events and Webinars',
  'Team Spotlight',
  'Product Updates',
  'Case Studies',
  'Interviews',
  'Research Findings'
];

const contentIdeas = [
  'Share a day in the life of your team',
  'Highlight a customer success story',
  'Share industry statistics with your take',
  'Create a how-to guide related to your product',
  'Share tips for solving common problems',
  'Post a behind-the-scenes look at your company',
  'Share user-generated content',
  'Create a poll to engage your audience',
  'Share news about your industry',
  'Post about upcoming events or webinars',
  'Share a milestone or achievement',
  'Create a series of tips or hacks',
  'Share a testimonial from a satisfied customer',
  'Post about company values or mission',
  'Create a tutorial video'
];

const hashtagSets = [
  ['marketing', 'socialmedia', 'digital', 'business', 'strategy'],
  ['startup', 'entrepreneur', 'success', 'growth', 'innovation'],
  ['technology', 'tech', 'future', 'innovation', 'digital'],
  ['leadership', 'management', 'business', 'success', 'team'],
  ['design', 'creative', 'inspiration', 'art', 'branding'],
  ['productivity', 'workflow', 'efficiency', 'organization', 'time'],
  ['data', 'analytics', 'insights', 'research', 'trends'],
  ['community', 'engagement', 'audience', 'connection', 'conversation'],
  ['content', 'contentmarketing', 'storytelling', 'writing', 'blog'],
  ['learning', 'education', 'skills', 'development', 'growth']
];

// Generate a random user
export const generateUser = (): User => {
  const firstName = randomElement([
    'John', 'Jane', 'Michael', 'Emma', 'David', 'Sarah', 'Robert', 'Lisa', 
    'William', 'Olivia', 'James', 'Sophia', 'Thomas', 'Emily', 'Daniel'
  ]);
  
  const lastName = randomElement([
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 
    'Garcia', 'Rodriguez', 'Wilson', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Moore'
  ]);
  
  const name = `${firstName} ${lastName}`;
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
  
  return {
    id: Math.random().toString(36).substring(2, 11),
    name,
    email,
    image: `https://i.pravatar.cc/150?u=${email}`,
    emailVerified: randomBoolean(0.7) ? new Date().toISOString() : undefined,
    role: randomBoolean(0.1) ? 'admin' : 'user',
    accounts: [
      {
        provider: randomElement(['google', 'facebook', 'twitter']),
        providerAccountId: Math.random().toString(36).substring(2, 15),
        access_token: Math.random().toString(36).substring(2, 30),
        refresh_token: Math.random().toString(36).substring(2, 30),
        expires_at: Date.now() + 3600000
      }
    ],
    createdAt: randomDate(new Date(2023, 0, 1), new Date()).toISOString(),
    updatedAt: new Date().toISOString()
  };
};

// Generate a random content suggestion
export const generateContentSuggestion = (): ContentSuggestion => {
  const platform = randomElement(platforms);
  const topic = randomElement(topics);
  const tone = randomElement(tones);
  const mediaType = randomElement(mediaTypes);
  const status = randomElement(statuses);
  const contentIdea = randomElement(contentIdeas);
  const hashtags = randomElement(hashtagSets);
  
  // Generate random dates within the last month
  const now = new Date();
  const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  const createdAt = randomDate(oneMonthAgo, now).toISOString();
  const updatedAt = randomDate(new Date(createdAt), now).toISOString();
  
  // Generate a future date for best time to post (within next week)
  const oneWeekFromNow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);
  const bestTimeToPost = randomDate(now, oneWeekFromNow).toISOString();
  
  // Generate random engagement metrics
  const likes = randomInt(0, 1000);
  const comments = randomInt(0, 200);
  const shares = randomInt(0, 100);
  const impressions = randomInt(likes, likes * 10);
  
  return {
    id: Math.random().toString(36).substring(2, 11),
    userId: Math.random().toString(36).substring(2, 11),
    platform,
    title: `${topic} for ${platform}`,
    content: `${contentIdea} with a ${tone} tone. This is a mock content suggestion for ${platform} using ${mediaType} format. #${hashtags.join(' #')}`,
    mediaType,
    suggestedTags: hashtags,
    tags: hashtags,
    bestTimeToPost,
    aiGeneratedScore: Math.random() * 0.5 + 0.5, // Between 0.5 and 1.0
    status,
    engagement: {
      likes,
      comments,
      shares,
      impressions
    },
    createdAt,
    updatedAt
  };
};

// Generate random social metrics for a platform
export const generateSocialMetrics = (platform: typeof platforms[number]): SocialMetrics => {
  // Base followers count by platform
  const followersBase = {
    instagram: randomInt(1000, 50000),
    twitter: randomInt(500, 30000),
    facebook: randomInt(2000, 100000),
    linkedin: randomInt(300, 20000)
  };
  
  const followers = followersBase[platform];
  const following = platform === 'instagram' || platform === 'twitter' ? randomInt(100, 2000) : undefined;
  const posts = randomInt(50, 500);
  const likes = randomInt(followers * 0.1, followers * 0.5);
  const comments = randomInt(likes * 0.05, likes * 0.2);
  const shares = randomInt(likes * 0.01, likes * 0.1);
  const impressions = randomInt(followers * 2, followers * 10);
  const reach = randomInt(followers, impressions * 0.8);
  const engagement = parseFloat(((likes + comments + shares) / followers * 100).toFixed(2));
  
  // Generate daily stats for the past 30 days
  const dailyStats = [];
  const now = new Date();
  let currentFollowers = followers - randomInt(100, 500); // Start with slightly lower followers
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Slightly increase followers each day
    currentFollowers += randomInt(0, 20);
    
    // Random daily engagement and impressions
    const dailyEngagement = parseFloat((Math.random() * 5 + 1).toFixed(2)); // 1-6%
    const dailyImpressions = randomInt(currentFollowers, currentFollowers * 3);
    const dailyReach = randomInt(currentFollowers * 0.7, dailyImpressions * 0.9);
    
    dailyStats.push({
      date: date.toISOString(),
      followers: currentFollowers,
      engagement: dailyEngagement,
      impressions: dailyImpressions,
      reach: dailyReach
    });
  }
  
  return {
    id: Math.random().toString(36).substring(2, 11),
    userId: Math.random().toString(36).substring(2, 11),
    platform,
    metrics: {
      followers,
      following,
      posts,
      likes,
      comments,
      shares,
      impressions,
      reach,
      engagement
    },
    dailyStats,
    platformAccountId: Math.random().toString(36).substring(2, 15),
    platformUsername: `user_${platform}_${Math.random().toString(36).substring(2, 7)}`,
    lastUpdated: new Date().toISOString(),
    createdAt: randomDate(new Date(2022, 0, 1), new Date(2023, 0, 1)).toISOString(),
    updatedAt: new Date().toISOString()
  };
};

// Generate multiple content suggestions
export const generateContentSuggestions = (count: number = 10): ContentSuggestion[] => {
  return Array.from({ length: count }, () => generateContentSuggestion());
};

// Generate metrics for all platforms
export const generateAllPlatformMetrics = (): SocialMetrics[] => {
  return platforms.map(platform => generateSocialMetrics(platform));
};

// Generate dashboard data
export const generateDashboardData = () => {
  const allPlatformMetrics = generateAllPlatformMetrics();
  const recentSuggestions = generateContentSuggestions(5);
  
  // Calculate total metrics across all platforms
  const totalFollowers = allPlatformMetrics.reduce((sum, platform) => sum + platform.metrics.followers, 0);
  const totalEngagement = allPlatformMetrics.reduce((sum, platform) => sum + platform.metrics.engagement, 0) / allPlatformMetrics.length;
  const totalImpressions = allPlatformMetrics.reduce((sum, platform) => sum + platform.metrics.impressions, 0);
  const totalReach = allPlatformMetrics.reduce((sum, platform) => sum + platform.metrics.reach, 0);
  
  // Generate growth percentages
  const followerGrowth = parseFloat((Math.random() * 10 + 1).toFixed(1)); // 1-11%
  const engagementGrowth = parseFloat((Math.random() * 15 - 5).toFixed(1)); // -5 to 10%
  const impressionGrowth = parseFloat((Math.random() * 20 + 5).toFixed(1)); // 5-25%
  const reachGrowth = parseFloat((Math.random() * 15 + 2).toFixed(1)); // 2-17%
  
  return {
    metrics: {
      totalFollowers,
      totalEngagement,
      totalImpressions,
      totalReach,
      followerGrowth,
      engagementGrowth,
      impressionGrowth,
      reachGrowth
    },
    platformMetrics: allPlatformMetrics,
    recentSuggestions
  };
};

// Generate analytics data
export const generateAnalyticsData = (): AnalyticsData => {
  const allPlatformMetrics = generateAllPlatformMetrics();
  
  // Generate platform performance data
  const platformPerformance = allPlatformMetrics.map(platform => ({
    platform: platform.platform,
    engagement: Math.round(platform.metrics.engagement * 100),
    reach: Math.round(platform.metrics.reach / 100)
  }));
  
  // Generate engagement data for the last 30 days
  const engagementData = [];
  const now = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    engagementData.push({
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      likes: randomInt(500, 2000),
      comments: randomInt(50, 500),
      shares: randomInt(10, 200)
    });
  }
  
  // Generate audience growth data for the last 6 months
  const audienceGrowth = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = now.getMonth();
  
  for (let i = 5; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12; // Handle wrapping around to previous year
    
    audienceGrowth.push({
      month: months[monthIndex],
      instagram: randomInt(1000, 5000),
      twitter: randomInt(800, 3000),
      facebook: randomInt(1500, 6000),
      linkedin: randomInt(500, 2000)
    });
  }
  
  return {
    platformPerformance,
    engagementData,
    audienceGrowth
  };
};

// Generate audience data
export const generateAudienceData = (): AudienceData => {
  const allPlatformMetrics = generateAllPlatformMetrics();
  
  // Calculate total audience across all platforms
  const totalFollowers = allPlatformMetrics.reduce((sum, platform) => sum + platform.metrics.followers, 0);
  const activeFollowers = Math.round(totalFollowers * (Math.random() * 0.3 + 0.4)); // 40-70% active
  const activePercentage = Math.round((activeFollowers / totalFollowers) * 100);
  const growthRate = parseFloat((Math.random() * 8 + 2).toFixed(1)); // 2-10% growth rate
  
  // Top location data
  const locations = [
    { name: 'United States', value: Math.random() * 0.3 + 0.3 }, // 30-60%
    { name: 'United Kingdom', value: Math.random() * 0.15 + 0.05 }, // 5-20%
    { name: 'Canada', value: Math.random() * 0.1 + 0.05 }, // 5-15%
    { name: 'Australia', value: Math.random() * 0.1 + 0.03 }, // 3-13%
    { name: 'Germany', value: Math.random() * 0.08 + 0.02 }, // 2-10%
    { name: 'Other', value: Math.random() * 0.1 + 0.05 } // 5-15%
  ];
  
  // Normalize percentages to sum to 1
  const normalizePercentages = (items: Array<{ name: string, value: number }>) => {
    const total = items.reduce((sum, item) => sum + item.value, 0);
    return items.map(item => ({ ...item, value: item.value / total }));
  };
  
  const normalizedLocations = normalizePercentages(locations);
  const topLocation = normalizedLocations[0].name;
  const topLocationPercentage = Math.round(normalizedLocations[0].value * 100);
  
  // Generate demographic data
  const demographics = [
    { name: '18-24', value: Math.random() * 0.2 + 0.1 }, // 10-30%
    { name: '25-34', value: Math.random() * 0.25 + 0.25 }, // 25-50%
    { name: '35-44', value: Math.random() * 0.2 + 0.15 }, // 15-35%
    { name: '45-54', value: Math.random() * 0.15 + 0.05 }, // 5-20%
    { name: '55+', value: Math.random() * 0.1 + 0.05 } // 5-15%
  ];
  
  // Generate geographic data
  const geographics = normalizedLocations;
  
  // Generate interest data
  const interests = [
    { name: 'Technology', value: Math.random() * 0.2 + 0.1 }, // 10-30%
    { name: 'Business', value: Math.random() * 0.15 + 0.1 }, // 10-25%
    { name: 'Entertainment', value: Math.random() * 0.15 + 0.05 }, // 5-20%
    { name: 'Health & Fitness', value: Math.random() * 0.1 + 0.05 }, // 5-15%
    { name: 'Food & Drink', value: Math.random() * 0.1 + 0.05 }, // 5-15%
    { name: 'Travel', value: Math.random() * 0.1 + 0.05 } // 5-15%
  ];
  
  const normalizedDemographics = normalizePercentages(demographics);
  const normalizedInterests = normalizePercentages(interests);
  
  // Generate engagement data
  const engagement = [
    { name: 'Posts', value: Math.random() * 0.3 + 0.2 }, // 20-50%
    { name: 'Stories', value: Math.random() * 0.3 + 0.3 }, // 30-60%
    { name: 'Reels/Videos', value: Math.random() * 0.2 + 0.1 }, // 10-30%
    { name: 'Lives', value: Math.random() * 0.1 + 0.05 } // 5-15%
  ];
  
  const normalizedEngagement = normalizePercentages(engagement);
  
  return {
    totalFollowers,
    activeFollowers,
    activePercentage,
    topLocation,
    topLocationPercentage,
    growthRate,
    demographics: normalizedDemographics,
    geographics,
    interests: normalizedInterests,
    engagement: normalizedEngagement
  };
};

// Generate engagement data
export const generateEngagementData = (): EngagementData => {
  const allPlatformMetrics = generateAllPlatformMetrics();
  
  // Calculate overall engagement metrics
  const totalEngagements = allPlatformMetrics.reduce((sum, platform) => {
    return sum + platform.metrics.likes + platform.metrics.comments + platform.metrics.shares;
  }, 0);
  
  const totalComments = allPlatformMetrics.reduce((sum, platform) => sum + platform.metrics.comments, 0);
  const responseRate = Math.round(Math.random() * 30 + 60); // 60-90% response rate
  const avgResponseTime = parseFloat((Math.random() * 4 + 1).toFixed(1)); // 1-5 hours
  const sentimentScore = Math.round(Math.random() * 3 + 7); // 7-10 score
  
  // Generate platform engagement data
  const platformEngagement = allPlatformMetrics.map(platform => ({
    platform: platform.platform,
    engagement: Math.round(platform.metrics.engagement * 100),
    responseRate: Math.round(Math.random() * 30 + 60) // 60-90% response rate
  }));
  
  // Generate engagement trends for the last 30 days
  const engagementTrends = [];
  const now = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    engagementTrends.push({
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      likes: randomInt(500, 2000),
      comments: randomInt(50, 500),
      shares: randomInt(10, 200)
    });
  }
  
  // Generate recent comments
  const commentTypes: Array<'comment' | 'like' | 'share' | 'love'> = ['comment', 'like', 'share', 'love'];
  const priorities: Array<'high' | 'medium' | 'low'> = ['high', 'medium', 'low'];
  const platformNames = ['Instagram', 'Twitter', 'Facebook', 'LinkedIn'];
  const userNames = [
    'JohnDoe', 'JaneSmith', 'MikeJohnson', 'SarahWilliams', 'DavidBrown',
    'EmilyDavis', 'ChrisWilson', 'OliviaMiller', 'JamesTaylor', 'SophiaAnderson'
  ];
  
  const commentTexts = [
    'Love your content! Keep it up!',
    'This is exactly what I needed today.',
    'Could you do a follow-up on this topic?',
    'I have a question about your service.',
    'When will you be posting more content like this?',
    'Your brand is amazing!',
    'This changed my perspective, thank you!',
    'Not sure I agree with this point.',
    'Can you help me with an issue I\'m having?',
    'Looking forward to more content from you!'
  ];
  
  const recentComments = Array.from({ length: 10 }, () => {
    const type = randomElement(commentTypes);
    const priority = randomElement(priorities);
    const platform = randomElement(platformNames);
    const user = randomElement(userNames);
    const text = randomElement(commentTexts);
    const hours = randomInt(1, 24);
    
    return {
      user,
      text,
      platform,
      time: `${hours}h ago`,
      type,
      priority
    };
  });
  
  return {
    totalEngagements,
    totalComments,
    responseRate,
    avgResponseTime,
    sentimentScore,
    recentComments,
    engagementTrends,
    platformEngagement
  };
};

// Generate content calendar data
export const generateCalendarData = (month: number = new Date().getMonth(), year: number = new Date().getFullYear()) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarData = [];
  
  for (let day = 1; day <= daysInMonth; day++) {
    // Generate 0-3 content items per day with higher probability on weekdays
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const contentCount = isWeekend ? randomInt(0, 1) : randomInt(0, 3);
    
    if (contentCount > 0) {
      for (let i = 0; i < contentCount; i++) {
        const platform = randomElement(platforms);
        const mediaType = randomElement(mediaTypes);
        const status = randomElement(statuses);
        const hour = randomInt(8, 20); // 8 AM to 8 PM
        const minute = randomInt(0, 59);
        
        calendarData.push({
          id: Math.random().toString(36).substring(2, 11),
          title: randomElement(topics),
          date: new Date(year, month, day, hour, minute).toISOString(),
          platform,
          mediaType,
          status,
          engagement: randomInt(10, 100)
        });
      }
    }
  }
  
  return calendarData;
};

// Cache for mock data to ensure consistency across the app
const mockDataCache: {
  dashboard?: ReturnType<typeof generateDashboardData>;
  analytics?: AnalyticsData;
  audience?: AudienceData;
  engagement?: EngagementData;
  contentSuggestions?: ContentSuggestion[];
  calendarData?: Array<Record<string, unknown>>;
  user?: User;
  platforms?: SocialMetrics[];
  allData?: ReturnType<typeof getAllMockData>;
} = {};

// Helper function to simulate API delay
const simulateApiDelay = async () => {
  const delay = Math.random() * 500 + 300; // 300-800ms delay
  return new Promise(resolve => setTimeout(resolve, delay));
};

// Export a function to get all mock data
export const getAllMockData = () => {
  return {
    dashboard: generateDashboardData(),
    analytics: generateAnalyticsData(),
    audience: generateAudienceData(),
    engagement: generateEngagementData(),
    contentSuggestions: generateContentSuggestions(10),
    calendarData: generateCalendarData(),
    user: generateUser(),
    platforms: generateAllPlatformMetrics()
  };
};

// Initialize all mock data
export const initializeMockData = () => {
  if (Object.keys(mockDataCache).length === 0) {
    mockDataCache.allData = getAllMockData();
    mockDataCache.dashboard = mockDataCache.allData.dashboard;
    mockDataCache.analytics = mockDataCache.allData.analytics;
    mockDataCache.audience = mockDataCache.allData.audience;
    mockDataCache.engagement = mockDataCache.allData.engagement;
    mockDataCache.contentSuggestions = mockDataCache.allData.contentSuggestions;
    mockDataCache.calendarData = mockDataCache.allData.calendarData;
    mockDataCache.user = mockDataCache.allData.user;
    mockDataCache.platforms = mockDataCache.allData.platforms;
  }
  return mockDataCache;
};

// Initialize mock data on import
initializeMockData();

import { ContentSuggestion } from '@/types/content';

interface GenerateContentParams {
  platform: 'instagram' | 'twitter' | 'facebook' | 'linkedin' | 'all';
  topic: string;
  tone?: 'professional' | 'casual' | 'humorous' | 'inspirational';
  mediaType?: 'image' | 'video' | 'carousel' | 'text';
  targetAudience?: string;
  includeHashtags?: boolean;
}

// Mock AI content generation function
export async function generateContent(params: GenerateContentParams): Promise<ContentSuggestion> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Generate a mock suggestion based on the parameters
  const suggestion: ContentSuggestion = {
    id: Math.random().toString(36).substring(2, 11),
    userId: 'current-user',
    platform: params.platform,
    title: `${params.topic} for ${params.platform}`,
    content: generateMockContent(params),
    mediaType: params.mediaType || 'image',
    suggestedTags: generateMockTags(params),
    bestTimeToPost: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    aiGeneratedScore: Math.random() * 0.3 + 0.7, // Between 0.7 and 1.0
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  return suggestion;
}

// Helper function to generate mock content based on parameters
function generateMockContent(params: GenerateContentParams): string {
  const { platform, topic, tone = 'professional', targetAudience, includeHashtags } = params;
  
  let content = '';
  
  // Generate different content based on platform
  switch (platform) {
    case 'instagram':
      content = `📸 ${getIntroByTone(tone)} ${topic}! ${getBodyByTone(tone, topic)}`;
      break;
    case 'twitter':
      content = `${getIntroByTone(tone)} ${topic}! ${getShortBodyByTone(tone, topic)}`;
      break;
    case 'facebook':
      content = `${getIntroByTone(tone)} ${topic}!\n\n${getBodyByTone(tone, topic)}\n\n${getCallToAction(tone)}`;
      break;
    case 'linkedin':
      content = `${getIntroByTone('professional')} ${topic}!\n\n${getBodyByTone('professional', topic)}\n\n${getCallToAction('professional')}`;
      break;
    default:
      content = `${getIntroByTone(tone)} ${topic}! ${getBodyByTone(tone, topic)} ${getCallToAction(tone)}`;
  }
  
  // Add audience targeting if provided
  if (targetAudience) {
    content += `\n\nPerfect for ${targetAudience}!`;
  }
  
  // Add hashtags if requested
  if (includeHashtags) {
    const tags = generateMockTags(params);
    content += `\n\n${tags.map(tag => `#${tag}`).join(' ')}`;
  }
  
  return content;
}

// Helper function to generate intro based on tone
function getIntroByTone(tone: string): string {
  switch (tone) {
    case 'professional':
      return 'Introducing our insights on';
    case 'casual':
      return 'Hey everyone! Check out';
    case 'humorous':
      return 'You won\'t believe what we discovered about';
    case 'inspirational':
      return 'Transform your perspective on';
    default:
      return 'Discover';
  }
}

// Helper function to generate body based on tone
function getBodyByTone(tone: string, topic: string): string {
  switch (tone) {
    case 'professional':
      return `Our research indicates that ${topic} is becoming increasingly important in today's market. We've compiled key insights to help you stay ahead of the curve.`;
    case 'casual':
      return `We've been working on some cool stuff related to ${topic} and wanted to share it with you! What do you think?`;
    case 'humorous':
      return `If ${topic} was a superhero, it would definitely wear its underwear on the outside. Here's our not-so-serious take on a serious topic!`;
    case 'inspirational':
      return `${topic} has the power to change the way we see the world. Embrace the journey and discover new possibilities that await you.`;
    default:
      return `Here's what you need to know about ${topic}.`;
  }
}

// Helper function to generate shorter body for platforms like Twitter
function getShortBodyByTone(tone: string, topic: string): string {
  switch (tone) {
    case 'professional':
      return `New research on ${topic} reveals surprising insights for industry professionals.`;
    case 'casual':
      return `Just sharing our thoughts on ${topic}. What's your take?`;
    case 'humorous':
      return `${topic} is like a box of chocolates, except the chocolates are tweets!`;
    case 'inspirational':
      return `${topic} can transform your perspective. Embrace the change!`;
    default:
      return `Thoughts on ${topic}?`;
  }
}

// Helper function to generate call to action
function getCallToAction(tone: string): string {
  switch (tone) {
    case 'professional':
      return 'Contact us to learn more about how we can help your business succeed.';
    case 'casual':
      return 'Drop a comment and let us know what you think!';
    case 'humorous':
      return 'Like and share if you laughed! Or even if you didn\'t - we\'re not picky.';
    case 'inspirational':
      return 'Take the first step today. Your future self will thank you.';
    default:
      return 'Let us know your thoughts in the comments below.';
  }
}

// Helper function to generate mock tags
function generateMockTags(params: GenerateContentParams): string[] {
  const { platform, topic, tone } = params;
  
  const topicTags = topic.toLowerCase().split(' ').map(word => word.replace(/[^a-z0-9]/g, ''));
  
  const platformTags = {
    'instagram': ['instagram', 'insta', 'instadaily'],
    'twitter': ['twitter', 'tweet', 'twitterpost'],
    'facebook': ['facebook', 'facebookpost', 'socialmedia'],
    'linkedin': ['linkedin', 'networking', 'professional'],
    'all': ['socialmedia', 'digital', 'online']
  };
  
  const toneTags = {
    'professional': ['business', 'professional', 'industry'],
    'casual': ['casual', 'relaxed', 'everyday'],
    'humorous': ['funny', 'humor', 'lol'],
    'inspirational': ['inspiration', 'motivation', 'success']
  };
  
  return [
    ...topicTags,
    ...platformTags[platform],
    ...(tone ? toneTags[tone] : []),
    'content',
    'social'
  ].slice(0, 8); // Limit to 8 tags
}

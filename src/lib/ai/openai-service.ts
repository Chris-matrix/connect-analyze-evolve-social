import { ContentSuggestion } from '@/types/content';

const API_URL = '/api/ai/generate-content';

interface GenerateContentParams {
  platform: 'instagram' | 'twitter' | 'facebook' | 'linkedin' | 'all';
  topic: string;
  tone?: 'professional' | 'casual' | 'humorous' | 'inspirational';
  mediaType?: 'image' | 'video' | 'carousel' | 'text';
  targetAudience?: string;
  includeHashtags?: boolean;
}

export async function generateContentSuggestion(params: GenerateContentParams): Promise<ContentSuggestion> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to generate content suggestion');
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating content suggestion:', error);
    throw error;
  }
}

export async function analyzeContentSentiment(content: string): Promise<{
  sentiment: 'positive' | 'neutral' | 'negative';
  score: number;
  analysis: string;
}> {
  try {
    const response = await fetch('/api/ai/analyze-sentiment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to analyze content sentiment');
    }

    return await response.json();
  } catch (error) {
    console.error('Error analyzing content sentiment:', error);
    throw error;
  }
}

export async function getBestPostingTimes(platform: string): Promise<{
  times: { day: string; hour: number; score: number }[];
  recommendation: string;
}> {
  try {
    const response = await fetch(`/api/ai/best-posting-times?platform=${platform}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get best posting times');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting best posting times:', error);
    throw error;
  }
}

export async function getContentImprovement(content: string, platform: string): Promise<{
  improvedContent: string;
  changes: string[];
  reasoning: string;
}> {
  try {
    const response = await fetch('/api/ai/improve-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content, platform }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get content improvement');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting content improvement:', error);
    throw error;
  }
}

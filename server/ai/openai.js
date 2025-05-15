const dotenv = require('dotenv');

dotenv.config();

let openai = null;

// Check if OpenAI API key is available
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-your-openai-api-key') {
  try {
    const { OpenAI } = require('openai');
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    console.log('✅ OpenAI API initialized successfully');
  } catch (error) {
    console.warn('⚠️ OpenAI API initialization failed:', error.message);
  }
} else {
  console.warn('⚠️ OpenAI API key not configured. AI features will be disabled.');
}

/**
 * Generate content suggestions based on user parameters
 * @param {Object} params - Content generation parameters
 * @returns {Promise<Object>} Content suggestion
 */
async function generateContentSuggestion(params) {
  const { platform, topic, tone = 'professional', mediaType = 'text', targetAudience = 'general', includeHashtags = true } = params;

  const prompt = `
    Create a social media post for ${platform} about ${topic}.
    Tone: ${tone}
    Media Type: ${mediaType}
    Target Audience: ${targetAudience}
    ${includeHashtags ? 'Include relevant hashtags' : 'Do not include hashtags'}
    
    Format the response as a JSON object with the following structure:
    {
      "title": "A catchy title for the post",
      "content": "The main content of the post",
      "suggestedTags": ["tag1", "tag2", "tag3"],
      "mediaType": "${mediaType}",
      "bestTimeToPost": "ISO date string for the best time to post",
      "platform": "${platform}"
    }
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a social media expert who creates engaging content optimized for different platforms." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const responseText = completion.choices[0].message.content.trim();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const contentSuggestion = JSON.parse(jsonMatch[0]);
      
      // Add additional fields
      contentSuggestion.aiGeneratedScore = Math.floor(Math.random() * 30) + 70; // 70-100 score for AI generated content
      contentSuggestion.status = 'pending';
      
      return contentSuggestion;
    } else {
      throw new Error('Failed to parse AI response');
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}

/**
 * Analyze sentiment of content
 * @param {string} content - Content to analyze
 * @returns {Promise<Object>} Sentiment analysis
 */
async function analyzeContentSentiment(content) {
  const prompt = `
    Analyze the sentiment of the following social media content:
    "${content}"
    
    Provide a detailed analysis and rate the sentiment as positive, neutral, or negative.
    Also provide a sentiment score from 0 to 100, where 0 is extremely negative and 100 is extremely positive.
    
    Format the response as a JSON object with the following structure:
    {
      "sentiment": "positive|neutral|negative",
      "score": 75,
      "analysis": "Detailed explanation of the sentiment analysis"
    }
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a sentiment analysis expert who provides detailed analysis of social media content." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const responseText = completion.choices[0].message.content.trim();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('Failed to parse AI response');
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}

/**
 * Get best posting times for a platform
 * @param {string} platform - Social media platform
 * @returns {Promise<Object>} Best posting times
 */
async function getBestPostingTimes(platform) {
  const prompt = `
    What are the best times to post on ${platform} for maximum engagement?
    
    Format the response as a JSON object with the following structure:
    {
      "times": [
        { "day": "Monday", "hour": 9, "score": 85 },
        { "day": "Monday", "hour": 15, "score": 78 },
        ... (include at least 10 time slots across different days)
      ],
      "recommendation": "A brief explanation of the best posting strategy for ${platform}"
    }
    
    The score should be between 0 and 100, where 100 is the highest engagement potential.
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a social media analytics expert who provides data-driven recommendations for optimal posting times." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 800,
    });

    const responseText = completion.choices[0].message.content.trim();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('Failed to parse AI response');
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}

/**
 * Get content improvement suggestions
 * @param {string} content - Original content
 * @param {string} platform - Social media platform
 * @returns {Promise<Object>} Improved content and suggestions
 */
async function getContentImprovement(content, platform) {
  const prompt = `
    Improve the following ${platform} post for better engagement:
    "${content}"
    
    Format the response as a JSON object with the following structure:
    {
      "improvedContent": "The improved version of the content",
      "changes": ["List of specific changes made"],
      "reasoning": "Explanation of why these changes will improve engagement"
    }
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a social media content optimization expert who improves posts for maximum engagement." },
        { role: "user", content: prompt }
      ],
      temperature: 0.5,
      max_tokens: 800,
    });

    const responseText = completion.choices[0].message.content.trim();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('Failed to parse AI response');
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}

/**
 * Check if OpenAI is initialized
 * @returns {boolean} True if OpenAI is initialized, false otherwise
 */
function isInitialized() {
  return openai !== null;
}

module.exports = {
  generateContentSuggestion,
  analyzeContentSentiment,
  getBestPostingTimes,
  getContentImprovement,
  isInitialized
};

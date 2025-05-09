import { ContentSuggestion } from '@/types/content';

// Mock data for content suggestions
const mockSuggestions: ContentSuggestion[] = [
  {
    id: '1',
    userId: 'user1',
    platform: 'instagram',
    title: 'Product Showcase',
    content: 'Check out our latest product line! Perfect for the summer season. #newproduct #summer',
    mediaType: 'image',
    suggestedTags: ['newproduct', 'summer', 'launch'],
    bestTimeToPost: new Date().toISOString(),
    aiGeneratedScore: 0.85,
    status: 'pending',
    engagement: {
      likes: 0,
      comments: 0,
      shares: 0,
      impressions: 0
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    userId: 'user1',
    platform: 'twitter',
    title: 'Industry Insights',
    content: 'Our latest research shows that 78% of customers prefer sustainable products. What are your thoughts on sustainability in our industry?',
    mediaType: 'text',
    suggestedTags: ['research', 'sustainability', 'industry'],
    bestTimeToPost: new Date().toISOString(),
    aiGeneratedScore: 0.92,
    status: 'approved',
    engagement: {
      likes: 24,
      comments: 5,
      shares: 12,
      impressions: 1200
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Mock API handler for fetching suggestions
export async function fetchSuggestions(): Promise<ContentSuggestion[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockSuggestions;
}

// Mock API handler for updating suggestion status
export async function updateSuggestionStatus(
  id: string, 
  status: 'pending' | 'approved' | 'rejected' | 'published'
): Promise<ContentSuggestion> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const suggestion = mockSuggestions.find(s => s.id === id);
  
  if (!suggestion) {
    throw new Error('Suggestion not found');
  }
  
  suggestion.status = status;
  suggestion.updatedAt = new Date().toISOString();
  
  return suggestion;
}

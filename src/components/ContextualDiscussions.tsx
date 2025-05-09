
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Users } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { ContentSuggestion } from '@/types/content';

// Default discussions if no suggestions are provided
const defaultDiscussions = [
  {
    id: 1,
    topic: 'Future of AI Ethics',
    participants: 128,
    messages: 463,
    categories: ['Technology', 'Ethics'],
    activity: 'high'
  },
  {
    id: 2,
    topic: 'Sustainable Living Tips',
    participants: 89,
    messages: 275,
    categories: ['Lifestyle', 'Environment'],
    activity: 'medium'
  },
  {
    id: 3,
    topic: 'Digital Art Techniques',
    participants: 156,
    messages: 524,
    categories: ['Art', 'Technology'],
    activity: 'high'
  },
];

interface ContextualDiscussionsProps {
  suggestions?: ContentSuggestion[];
}

const ContextualDiscussions: React.FC<ContextualDiscussionsProps> = ({ suggestions }) => {
  // Map content suggestions to discussion format if available
  const discussions = suggestions ? suggestions.slice(0, 3).map((suggestion, index) => ({
    id: index + 1,
    topic: suggestion.title,
    participants: Math.floor(Math.random() * 150) + 50,
    messages: Math.floor(Math.random() * 500) + 200,
    categories: suggestion.tags || ['Content', 'Social Media'],
    activity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)]
  })) : defaultDiscussions;
  return (
    <Card className="col-span-12">
      <CardHeader>
        <CardTitle>Contextual Discussions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {discussions.map((discussion) => (
            <div 
              key={discussion.id}
              className="p-4 rounded-lg border bg-gradient-to-r from-card/50 to-card hover:from-social-blue/5 hover:to-social-purple/5 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold">{discussion.topic}</h4>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{discussion.participants}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{discussion.messages}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {discussion.categories.map((category) => (
                    <Badge key={category} variant="secondary">{category}</Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContextualDiscussions;

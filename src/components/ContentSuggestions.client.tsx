'use client';

import React, { useState, useEffect } from 'react';
import * as mockApi from '@/lib/mock-data/mock-api';
import { ContentSuggestion } from '@/types/content';
import dynamic from 'next/dynamic';

const ContentSuggestionGenerator = dynamic(
  () => import('./ContentSuggestionGenerator').then(mod => mod.ContentSuggestionGenerator),
  { ssr: false }
) as React.FC<{ onSuggestionGenerated: (suggestion: ContentSuggestion) => void }>;
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function ContentSuggestionsClient() {
  const [suggestions, setSuggestions] = useState<ContentSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setIsLoading(true);
        const data = await mockApi.getContentSuggestions();
        setSuggestions(data);
      } catch (err) {
        console.error('Error fetching content suggestions:', err);
        setError('Failed to load content suggestions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  const handleNewSuggestion = (newSuggestion: ContentSuggestion) => {
    setSuggestions(prev => [newSuggestion, ...prev]);
  };

  if (error) {
    return (
      <div className="p-4 text-red-500">
        <p>{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-2">
          Retry
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate New Content Suggestion</CardTitle>
        </CardHeader>
        <CardContent>
          <ContentSuggestionGenerator onSuggestionGenerated={handleNewSuggestion} />
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Suggested Content</h2>
        {suggestions.length > 0 ? (
          <div className="grid gap-4">
            {suggestions.map((suggestion) => (
              <Card key={suggestion.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{suggestion.title}</CardTitle>
                    <span className="text-sm text-muted-foreground">
                      {suggestion.platform}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{suggestion.content}</p>
                  {suggestion.engagement && (
                    <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
                      <span>👍 {suggestion.engagement.likes} likes</span>
                      <span>💬 {suggestion.engagement.comments} comments</span>
                      <span>🔄 {suggestion.engagement.shares} shares</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No content suggestions available.</p>
        )}
      </div>
    </div>
  );
}

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

// Import the client component with SSR disabled
const ContentSuggestionsClient = dynamic(
  () => import('@/components/ContentSuggestions.client'),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    ),
  }
);

// Error boundary component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }> {
  state: { hasError: boolean; error: Error | null } = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error in ContentSuggestions:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-red-500">
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="mb-4">Failed to load content suggestions.</p>
          <button
            className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function ContentSuggestionsPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Content Suggestions</h1>
      <ErrorBoundary>
        <Suspense fallback={
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        }>
          <ContentSuggestionsClient />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

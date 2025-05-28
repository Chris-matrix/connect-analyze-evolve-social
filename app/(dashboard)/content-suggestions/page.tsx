import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Content Suggestions | Social Connect Dashboard',
  description: 'Get AI-powered content suggestions for your social media',
}

export default function ContentSuggestionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Content Suggestions</h2>
          <p className="text-muted-foreground">
            AI-powered content ideas for your social media
          </p>
        </div>
      </div>
      
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-medium">Coming Soon</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Content suggestion features are being developed and will be available soon.
        </p>
      </div>
    </div>
  )
}

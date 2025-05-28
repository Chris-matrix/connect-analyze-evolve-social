import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Analytics | Social Connect Dashboard',
  description: 'View your social media analytics and performance metrics',
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground">
            View detailed analytics for your social media accounts
          </p>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Analytics content will go here */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-medium">Coming Soon</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Analytics features are being developed and will be available soon.
          </p>
        </div>
      </div>
    </div>
  )
}

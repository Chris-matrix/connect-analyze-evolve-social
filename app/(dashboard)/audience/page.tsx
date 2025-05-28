import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Audience | Social Connect Dashboard',
  description: 'View insights about your social media audience and followers',
}

export default function AudiencePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Audience</h2>
          <p className="text-muted-foreground">
            Understand your audience demographics and behavior
          </p>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Audience content will go here */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-medium">Coming Soon</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Audience insights features are being developed and will be available soon.
          </p>
        </div>
      </div>
    </div>
  )
}

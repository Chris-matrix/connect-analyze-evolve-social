import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Content Calendar | Social Connect Dashboard',
  description: 'Plan and schedule your social media content',
}

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Content Calendar</h2>
          <p className="text-muted-foreground">
            Plan and schedule your social media content
          </p>
        </div>
      </div>
      
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-medium">Coming Soon</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Content Calendar features are being developed and will be available soon.
        </p>
      </div>
    </div>
  )
}

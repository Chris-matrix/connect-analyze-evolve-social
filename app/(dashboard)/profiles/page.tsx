import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Social Profiles | Social Connect Dashboard',
  description: 'Manage your connected social media profiles',
}

export default function SocialProfilesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Social Profiles</h2>
          <p className="text-muted-foreground">
            Manage your connected social media accounts
          </p>
        </div>
      </div>
      
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-medium">Coming Soon</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Social profile management features are being developed and will be available soon.
        </p>
      </div>
    </div>
  )
}

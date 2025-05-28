import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Help & Support | Social Connect Dashboard',
  description: 'Get help and support for using the Social Connect Dashboard',
}

export default function HelpPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Help & Support</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Getting Started</h2>
          <p className="text-muted-foreground mb-4">
            Learn how to set up your account and connect your social media profiles.
          </p>
          <ul className="space-y-2 list-disc pl-5">
            <li>Creating your account</li>
            <li>Connecting social profiles</li>
            <li>Dashboard overview</li>
          </ul>
        </div>
        
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Features Guide</h2>
          <p className="text-muted-foreground mb-4">
            Explore the features available in the Social Connect Dashboard.
          </p>
          <ul className="space-y-2 list-disc pl-5">
            <li>Analytics and reporting</li>
            <li>Content suggestions</li>
            <li>Scheduling posts</li>
            <li>Engagement tracking</li>
          </ul>
        </div>
        
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Contact Support</h2>
          <p className="text-muted-foreground mb-4">
            Need help? Our support team is ready to assist you.
          </p>
          <div className="space-y-3">
            <div>
              <strong className="block">Email:</strong>
              <span>support@socialconnect.com</span>
            </div>
            <div>
              <strong className="block">Hours:</strong>
              <span>Monday-Friday, 9am-5pm EST</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-medium">How do I connect my social media accounts?</h3>
            <p className="text-muted-foreground mt-2">
              Go to the Social Profiles section in your dashboard and click on "Add Profile" to connect your accounts.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-medium">Can I schedule posts to multiple platforms at once?</h3>
            <p className="text-muted-foreground mt-2">
              Yes, you can create a single post and schedule it to be published on multiple platforms simultaneously.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-medium">How often is analytics data updated?</h3>
            <p className="text-muted-foreground mt-2">
              Analytics data is updated every 24 hours to provide you with the most current insights.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

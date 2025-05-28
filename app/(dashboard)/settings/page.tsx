import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { auth } from '../../../lib/auth/auth'

export const metadata: Metadata = {
  title: 'Settings | Social Connect Dashboard',
  description: 'Manage your application settings',
}

export default async function SettingsPage() {
  const session = await auth()
  const user = session?.user
  const isAdmin = user?.role === 'admin'

  if (!isAdmin) {
    return (
      <div className="flex h-[80vh] w-full flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground">
          You need administrator privileges to access this page.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your application settings and preferences
          </p>
        </div>
      </div>
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure general application settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="font-medium">Analytics Tracking</h3>
                  <p className="text-sm text-muted-foreground">
                    Enable analytics tracking for better insights
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="font-medium">Auto Refresh</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatically refresh data every 5 minutes
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <label htmlFor="timezone" className="text-sm font-medium">
                  Timezone
                </label>
                <select
                  id="timezone"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  defaultValue="America/New_York"
                >
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
              <Button>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the appearance of the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="font-medium">Dark Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    Toggle between light and dark mode
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="font-medium">Compact Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    Use a more compact layout for the dashboard
                  </p>
                </div>
                <Switch />
              </div>
              <div className="space-y-2">
                <label htmlFor="theme" className="text-sm font-medium">
                  Color Theme
                </label>
                <select
                  id="theme"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  defaultValue="default"
                >
                  <option value="default">Default</option>
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="purple">Purple</option>
                </select>
              </div>
              <Button>Save Appearance</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                Configure advanced application settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="font-medium">API Access</h3>
                  <p className="text-sm text-muted-foreground">
                    Enable API access for third-party integrations
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="font-medium">Debug Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    Enable debug mode for advanced troubleshooting
                  </p>
                </div>
                <Switch />
              </div>
              <div className="space-y-2">
                <label htmlFor="cache" className="text-sm font-medium">
                  Cache Duration
                </label>
                <select
                  id="cache"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  defaultValue="1800"
                >
                  <option value="300">5 minutes</option>
                  <option value="900">15 minutes</option>
                  <option value="1800">30 minutes</option>
                  <option value="3600">1 hour</option>
                </select>
              </div>
              <Button>Save Advanced Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

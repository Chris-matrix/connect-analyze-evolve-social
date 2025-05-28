import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { auth } from '../../../lib/auth/auth'

export const metadata: Metadata = {
  title: 'Profile | Social Connect Dashboard',
  description: 'Manage your profile and account settings',
}

export default async function ProfilePage() {
  const session = await auth()
  const user = session?.user

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
          <p className="text-muted-foreground">
            Manage your account settings and profile information
          </p>
        </div>
      </div>
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your profile information and email address
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user?.image || ''} alt={user?.name || 'User'} />
                  <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="font-medium">{user?.name}</h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
                <Button variant="outline" className="ml-auto">
                  Change Avatar
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <input
                    id="name"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    defaultValue={user?.name || ''}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    defaultValue={user?.email || ''}
                    disabled
                  />
                </div>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="current" className="text-sm font-medium">
                  Current Password
                </label>
                <input
                  id="current"
                  type="password"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="new" className="text-sm font-medium">
                  New Password
                </label>
                <input
                  id="new"
                  type="password"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="confirm" className="text-sm font-medium">
                  Confirm Password
                </label>
                <input
                  id="confirm"
                  type="password"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <Button>Update Password</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications for important updates
                  </p>
                </div>
                <div className="ml-auto">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300"
                    defaultChecked
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="font-medium">Push Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive push notifications for important updates
                  </p>
                </div>
                <div className="ml-auto">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300"
                    defaultChecked
                  />
                </div>
              </div>
              <Button>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

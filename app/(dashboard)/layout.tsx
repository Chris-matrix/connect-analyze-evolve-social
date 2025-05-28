import { Suspense } from 'react'
import { auth } from '../../lib/auth/auth'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get the user session
  const session = await auth()
  const user = session?.user

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <Suspense fallback={<div className="flex h-[80vh] w-full items-center justify-center">Loading...</div>}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  )
}

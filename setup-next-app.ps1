# Create App Router structure
$dashboardRoutes = @(
    "analytics",
    "audience", 
    "calendar", 
    "content-suggestions", 
    "engagement", 
    "profile", 
    "profiles", 
    "settings"
)

# Create auth routes
mkdir "app\(auth)\login" -Force
mkdir "app\(auth)\register" -Force
mkdir "app\(auth)\reset-password" -Force

# Create dashboard routes
foreach ($route in $dashboardRoutes) {
    mkdir "app\(dashboard)\$route" -Force
}

# Create API routes
mkdir "app\api\auth" -Force
mkdir "app\api\content" -Force
mkdir "app\api\social" -Force

# Create layout files
$rootLayoutContent = @"
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Social Connect Dashboard',
  description: 'Track and manage your social media presence',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
"@

$dashboardLayoutContent = @"
import { Suspense } from 'react'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <Suspense fallback={<div>Loading...</div>}>
            {children}
          </Suspense>
        </main>
      </div>
      <Toaster />
      <Sonner />
    </div>
  )
}
"@

$authLayoutContent = @"
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {children}
      </div>
    </div>
  )
}
"@

# Write layout files
Set-Content -Path "app\layout.tsx" -Value $rootLayoutContent
Set-Content -Path "app\(dashboard)\layout.tsx" -Value $dashboardLayoutContent
Set-Content -Path "app\(auth)\layout.tsx" -Value $authLayoutContent

# Create page.tsx files
$homePageContent = @"
import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/dashboard')
}
"@

$dashboardPageContent = @"
import Dashboard from '@/components/Dashboard'

export default function DashboardPage() {
  return <Dashboard />
}
"@

# Write page files
Set-Content -Path "app\page.tsx" -Value $homePageContent
Set-Content -Path "app\(dashboard)\page.tsx" -Value $dashboardPageContent

# Create API route handlers
$authRouteContent = @"
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { hash, compare } from 'bcryptjs'
import * as z from 'zod'

const prisma = new PrismaClient()

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, name } = userSchema.parse(body)
    
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }
    
    const hashedPassword = await hash(password, 10)
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || email.split('@')[0],
        role: 'user',
      },
    })
    
    const { password: _, ...userWithoutPassword } = user
    
    return NextResponse.json(
      { user: userWithoutPassword, message: 'User created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
"@

$contentRouteContent = @"
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')
    const platform = searchParams.get('platform')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }
    
    const whereClause: any = { userId }
    
    if (status) {
      whereClause.status = status
    }
    
    if (platform) {
      whereClause.platform = platform
    }
    
    const suggestions = await prisma.contentSuggestion.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    })
    
    return NextResponse.json(suggestions)
  } catch (error) {
    console.error('Error fetching content suggestions:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
"@

# Write API route files
mkdir "app\api\auth\register" -Force
Set-Content -Path "app\api\auth\register\route.ts" -Value $authRouteContent

mkdir "app\api\content\suggestions" -Force
Set-Content -Path "app\api\content\suggestions\route.ts" -Value $contentRouteContent

# Create lib/prisma.ts file
$prismaClientContent = @"
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
"@

# Ensure lib directory exists
mkdir "lib" -Force
Set-Content -Path "lib\prisma.ts" -Value $prismaClientContent

Write-Host "✅ Next.js App Router structure has been set up successfully!"

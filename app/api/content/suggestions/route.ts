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
    
    // Define a type for the where clause
    type WhereClause = {
      userId: string;
      status?: string;
      platform?: string;
    }
    
    const whereClause: WhereClause = { userId }
    
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

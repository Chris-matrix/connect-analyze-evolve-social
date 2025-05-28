import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '../../../lib/auth/auth';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const searchParams = request.nextUrl.searchParams;
    const platform = searchParams.get('platform');
    const status = searchParams.get('status');
    
    const where: any = { userId };
    
    if (platform) {
      where.platform = platform;
    }
    
    if (status) {
      where.status = status;
    }
    
    const suggestions = await prisma.contentSuggestion.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json(suggestions);
  } catch (error) {
    console.error('Error fetching content suggestions:', error);
    return NextResponse.json({ error: 'Failed to fetch content suggestions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const data = await request.json();
    
    const suggestion = await prisma.contentSuggestion.create({
      data: {
        ...data,
        userId,
      },
    });
    
    return NextResponse.json(suggestion, { status: 201 });
  } catch (error) {
    console.error('Error creating content suggestion:', error);
    return NextResponse.json({ error: 'Failed to create content suggestion' }, { status: 500 });
  }
}

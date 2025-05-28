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
    const timeRange = searchParams.get('timeRange') || '30d'; // Default to 30 days
    
    const where: any = { userId };
    
    if (platform) {
      where.platform = platform;
    }
    
    const metrics = await prisma.socialMetrics.findMany({
      where,
    });
    
    // Filter daily data based on time range
    const filteredMetrics = metrics.map(metric => {
      const dailyData = filterDailyDataByTimeRange(metric.dailyData, timeRange);
      return {
        ...metric,
        dailyData,
      };
    });
    
    return NextResponse.json(filteredMetrics);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
  }
}

// Helper function to filter daily data based on time range
function filterDailyDataByTimeRange(dailyData: any[], timeRange: string) {
  const now = new Date();
  let daysToSubtract = 30; // Default to 30 days
  
  switch (timeRange) {
    case '7d':
      daysToSubtract = 7;
      break;
    case '30d':
      daysToSubtract = 30;
      break;
    case '90d':
      daysToSubtract = 90;
      break;
    case '1y':
      daysToSubtract = 365;
      break;
    default:
      daysToSubtract = 30;
  }
  
  const cutoffDate = new Date(now);
  cutoffDate.setDate(cutoffDate.getDate() - daysToSubtract);
  
  return dailyData.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate >= cutoffDate;
  });
}

/**
 * GET /api/analytics
 * Get analytics summary
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsSummary } from '@/lib/services/analyticsService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('range') || '7d';

    const summary = await getAnalyticsSummary(timeRange);

    return NextResponse.json(summary);
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}



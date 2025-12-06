/**
 * POST /api/analytics/track
 * Track various analytics events (card views, shares)
 */

import { NextRequest, NextResponse } from 'next/server';
import { trackCardView, trackShare } from '@/lib/services/analyticsService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...data } = body;

    if (!type) {
      return NextResponse.json(
        { error: 'Event type is required' },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'card_view':
        if (!data.cardId || !data.query) {
          return NextResponse.json(
            { error: 'cardId and query are required for card_view events' },
            { status: 400 }
          );
        }
        result = await trackCardView({
          cardId: data.cardId,
          query: data.query,
          sessionId: request.headers.get('x-session-id') || undefined,
        });
        break;

      case 'share':
        if (!data.platform || !data.query) {
          return NextResponse.json(
            { error: 'platform and query are required for share events' },
            { status: 400 }
          );
        }
        result = await trackShare({
          platform: data.platform,
          query: data.query,
          sessionId: request.headers.get('x-session-id') || undefined,
        });
        break;

      default:
        return NextResponse.json(
          { error: `Unknown event type: ${type}` },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true, event: result });
  } catch (error) {
    console.error('Analytics track API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}


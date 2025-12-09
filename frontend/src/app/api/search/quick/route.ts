/**
 * GET /api/search/quick
 * Quick search - returns just document list without AI processing
 */

import { NextRequest, NextResponse } from 'next/server';
import { searchDocuments } from '@/lib/services/veritusService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const limit = searchParams.get('limit') || '5';

    if (!q) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }

    const results = await searchDocuments(q, { limit: parseInt(limit) });

    return NextResponse.json({
      query: q,
      documents: results.documents,
      totalResults: results.totalResults,
    });
  } catch (error) {
    console.error('Quick search API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}



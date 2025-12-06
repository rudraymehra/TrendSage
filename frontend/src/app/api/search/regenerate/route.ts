/**
 * POST /api/search/regenerate
 * Regenerate summary for existing documents
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateTrendSummary, generateSubTopics } from '@/lib/services/llmService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, documents } = body;

    if (!query || !documents || !Array.isArray(documents)) {
      return NextResponse.json(
        {
          error: 'Invalid request',
          message: 'Please provide query and documents array',
        },
        { status: 400 }
      );
    }

    const summary = await generateTrendSummary(query, documents);
    const subTopics = await generateSubTopics(query, documents);

    return NextResponse.json({
      query,
      overview: summary.overview,
      keyTakeaways: summary.keyTakeaways,
      watchList: summary.watchList,
      confidenceScore: summary.confidenceScore,
      trendDirection: summary.trendDirection,
      subTopics: subTopics.subTopics,
      regeneratedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Regenerate API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}


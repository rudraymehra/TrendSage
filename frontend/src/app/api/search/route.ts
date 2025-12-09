/**
 * POST /api/search
 * Main search endpoint - fetches documents and generates AI summary
 */

import { NextRequest, NextResponse } from 'next/server';
import { searchDocuments } from '@/lib/services/veritusService';
import { generateTrendSummary, generateSubTopics } from '@/lib/services/llmService';
import { trackSearch, getPublicationTrend } from '@/lib/services/analyticsService';

// Input sanitization helper
const sanitizeQuery = (query: unknown): string => {
  if (typeof query !== 'string') return '';
  return query
    .trim()
    .slice(0, 500) // Max 500 characters
    .replace(/[<>]/g, '') // Remove HTML-like characters
    .replace(/\s+/g, ' '); // Normalize whitespace
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, options = {} } = body;

    const cleanQuery = sanitizeQuery(query);

    if (!cleanQuery || cleanQuery.length === 0) {
      return NextResponse.json(
        {
          error: 'Invalid query',
          message: 'Please provide a valid search query',
        },
        { status: 400 }
      );
    }

    if (cleanQuery.length < 2) {
      return NextResponse.json(
        {
          error: 'Query too short',
          message: 'Search query must be at least 2 characters',
        },
        { status: 400 }
      );
    }

    // Step 1: Search for documents via Veritus API
    const searchResults = await searchDocuments(cleanQuery, {
      limit: options.limit || 5,
    });

    if (searchResults.documents.length === 0) {
      return NextResponse.json({
        query: cleanQuery,
        results: null,
        message: 'No relevant documents found for this query',
      });
    }

    // Step 2: Generate AI summary using LLM
    const summary = await generateTrendSummary(cleanQuery, searchResults.documents);

    // Step 3: Generate sub-topics
    const subTopics = await generateSubTopics(cleanQuery, searchResults.documents);

    // Step 4: Get publication trend data for charts
    const trendData = await getPublicationTrend(cleanQuery);

    // Step 5: Track search analytics
    await trackSearch({
      query: cleanQuery,
      resultsCount: searchResults.documents.length,
      sessionId: request.headers.get('x-session-id') || 'anonymous',
      userAgent: request.headers.get('user-agent') || undefined,
      ip: request.headers.get('x-forwarded-for') || undefined,
    });

    // Return comprehensive response
    return NextResponse.json({
      query: cleanQuery,
      timestamp: new Date().toISOString(),
      results: {
        overview: summary.overview,
        keyTakeaways: summary.keyTakeaways,
        watchList: summary.watchList,
        confidenceScore: summary.confidenceScore,
        trendDirection: summary.trendDirection,
        timeHorizon: summary.timeHorizon,
        sources: summary.sources,
        subTopics: subTopics.subTopics,
        chartData: trendData.trend,
        metadata: {
          totalDocuments: searchResults.totalResults,
          generatedAt: summary.generatedAt,
          model: summary.model,
        },
      },
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}



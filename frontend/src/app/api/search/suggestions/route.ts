/**
 * GET /api/search/suggestions
 * Get autocomplete suggestions based on partial query
 */

import { NextRequest, NextResponse } from 'next/server';

const allSuggestions = [
  'AI in healthcare',
  'AI drug discovery',
  'AI diagnostics',
  'artificial intelligence ethics',
  'carbon-neutral startups',
  'carbon capture technology',
  'climate tech investment',
  'Web3 funding decline',
  'Web3 enterprise adoption',
  'blockchain sustainability',
  'renewable energy investment',
  'renewable energy storage',
  'electric vehicle market',
  'EV battery technology',
  'generative AI enterprise',
  'generative AI regulation',
  'fintech regulation',
  'fintech innovation',
  'remote work productivity',
  'hybrid work models',
  'quantum computing applications',
  'cybersecurity trends',
  'edge computing growth',
  'sustainable agriculture tech',
  'space technology commercialization',
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    if (!q || q.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    const query = q.toLowerCase();
    const matches = allSuggestions
      .filter((s) => s.toLowerCase().includes(query))
      .slice(0, 8);

    return NextResponse.json({ suggestions: matches });
  } catch (error) {
    console.error('Suggestions API error:', error);
    return NextResponse.json({ suggestions: [] });
  }
}



/**
 * GET /api/discover/featured
 * Get featured/trending topics for the discover page
 */

import { NextResponse } from 'next/server';
import { getTrendingTopics } from '@/lib/services/analyticsService';

interface FeaturedTopic {
  query: string;
  title: string;
  description: string;
  category: string;
  trend: 'rising' | 'stable' | 'declining';
  icon: string;
}

// Predefined featured topics with rich metadata
const featuredTopics: FeaturedTopic[] = [
  {
    query: 'AI in healthcare',
    title: 'AI in Healthcare',
    description: 'Medical AI applications, diagnostics, drug discovery',
    category: 'Technology',
    trend: 'rising',
    icon: '🏥',
  },
  {
    query: 'carbon-neutral startups',
    title: 'Carbon-Neutral Startups',
    description: 'Climate tech, sustainable business, green innovation',
    category: 'Sustainability',
    trend: 'rising',
    icon: '🌱',
  },
  {
    query: 'generative AI enterprise',
    title: 'Generative AI for Enterprise',
    description: 'LLMs in business, automation, productivity',
    category: 'Technology',
    trend: 'rising',
    icon: '🤖',
  },
  {
    query: 'electric vehicle market',
    title: 'Electric Vehicle Market',
    description: 'EV adoption, battery tech, charging infrastructure',
    category: 'Automotive',
    trend: 'rising',
    icon: '⚡',
  },
  {
    query: 'renewable energy investment',
    title: 'Renewable Energy Investment',
    description: 'Solar, wind, energy storage, clean energy finance',
    category: 'Energy',
    trend: 'rising',
    icon: '☀️',
  },
  {
    query: 'Web3 enterprise adoption',
    title: 'Web3 Enterprise Adoption',
    description: 'Blockchain applications, DeFi, tokenization',
    category: 'Technology',
    trend: 'stable',
    icon: '🔗',
  },
  {
    query: 'fintech regulation',
    title: 'Fintech Regulation',
    description: 'Digital banking rules, crypto compliance, open banking',
    category: 'Finance',
    trend: 'rising',
    icon: '📊',
  },
  {
    query: 'remote work productivity',
    title: 'Remote Work Productivity',
    description: 'Hybrid models, collaboration tools, workforce trends',
    category: 'Workplace',
    trend: 'stable',
    icon: '💻',
  },
  {
    query: 'quantum computing applications',
    title: 'Quantum Computing',
    description: 'Quantum algorithms, enterprise use cases, research',
    category: 'Technology',
    trend: 'rising',
    icon: '⚛️',
  },
  {
    query: 'cybersecurity trends',
    title: 'Cybersecurity Trends',
    description: 'Zero trust, AI security, threat landscape',
    category: 'Security',
    trend: 'rising',
    icon: '🔒',
  },
  {
    query: 'sustainable agriculture tech',
    title: 'AgTech & Sustainability',
    description: 'Precision farming, food tech, vertical agriculture',
    category: 'Agriculture',
    trend: 'rising',
    icon: '🌾',
  },
  {
    query: 'space technology commercialization',
    title: 'Space Tech',
    description: 'Satellite internet, space tourism, launch services',
    category: 'Aerospace',
    trend: 'rising',
    icon: '🚀',
  },
];

export async function GET() {
  try {
    // Get trending topics from analytics
    const trending = await getTrendingTopics(10);

    // Combine featured with trending data
    const enrichedTopics = featuredTopics.map((topic) => {
      const trendingData = trending.find(
        (t) => t.query.toLowerCase() === topic.query.toLowerCase()
      );
      return {
        ...topic,
        searchCount: trendingData?.searchCount || Math.floor(Math.random() * 100 + 50),
      };
    });

    return NextResponse.json({
      featured: enrichedTopics.slice(0, 6),
      trending: enrichedTopics.slice(6, 12),
      categories: ['Technology', 'Sustainability', 'Finance', 'Energy', 'Workplace'],
    });
  } catch (error) {
    console.error('Featured topics API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}



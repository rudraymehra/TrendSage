import type { SearchResponse, FeaturedTopic, AnalyticsSummary, GoalProgress } from '@/types';

// For Vercel deployment, use relative paths (Next.js API routes)
// The API routes are now part of the same app
const API_BASE_URL = '/api';

// Generate a session ID for analytics
const getSessionId = (): string => {
  if (typeof window === 'undefined') return 'server';

  let sessionId = sessionStorage.getItem('trendsage_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem('trendsage_session_id', sessionId);
  }
  return sessionId;
};

// Common fetch options
const getHeaders = (): HeadersInit => ({
  'Content-Type': 'application/json',
  'x-session-id': getSessionId(),
});

// Generic fetch wrapper with error handling
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || error.message || 'Request failed');
  }

  return response.json();
}

// Search API
export async function searchTrend(query: string): Promise<SearchResponse> {
  return fetchApi<SearchResponse>('/search', {
    method: 'POST',
    body: JSON.stringify({ query }),
  });
}

// Document type for quick search
interface QuickSearchDocument {
  id: string;
  title: string;
  authors?: string[];
  abstract?: string;
  url?: string;
  source?: string;
  publishedDate?: string;
}

// Quick search (without AI processing)
export async function quickSearch(
  query: string,
  limit = 5
): Promise<{ query: string; documents: QuickSearchDocument[]; totalResults: number }> {
  return fetchApi(`/search/quick?q=${encodeURIComponent(query)}&limit=${limit}`);
}

// Get search suggestions
export async function getSearchSuggestions(query: string): Promise<{ suggestions: string[] }> {
  return fetchApi(`/search/suggestions?q=${encodeURIComponent(query)}`);
}

// Regenerate summary response type
interface RegenerateSummaryResponse {
  query: string;
  overview: string;
  keyTakeaways: { text: string; citations: number[] }[];
  watchList: string[];
  confidenceScore: number;
  trendDirection: 'rising' | 'stable' | 'declining';
  subTopics: {
    name: string;
    description: string;
    relevantSources: number[];
    trendStrength: string;
  }[];
  regeneratedAt: string;
}

// Regenerate summary for existing documents
export async function regenerateSummary(
  query: string,
  documents: QuickSearchDocument[]
): Promise<RegenerateSummaryResponse> {
  return fetchApi('/search/regenerate', {
    method: 'POST',
    body: JSON.stringify({ query, documents }),
  });
}

// Featured/Trending topics API
interface DiscoverResponse {
  featured: FeaturedTopic[];
  trending: FeaturedTopic[];
  categories: string[];
}

export async function getFeaturedTopics(): Promise<{
  featured: FeaturedTopic[];
  updatedAt: string;
}> {
  const response = await fetchApi<DiscoverResponse>('/discover/featured');
  return {
    featured: response.featured,
    updatedAt: new Date().toISOString(),
  };
}

export async function getTrendingTopics(
  limit = 10
): Promise<{ topics: FeaturedTopic[]; updatedAt: string }> {
  const response = await fetchApi<DiscoverResponse>('/discover/featured');
  return {
    topics: response.trending.slice(0, limit),
    updatedAt: new Date().toISOString(),
  };
}

export async function getTrendingCategories(): Promise<{
  categories: Record<string, FeaturedTopic[]>;
  updatedAt: string;
}> {
  const response = await fetchApi<DiscoverResponse>('/discover/featured');
  const categorized: Record<string, FeaturedTopic[]> = {};

  [...response.featured, ...response.trending].forEach((topic) => {
    const category = topic.category || 'Other';
    if (!categorized[category]) {
      categorized[category] = [];
    }
    categorized[category].push(topic);
  });

  return {
    categories: categorized,
    updatedAt: new Date().toISOString(),
  };
}

export async function getTopicChart(
  topic: string
): Promise<{
  query: string;
  trend: { year: number; publications: number }[];
  growthRate: string;
  totalPublications: number;
}> {
  // Chart data is now generated inline with search results
  // Return mock data for standalone chart requests
  const currentYear = new Date().getFullYear();
  const trend = [];
  const baseValue = 100 + Math.floor(Math.random() * 200);
  const growthRate = 0.15;

  for (let i = 5; i >= 0; i--) {
    const year = currentYear - i;
    const value = Math.floor(baseValue * Math.pow(1 + growthRate, 5 - i));
    trend.push({ year, publications: value });
  }

  return {
    query: topic,
    trend,
    growthRate: '15%',
    totalPublications: trend.reduce((sum, y) => sum + y.publications, 0),
  };
}

// Analytics API
export async function trackCardView(cardId: string, query: string): Promise<void> {
  await fetchApi('/analytics/track', {
    method: 'POST',
    body: JSON.stringify({ type: 'card_view', cardId, query }),
  });
}

export async function trackShare(platform: string, query: string): Promise<void> {
  await fetchApi('/analytics/track', {
    method: 'POST',
    body: JSON.stringify({ type: 'share', platform, query }),
  });
}

export async function getAnalyticsSummary(range = '7d'): Promise<AnalyticsSummary> {
  return fetchApi(`/analytics?range=${range}`);
}

export async function getGoalProgress(): Promise<GoalProgress> {
  // Mock goal progress since we don't have a dedicated endpoint
  const goal = 100;
  const current = Math.floor(Math.random() * 100);
  const progress = Math.round((current / goal) * 100);
  const remaining = goal - current;

  return {
    goal,
    current,
    progress,
    remaining,
    message: remaining > 0 ? `${remaining} more searches to reach goal!` : 'Goal reached! 🎉',
  };
}

// Health check
export async function checkHealth(): Promise<{
  status: string;
  timestamp: string;
  version: string;
}> {
  return fetchApi('/health');
}

import { v4 as uuidv4 } from 'uuid';

// In-memory analytics store (replace with MongoDB in production)
const analyticsStore = {
  searches: [],
  cardViews: [],
  shares: [],
  sessions: new Map()
};

// Trending topics based on search frequency
const trendingTopics = new Map();

/**
 * Track a search event
 */
export const trackSearch = async (data) => {
  const event = {
    id: uuidv4(),
    type: 'search',
    query: data.query,
    resultsCount: data.resultsCount || 0,
    sessionId: data.sessionId,
    timestamp: new Date().toISOString(),
    userAgent: data.userAgent,
    ip: data.ip
  };

  analyticsStore.searches.push(event);

  // Update trending topics
  const normalizedQuery = data.query.toLowerCase().trim();
  const current = trendingTopics.get(normalizedQuery) || { count: 0, lastSearched: null };
  trendingTopics.set(normalizedQuery, {
    count: current.count + 1,
    lastSearched: new Date().toISOString()
  });

  // Keep only last 10000 events
  if (analyticsStore.searches.length > 10000) {
    analyticsStore.searches = analyticsStore.searches.slice(-10000);
  }

  return event;
};

/**
 * Track card view event
 */
export const trackCardView = async (data) => {
  const event = {
    id: uuidv4(),
    type: 'card_view',
    cardId: data.cardId,
    query: data.query,
    sessionId: data.sessionId,
    timestamp: new Date().toISOString()
  };

  analyticsStore.cardViews.push(event);

  if (analyticsStore.cardViews.length > 10000) {
    analyticsStore.cardViews = analyticsStore.cardViews.slice(-10000);
  }

  return event;
};

/**
 * Track share event
 */
export const trackShare = async (data) => {
  const event = {
    id: uuidv4(),
    type: 'share',
    platform: data.platform,
    query: data.query,
    sessionId: data.sessionId,
    timestamp: new Date().toISOString()
  };

  analyticsStore.shares.push(event);

  return event;
};

/**
 * Get analytics summary
 */
export const getAnalyticsSummary = async (timeRange = '7d') => {
  const now = new Date();
  let startDate;

  switch (timeRange) {
    case '24h':
      startDate = new Date(now - 24 * 60 * 60 * 1000);
      break;
    case '7d':
      startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(now - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
  }

  const recentSearches = analyticsStore.searches.filter(
    (s) => new Date(s.timestamp) >= startDate
  );

  const recentCardViews = analyticsStore.cardViews.filter(
    (v) => new Date(v.timestamp) >= startDate
  );

  const recentShares = analyticsStore.shares.filter(
    (s) => new Date(s.timestamp) >= startDate
  );

  // Calculate unique sessions
  const uniqueSessions = new Set(recentSearches.map((s) => s.sessionId)).size;

  // Get top queries
  const queryFrequency = {};
  recentSearches.forEach((s) => {
    const q = s.query.toLowerCase();
    queryFrequency[q] = (queryFrequency[q] || 0) + 1;
  });

  const topQueries = Object.entries(queryFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([query, count]) => ({ query, count }));

  // Daily breakdown
  const dailyStats = {};
  recentSearches.forEach((s) => {
    const day = s.timestamp.split('T')[0];
    dailyStats[day] = dailyStats[day] || { searches: 0, sessions: new Set() };
    dailyStats[day].searches++;
    dailyStats[day].sessions.add(s.sessionId);
  });

  const dailyBreakdown = Object.entries(dailyStats)
    .map(([date, stats]) => ({
      date,
      searches: stats.searches,
      uniqueUsers: stats.sessions.size
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    summary: {
      totalSearches: recentSearches.length,
      uniqueUsers: uniqueSessions,
      cardViews: recentCardViews.length,
      shares: recentShares.length,
      timeRange
    },
    topQueries,
    dailyBreakdown,
    sharesByPlatform: getSharesByPlatform(recentShares)
  };
};

/**
 * Get shares breakdown by platform
 */
const getSharesByPlatform = (shares) => {
  const platforms = {};
  shares.forEach((s) => {
    platforms[s.platform] = (platforms[s.platform] || 0) + 1;
  });
  return platforms;
};

/**
 * Get trending topics
 */
export const getTrendingTopics = async (limit = 10) => {
  const topics = Array.from(trendingTopics.entries())
    .map(([query, data]) => ({
      query,
      searchCount: data.count,
      lastSearched: data.lastSearched
    }))
    .sort((a, b) => b.searchCount - a.searchCount)
    .slice(0, limit);

  // Add some default trending topics if store is empty
  if (topics.length < 5) {
    const defaults = [
      { query: 'AI in healthcare', searchCount: 156, lastSearched: new Date().toISOString() },
      { query: 'carbon-neutral startups', searchCount: 89, lastSearched: new Date().toISOString() },
      { query: 'Web3 funding decline', searchCount: 72, lastSearched: new Date().toISOString() },
      { query: 'renewable energy investment', searchCount: 65, lastSearched: new Date().toISOString() },
      { query: 'generative AI enterprise', searchCount: 112, lastSearched: new Date().toISOString() },
      { query: 'electric vehicle market', searchCount: 98, lastSearched: new Date().toISOString() },
      { query: 'fintech regulation', searchCount: 54, lastSearched: new Date().toISOString() },
      { query: 'remote work productivity', searchCount: 47, lastSearched: new Date().toISOString() }
    ];

    return defaults.slice(0, limit);
  }

  return topics;
};

/**
 * Get publication trend data (mock time-series for charts)
 */
export const getPublicationTrend = async (query) => {
  const currentYear = new Date().getFullYear();
  const years = [];

  // Generate realistic-looking trend data
  const baseValue = 100 + Math.floor(Math.random() * 200);
  const growthRate = 0.1 + Math.random() * 0.3;

  for (let i = 5; i >= 0; i--) {
    const year = currentYear - i;
    const value = Math.floor(baseValue * Math.pow(1 + growthRate, 5 - i) * (0.9 + Math.random() * 0.2));
    years.push({ year, publications: value });
  }

  return {
    query,
    trend: years,
    growthRate: `${Math.round(growthRate * 100)}%`,
    totalPublications: years.reduce((sum, y) => sum + y.publications, 0)
  };
};

export default {
  trackSearch,
  trackCardView,
  trackShare,
  getAnalyticsSummary,
  getTrendingTopics,
  getPublicationTrend
};

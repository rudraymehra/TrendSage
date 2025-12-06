export interface Source {
  index: number;
  title: string;
  url: string;
  source: string;
  publishedDate: string;
}

export interface KeyTakeaway {
  text: string;
  citations: number[];
}

export interface SubTopic {
  name: string;
  description: string;
  relevantSources: number[];
  trendStrength: 'high' | 'medium' | 'low';
}

export interface ChartDataPoint {
  year: number;
  publications: number;
}

export interface TrendResults {
  overview: string;
  keyTakeaways: KeyTakeaway[];
  watchList: string[];
  confidenceScore: number;
  trendDirection: 'rising' | 'stable' | 'declining';
  timeHorizon: 'short-term' | 'medium-term' | 'long-term';
  sources: Source[];
  subTopics: SubTopic[];
  chartData: ChartDataPoint[];
  metadata: {
    totalDocuments: number;
    generatedAt: string;
    model: string;
  };
}

export interface SearchResponse {
  query: string;
  timestamp: string;
  results: TrendResults | null;
  message?: string;
}

export interface FeaturedTopic {
  query: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  trend: 'rising' | 'stable' | 'declining';
  searchCount: number;
}

export interface TrendingTopic {
  query: string;
  searchCount: number;
  lastSearched: string;
}

export interface AnalyticsSummary {
  summary: {
    totalSearches: number;
    uniqueUsers: number;
    cardViews: number;
    shares: number;
    timeRange: string;
  };
  topQueries: { query: string; count: number }[];
  dailyBreakdown: { date: string; searches: number; uniqueUsers: number }[];
  sharesByPlatform: Record<string, number>;
}

export interface GoalProgress {
  goal: number;
  current: number;
  progress: number;
  remaining: number;
  message: string;
}

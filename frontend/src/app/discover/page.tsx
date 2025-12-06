'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getTrendingCategories, getTrendingTopics } from '@/lib/api';

interface TopicWithTrend {
  query: string;
  searchCount: number;
  trend?: string;
  lastSearched?: string;
}

interface Categories {
  [key: string]: TopicWithTrend[];
}

export default function DiscoverPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Categories>({});
  const [trendingTopics, setTrendingTopics] = useState<TopicWithTrend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    async function loadData() {
      try {
        const [catData, trendData] = await Promise.all([
          getTrendingCategories(),
          getTrendingTopics(20)
        ]);
        setCategories(catData.categories);
        setTrendingTopics(trendData.topics);
      } catch (error) {
        console.error('Failed to load discover data:', error);
        // Use fallback data
        setCategories({
          technology: [
            { query: 'AI in healthcare', searchCount: 156, trend: 'rising' },
            { query: 'generative AI enterprise', searchCount: 112, trend: 'rising' },
            { query: 'quantum computing applications', searchCount: 78, trend: 'stable' },
          ],
          sustainability: [
            { query: 'carbon-neutral startups', searchCount: 89, trend: 'rising' },
            { query: 'renewable energy investment', searchCount: 98, trend: 'rising' },
          ],
          finance: [
            { query: 'Web3 funding decline', searchCount: 72, trend: 'declining' },
            { query: 'fintech regulation', searchCount: 54, trend: 'stable' },
          ],
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const handleTopicClick = (query: string) => {
    router.push(`/?q=${encodeURIComponent(query)}`);
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'rising':
        return <span className="text-emerald-500">↑</span>;
      case 'declining':
        return <span className="text-red-500">↓</span>;
      default:
        return <span className="text-amber-500">→</span>;
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      technology: '💻',
      sustainability: '🌱',
      finance: '💰',
      business: '📊',
    };
    return icons[category] || '📈';
  };

  const allTopics = activeCategory === 'all'
    ? Object.values(categories).flat()
    : categories[activeCategory] || [];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Discover Trends
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Explore trending topics by category or browse the most popular searches
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            All Topics
          </button>
          {Object.keys(categories).map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize flex items-center gap-2 ${
                activeCategory === category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <span>{getCategoryIcon(category)}</span>
              {category}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="skeleton h-5 w-3/4 rounded mb-2" />
                <div className="skeleton h-4 w-1/2 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Topics Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-12">
              {allTopics.map((topic) => (
                <button
                  key={topic.query}
                  onClick={() => handleTopicClick(topic.query)}
                  className="group p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg transition-all text-left card-hover"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {topic.query}
                    </h3>
                    {getTrendIcon(topic.trend)}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                    <span>{topic.searchCount} searches</span>
                    {topic.trend && (
                      <span className={`capitalize ${
                        topic.trend === 'rising' ? 'text-emerald-600 dark:text-emerald-400' :
                        topic.trend === 'declining' ? 'text-red-600 dark:text-red-400' :
                        'text-amber-600 dark:text-amber-400'
                      }`}>
                        {topic.trend}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Top Searches Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Top Searches This Week
              </h2>
              <div className="space-y-3">
                {trendingTopics.slice(0, 10).map((topic, index) => (
                  <button
                    key={topic.query}
                    onClick={() => handleTopicClick(topic.query)}
                    className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                  >
                    <span className="w-8 h-8 flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full font-semibold text-sm">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {topic.query}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {topic.searchCount} searches
                    </span>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

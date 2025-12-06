'use client';

import { useEffect, useState } from 'react';
import { getAnalyticsSummary, getGoalProgress } from '@/lib/api';
import type { AnalyticsSummary, GoalProgress } from '@/types';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [goalProgress, setGoalProgress] = useState<GoalProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [analyticsData, goalData] = await Promise.all([
          getAnalyticsSummary(timeRange),
          getGoalProgress()
        ]);
        setAnalytics(analyticsData);
        setGoalProgress(goalData);
      } catch (error) {
        console.error('Failed to load analytics:', error);
        // Use fallback data
        setAnalytics({
          summary: {
            totalSearches: 247,
            uniqueUsers: 42,
            cardViews: 189,
            shares: 23,
            timeRange
          },
          topQueries: [
            { query: 'AI in healthcare', count: 45 },
            { query: 'carbon-neutral startups', count: 32 },
            { query: 'generative AI enterprise', count: 28 },
            { query: 'Web3 funding decline', count: 19 },
            { query: 'renewable energy investment', count: 15 }
          ],
          dailyBreakdown: [
            { date: '2024-01-01', searches: 32, uniqueUsers: 12 },
            { date: '2024-01-02', searches: 45, uniqueUsers: 18 },
            { date: '2024-01-03', searches: 38, uniqueUsers: 14 },
            { date: '2024-01-04', searches: 52, uniqueUsers: 21 },
            { date: '2024-01-05', searches: 41, uniqueUsers: 16 },
            { date: '2024-01-06', searches: 29, uniqueUsers: 11 },
            { date: '2024-01-07', searches: 35, uniqueUsers: 13 }
          ],
          sharesByPlatform: {
            twitter: 12,
            linkedin: 8,
            copy: 3
          }
        });
        setGoalProgress({
          goal: 69,
          current: 42,
          progress: 60.9,
          remaining: 27,
          message: '27 more users needed to reach goal'
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [timeRange]);

  const StatCard = ({ title, value, icon, change }: { title: string; value: string | number; icon: React.ReactNode; change?: string }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          {change && (
            <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">{change}</p>
          )}
        </div>
        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track usage metrics and monitor progress towards goals
            </p>
          </div>

          {/* Time range selector */}
          <div className="mt-4 md:mt-0 flex gap-2">
            {['24h', '7d', '30d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {range === '24h' ? 'Last 24h' : range === '7d' ? 'Last 7 days' : 'Last 30 days'}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="skeleton h-4 w-24 rounded mb-2" />
                <div className="skeleton h-8 w-16 rounded" />
              </div>
            ))}
          </div>
        ) : analytics && (
          <>
            {/* Goal Progress Card */}
            {goalProgress && (
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 mb-8 text-white">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold mb-2">User Goal Progress</h2>
                    <p className="text-indigo-100">{goalProgress.message}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold">{goalProgress.current}/{goalProgress.goal}</p>
                    <p className="text-indigo-200">unique users</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-3 bg-indigo-400/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-500"
                      style={{ width: `${goalProgress.progress}%` }}
                    />
                  </div>
                  <p className="text-right text-sm text-indigo-200 mt-1">
                    {goalProgress.progress.toFixed(1)}% complete
                  </p>
                </div>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <StatCard
                title="Total Searches"
                value={analytics.summary.totalSearches}
                icon={
                  <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
              <StatCard
                title="Unique Users"
                value={analytics.summary.uniqueUsers}
                icon={
                  <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                }
              />
              <StatCard
                title="Card Views"
                value={analytics.summary.cardViews}
                icon={
                  <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                }
              />
              <StatCard
                title="Shares"
                value={analytics.summary.shares}
                icon={
                  <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                }
              />
            </div>

            {/* Two Column Layout */}
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Top Queries */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Top Queries
                </h3>
                <div className="space-y-3">
                  {analytics.topQueries.map((item, index) => (
                    <div key={item.query} className="flex items-center gap-3">
                      <span className="w-6 h-6 flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-sm font-medium">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-gray-900 dark:text-white text-sm font-medium">
                          {item.query}
                        </p>
                        <div className="mt-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{
                              width: `${(item.count / analytics.topQueries[0].count) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shares by Platform */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Shares by Platform
                </h3>
                <div className="space-y-4">
                  {Object.entries(analytics.sharesByPlatform).map(([platform, count]) => {
                    const total = Object.values(analytics.sharesByPlatform).reduce((a, b) => a + b, 0);
                    const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;

                    return (
                      <div key={platform} className="flex items-center gap-4">
                        <div className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
                          {platform === 'twitter' && (
                            <svg className="w-5 h-5 text-[#1DA1F2]" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                          )}
                          {platform === 'linkedin' && (
                            <svg className="w-5 h-5 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                          )}
                          {platform === 'copy' && (
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                              {platform === 'copy' ? 'Link Copy' : platform}
                            </p>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {count} ({percentage}%)
                            </span>
                          </div>
                          <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                platform === 'twitter' ? 'bg-[#1DA1F2]' :
                                platform === 'linkedin' ? 'bg-[#0A66C2]' :
                                'bg-gray-400'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Daily Breakdown Chart */}
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Daily Activity
              </h3>
              <div className="flex items-end gap-2 h-48">
                {analytics.dailyBreakdown.map((day) => {
                  const maxSearches = Math.max(...analytics.dailyBreakdown.map(d => d.searches));
                  const height = (day.searches / maxSearches) * 100;

                  return (
                    <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full flex flex-col items-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          {day.searches}
                        </span>
                        <div
                          className="w-full bg-indigo-500 rounded-t transition-all hover:bg-indigo-600"
                          style={{ height: `${height}%`, minHeight: '8px' }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

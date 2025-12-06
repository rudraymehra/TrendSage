'use client';

import { useState, useEffect, useRef } from 'react';
import type { TrendResults, Source } from '@/types';
import { trackCardView, trackShare } from '@/lib/api';
import TrendChart from './TrendChart';
import CitationModal from './CitationModal';
import ShareButtons from './ShareButtons';

interface TrendCardProps {
  query: string;
  results: TrendResults;
}

export default function TrendCard({ query, results }: TrendCardProps) {
  const [selectedSource, setSelectedSource] = useState<Source | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);
  const hasTracked = useRef(false);

  // Track card view
  useEffect(() => {
    if (!hasTracked.current) {
      hasTracked.current = true;
      trackCardView(`card-${query}`, query).catch(() => {});
    }
  }, [query]);

  const getTrendIcon = () => {
    switch (results.trendDirection) {
      case 'rising':
        return (
          <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
      case 'declining':
        return (
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
          </svg>
        );
    }
  };

  const getConfidenceColor = () => {
    if (results.confidenceScore >= 7) return 'bg-emerald-500';
    if (results.confidenceScore >= 4) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const handleShare = async (platform: string) => {
    await trackShare(platform, query).catch(() => {});
  };

  const renderCitations = (citations: number[]) => {
    return citations.map((num) => (
      <button
        key={num}
        onClick={() => setSelectedSource(results.sources[num - 1])}
        className="citation-link text-indigo-600 dark:text-indigo-400 hover:underline ml-0.5"
        aria-label={`View source ${num}`}
      >
        [{num}]
      </button>
    ));
  };

  return (
    <div
      ref={cardRef}
      className="card-hover bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden animate-fade-in"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {getTrendIcon()}
              <span className={`text-sm font-medium capitalize ${
                results.trendDirection === 'rising' ? 'text-emerald-600 dark:text-emerald-400' :
                results.trendDirection === 'declining' ? 'text-red-600 dark:text-red-400' :
                'text-amber-600 dark:text-amber-400'
              }`}>
                {results.trendDirection} trend
              </span>
              <span className="text-sm text-gray-400">•</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {results.timeHorizon}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
              {query}
            </h2>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            <svg
              className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Confidence Score */}
        <div className="mt-4 flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">Confidence Score</span>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {results.confidenceScore}/10
              </span>
            </div>
            <div className="confidence-meter">
              <div
                className={`confidence-meter-fill ${getConfidenceColor()}`}
                style={{ width: `${results.confidenceScore * 10}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Overview */}
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Overview
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {results.overview}
            </p>
          </div>

          {/* Key Takeaways */}
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Key Takeaways
            </h3>
            <ul className="space-y-3">
              {results.keyTakeaways.map((takeaway, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">
                    {takeaway.text}
                    {renderCitations(takeaway.citations)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Chart */}
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Publication Trend
            </h3>
            <TrendChart data={results.chartData} />
          </div>

          {/* What to Watch */}
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              What to Watch
            </h3>
            <ul className="space-y-2">
              {results.watchList.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                  <svg className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sources */}
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Sources ({results.sources.length})
            </h3>
            <div className="space-y-3">
              {results.sources.map((source) => (
                <div
                  key={source.index}
                  className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={() => setSelectedSource(source)}
                >
                  <span className="flex-shrink-0 w-6 h-6 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-full flex items-center justify-center text-xs font-medium">
                    {source.index}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {source.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {source.source} • {source.publishedDate}
                    </p>
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              ))}
            </div>
          </div>

          {/* Share & Actions */}
          <div className="p-6 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center justify-between">
              <ShareButtons query={query} overview={results.overview} onShare={handleShare} />
              <div className="text-xs text-gray-400">
                Generated by {results.metadata.model} • {new Date(results.metadata.generatedAt).toLocaleString()}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Citation Modal */}
      {selectedSource && (
        <CitationModal
          source={selectedSource}
          onClose={() => setSelectedSource(null)}
        />
      )}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { getFeaturedTopics } from '@/lib/api';
import type { FeaturedTopic } from '@/types';

interface FeaturedTopicsProps {
  onTopicClick: (query: string) => void;
}

const iconGradients: Record<string, string> = {
  '🏥': 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/30',
  '🌱': 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30',
  '🤖': 'from-purple-500/20 to-purple-500/5 border-purple-500/30',
  '🔗': 'from-amber-500/20 to-amber-500/5 border-amber-500/30',
  '⚡': 'from-yellow-500/20 to-yellow-500/5 border-yellow-500/30',
  '🔬': 'from-pink-500/20 to-pink-500/5 border-pink-500/30',
};

const iconColors: Record<string, string> = {
  '🏥': 'text-cyan-400',
  '🌱': 'text-emerald-400',
  '🤖': 'text-purple-400',
  '🔗': 'text-amber-400',
  '⚡': 'text-yellow-400',
  '🔬': 'text-pink-400',
};

export default function FeaturedTopics({ onTopicClick }: FeaturedTopicsProps) {
  const [topics, setTopics] = useState<FeaturedTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTopics() {
      try {
        const data = await getFeaturedTopics();
        setTopics(data.featured);
      } catch (error) {
        console.error('Failed to load featured topics:', error);
        // Use fallback topics
        setTopics([
          {
            query: 'AI in healthcare',
            title: 'AI in Healthcare',
            description: 'Explore how artificial intelligence is transforming medical diagnostics and patient care.',
            icon: '🏥',
            category: 'Technology',
            trend: 'rising',
            searchCount: 156
          },
          {
            query: 'carbon-neutral startups',
            title: 'Carbon-Neutral Startups',
            description: 'Discover climate tech ventures focused on achieving net-zero emissions.',
            icon: '🌱',
            category: 'Sustainability',
            trend: 'rising',
            searchCount: 89
          },
          {
            query: 'generative AI enterprise',
            title: 'Generative AI in Enterprise',
            description: 'Learn how businesses are adopting generative AI for productivity.',
            icon: '🤖',
            category: 'Technology',
            trend: 'rising',
            searchCount: 112
          },
          {
            query: 'Web3 funding decline',
            title: 'Web3 Funding Trends',
            description: 'Analyze the shifting investment landscape in blockchain technologies.',
            icon: '🔗',
            category: 'Finance',
            trend: 'declining',
            searchCount: 72
          },
          {
            query: 'renewable energy investment',
            title: 'Renewable Energy Investment',
            description: 'Track capital flows into solar, wind, and clean energy technologies.',
            icon: '⚡',
            category: 'Sustainability',
            trend: 'rising',
            searchCount: 98
          },
          {
            query: 'quantum computing applications',
            title: 'Quantum Computing',
            description: 'Explore practical use cases emerging from advances in quantum computing.',
            icon: '🔬',
            category: 'Technology',
            trend: 'stable',
            searchCount: 78
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    }

    loadTopics();
  }, []);

  const getTrendBadge = (trend: string) => {
    switch (trend) {
      case 'rising':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            Rising
          </span>
        );
      case 'declining':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 border border-red-500/30 text-red-400">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            Declining
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
            </svg>
            Stable
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800"
          >
            <div className="skeleton h-12 w-12 rounded-xl mb-4" />
            <div className="skeleton h-6 w-3/4 rounded mb-3" />
            <div className="skeleton h-4 w-full rounded mb-2" />
            <div className="skeleton h-4 w-2/3 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {topics.map((topic, index) => (
        <button
          key={topic.query}
          onClick={() => onTopicClick(topic.query)}
          className="group text-left p-6 rounded-2xl bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 hover:border-zinc-600 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/20 animate-fade-in-up opacity-0"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {/* Icon */}
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${iconGradients[topic.icon] || 'from-zinc-700/50 to-zinc-800/50 border-zinc-700'} border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
            <span className="text-2xl">{topic.icon}</span>
          </div>
          
          {/* Title & Trend */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className={`font-semibold text-lg text-white group-hover:${iconColors[topic.icon] || 'text-cyan-400'} transition-colors`}>
              {topic.title}
            </h3>
            {getTrendBadge(topic.trend)}
          </div>
          
          {/* Description */}
          <p className="text-sm text-zinc-400 line-clamp-2 mb-4">
            {topic.description}
          </p>
          
          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
            <span className="text-xs px-3 py-1 bg-zinc-800 rounded-full text-zinc-400">
              {topic.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-zinc-500">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {topic.searchCount.toLocaleString()}
            </span>
          </div>
          
          {/* Hover arrow indicator */}
          <div className="flex items-center gap-2 mt-4 text-zinc-500 group-hover:text-cyan-400 transition-colors">
            <span className="text-sm font-medium">Explore trend</span>
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </button>
      ))}
    </div>
  );
}

'use client';

import { useState, useCallback, useEffect, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import TrendCard from '@/components/TrendCard';
import FeaturedTopics from '@/components/FeaturedTopics';
import LoadingState from '@/components/LoadingState';
import { useSearch } from '@/hooks/useSearch';

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { results, isLoading, error, suggestions, search, fetchSuggestions, clearResults } = useSearch();
  const [hasSearched, setHasSearched] = useState(false);

  // Handle URL query parameter on mount
  const initialQueryHandled = useRef(false);
  
  useEffect(() => {
    const queryParam = searchParams.get('q');
    if (queryParam && !initialQueryHandled.current) {
      initialQueryHandled.current = true;
      setTimeout(() => {
        search(queryParam);
        setHasSearched(true);
      }, 0);
    }
  }, [searchParams, search]);

  const handleSearch = useCallback((query: string) => {
    search(query);
    setHasSearched(true);
    router.push(`/?q=${encodeURIComponent(query)}`, { scroll: false });
  }, [search, router]);

  const handleTopicClick = useCallback((query: string) => {
    handleSearch(query);
  }, [handleSearch]);

  const handleBackToHome = useCallback(() => {
    clearResults();
    setHasSearched(false);
    router.push('/', { scroll: false });
  }, [clearResults, router]);

  return (
    <div className="min-h-screen relative">
      {/* Animated background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      {/* Grid overlay */}
      <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none" />

      {/* Hero Section */}
      {!hasSearched && !isLoading && (
        <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 bg-gradient-hero">
          {/* Floating elements */}
          <div className="absolute top-20 left-10 w-20 h-20 border border-cyan-500/20 rounded-xl animate-float opacity-40" style={{ animationDelay: '0s' }} />
          <div className="absolute top-40 right-20 w-16 h-16 border border-purple-500/20 rounded-full animate-float opacity-30" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-40 left-20 w-12 h-12 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg animate-float" style={{ animationDelay: '2s' }} />
          
          <div className="relative max-w-5xl mx-auto text-center z-10">
            {/* Badge */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }} suppressHydrationWarning>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-8">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                <span className="text-cyan-400 text-sm font-medium tracking-wide">AI-Powered Research Intelligence</span>
              </div>
            </div>

            {/* Main heading */}
            <h1 className="animate-fade-in-up text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.1] tracking-tight" style={{ animationDelay: '0.2s' }} suppressHydrationWarning>
              <span className="text-white">Discover </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-gradient">
                Market Trends
              </span>
              <br />
              <span className="text-white/90 text-4xl md:text-5xl lg:text-6xl">Backed by Research</span>
            </h1>

            {/* Subtitle */}
            <p className="animate-fade-in-up text-xl md:text-2xl text-zinc-400 mb-12 max-w-3xl mx-auto leading-relaxed" style={{ animationDelay: '0.3s' }} suppressHydrationWarning>
              Get instant, credible insights from scholarly sources. TrendSage aggregates and summarizes the latest academic publications for any market trend.
            </p>

            {/* Search Bar */}
            <div className="animate-fade-in-up relative z-20" style={{ animationDelay: '0.4s' }} suppressHydrationWarning>
              <SearchBar
                onSearch={handleSearch}
                suggestions={suggestions}
                onInputChange={fetchSuggestions}
                isLoading={isLoading}
              />
            </div>

            {/* Stats row */}
            <div className="animate-fade-in-up mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto" style={{ animationDelay: '0.5s' }} suppressHydrationWarning>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-300">10K+</div>
                <div className="text-zinc-500 text-sm mt-1">Papers Analyzed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-300">Real-time</div>
                <div className="text-zinc-500 text-sm mt-1">AI Analysis</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-300">100%</div>
                <div className="text-zinc-500 text-sm mt-1">Cited Sources</div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 rounded-full border-2 border-zinc-600 flex justify-center pt-2">
              <div className="w-1 h-2 bg-cyan-400 rounded-full animate-pulse" />
            </div>
          </div>
        </section>
      )}

      {/* Featured Topics */}
      {!hasSearched && !isLoading && (
        <section className="relative py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Trending</span> Research Topics
              </h2>
              <p className="text-zinc-400 text-lg max-w-xl mx-auto">
                Explore what researchers and analysts are investigating right now
              </p>
            </div>
            <FeaturedTopics onTopicClick={handleTopicClick} />
          </div>
        </section>
      )}

      {/* Search Results */}
      {(hasSearched || isLoading) && (
        <section className="relative min-h-screen py-8 px-4 bg-gradient-hero">
          <div className="max-w-5xl mx-auto">
            {/* Back button & Search */}
            <div className="mb-8">
              <button
                onClick={handleBackToHome}
                className="group mb-6 inline-flex items-center gap-2 text-zinc-400 hover:text-cyan-400 transition-all duration-300"
              >
                <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Home</span>
              </button>

              <SearchBar
                onSearch={handleSearch}
                suggestions={suggestions}
                onInputChange={fetchSuggestions}
                isLoading={isLoading}
                initialQuery={searchParams.get('q') || ''}
              />
            </div>

            {/* Loading */}
            {isLoading && <LoadingState />}

            {/* Error */}
            {error && !isLoading && (
              <div className="card-glass p-8 text-center animate-fade-in">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Something went wrong</h3>
                <p className="text-zinc-400 mb-6">{error}</p>
                <button
                  onClick={() => handleSearch(searchParams.get('q') || '')}
                  className="btn-primary"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* No results */}
            {results && !results.results && !isLoading && (
              <div className="card-glass p-12 text-center animate-fade-in">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-zinc-800 flex items-center justify-center">
                  <svg className="w-10 h-10 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
                <p className="text-zinc-400">Try adjusting your search query or explore our trending topics.</p>
              </div>
            )}

            {/* Results */}
            {results && results.results && !isLoading && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <h2 className="text-xl font-semibold text-white">
                    Analysis: <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">{results.query}</span>
                  </h2>
                  <div className="tag tag-primary">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {results.results.sources?.length || 0} sources analyzed
                  </div>
                </div>

                <TrendCard query={results.query} results={results.results} />
              </div>
            )}
          </div>
        </section>
      )}

      {/* How it works */}
      {!hasSearched && !isLoading && (
        <section className="relative py-24 px-4 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                How <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">TrendSage</span> Works
              </h2>
              <p className="text-zinc-400 text-lg">
                From search to insights in seconds
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="card-glass p-8 text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 border border-cyan-500/30 flex items-center justify-center group-hover:glow-border transition-all">
                  <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="text-sm text-cyan-400 font-medium mb-2">Step 01</div>
                <h3 className="text-xl font-semibold text-white mb-3">Search a Trend</h3>
                <p className="text-zinc-400">Enter any market trend, technology, or topic you want to explore</p>
              </div>

              {/* Step 2 */}
              <div className="card-glass p-8 text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/30 flex items-center justify-center group-hover:glow-border transition-all">
                  <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="text-sm text-purple-400 font-medium mb-2">Step 02</div>
                <h3 className="text-xl font-semibold text-white mb-3">Aggregate Sources</h3>
                <p className="text-zinc-400">We fetch relevant papers, reports, and publications from top databases</p>
              </div>

              {/* Step 3 */}
              <div className="card-glass p-8 text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-pink-500/20 to-pink-500/5 border border-pink-500/30 flex items-center justify-center group-hover:glow-border transition-all">
                  <svg className="w-8 h-8 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="text-sm text-pink-400 font-medium mb-2">Step 03</div>
                <h3 className="text-xl font-semibold text-white mb-3">AI Summary</h3>
                <p className="text-zinc-400">Get a synthesized analysis with citations and actionable takeaways</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      {!hasSearched && !isLoading && (
        <footer className="relative py-12 px-4 border-t border-zinc-800/50">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">TS</span>
              </div>
              <span className="text-white font-semibold">TrendSage</span>
            </div>
            <p className="text-zinc-500 text-sm">
              © 2025 TrendSage. Powered by AI & Scholarly Research.
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <HomeContent />
    </Suspense>
  );
}

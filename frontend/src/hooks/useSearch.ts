'use client';

import { useState, useCallback, useRef } from 'react';
import { searchTrend, getSearchSuggestions } from '@/lib/api';
import type { SearchResponse } from '@/types';

export function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setError('Please enter a search query');
      return;
    }

    setIsLoading(true);
    setError(null);
    setQuery(searchQuery);

    try {
      const response = await searchTrend(searchQuery);
      setResults(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed. Please try again.');
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced suggestions fetch
  const fetchSuggestions = useCallback((input: string) => {
    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (input.length < 2) {
      setSuggestions([]);
      return;
    }

    // Debounce by 300ms
    debounceRef.current = setTimeout(async () => {
      try {
        const response = await getSearchSuggestions(input);
        setSuggestions(response.suggestions);
      } catch {
        setSuggestions([]);
      }
    }, 300);
  }, []);

  const clearResults = useCallback(() => {
    setResults(null);
    setError(null);
    setQuery('');
    setSuggestions([]);
  }, []);

  return {
    query,
    results,
    isLoading,
    error,
    suggestions,
    search,
    fetchSuggestions,
    clearResults,
    setQuery,
  };
}

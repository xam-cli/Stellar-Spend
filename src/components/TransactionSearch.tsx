'use client';

import { useState, useEffect, useRef } from 'react';
import type { Transaction } from '@/lib/transaction-storage';
import { cn } from '@/lib/cn';

interface TransactionSearchProps {
  wallet?: string;
  onSearch: (results: Transaction[]) => void;
  onFiltersChange?: (filters: Record<string, any>) => void;
}

export function TransactionSearch({
  wallet,
  onSearch,
  onFiltersChange,
}: TransactionSearchProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [amountMin, setAmountMin] = useState('');
  const [amountMax, setAmountMax] = useState('');
  const [currency, setCurrency] = useState('');
  const [isFavorite, setIsFavorite] = useState<string>('');
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Fetch suggestions
  useEffect(() => {
    if (!query.trim() || !wallet) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/transactions/search/suggestions?wallet=${encodeURIComponent(wallet)}&q=${encodeURIComponent(query)}`
        );
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.suggestions);
        }
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, wallet]);

  // Perform search
  const performSearch = async () => {
    if (!wallet) return;

    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        wallet,
        ...(query && { q: query }),
        ...(status !== 'all' && { status }),
        ...(dateFrom && { dateFrom: new Date(dateFrom).getTime().toString() }),
        ...(dateTo && { dateTo: new Date(dateTo).getTime().toString() }),
        ...(amountMin && { amountMin }),
        ...(amountMax && { amountMax }),
        ...(currency && { currency }),
        ...(isFavorite && { isFavorite }),
      });

      const res = await fetch(`/api/transactions/search?${params}`);
      if (res.ok) {
        const data = await res.json();
        onSearch(data.results);
        onFiltersChange?.({
          query,
          status,
          dateFrom,
          dateTo,
          amountMin,
          amountMax,
          currency,
          isFavorite,
        });
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performSearch();
      setShowSuggestions(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => query && setShowSuggestions(true)}
              placeholder="Search by ID, hash, account name..."
              className="w-full bg-[#0a0a0a] border border-[#333333] px-3 py-2 text-white text-sm"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 bg-[#1a1a1a] border border-[#333333] border-t-0 z-10"
              >
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-3 py-2 text-xs text-[#999999] hover:bg-[#222222] border-b border-[#333333] last:border-b-0"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={performSearch}
            disabled={isLoading}
            className={cn(
              'px-4 py-2 text-xs font-semibold transition-colors',
              isLoading
                ? 'bg-[#666666] text-[#999999] cursor-not-allowed'
                : 'bg-[#c9a962] text-[#0a0a0a] hover:bg-[#d4b574]'
            )}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-[#0a0a0a] border border-[#333333] px-2 py-1 text-white text-xs"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="reversed">Reversed</option>
        </select>

        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="bg-[#0a0a0a] border border-[#333333] px-2 py-1 text-white text-xs"
          title="From date"
        />

        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="bg-[#0a0a0a] border border-[#333333] px-2 py-1 text-white text-xs"
          title="To date"
        />

        <input
          type="number"
          value={amountMin}
          onChange={(e) => setAmountMin(e.target.value)}
          placeholder="Min amount"
          className="bg-[#0a0a0a] border border-[#333333] px-2 py-1 text-white text-xs"
        />

        <input
          type="number"
          value={amountMax}
          onChange={(e) => setAmountMax(e.target.value)}
          placeholder="Max amount"
          className="bg-[#0a0a0a] border border-[#333333] px-2 py-1 text-white text-xs"
        />

        <select
          value={isFavorite}
          onChange={(e) => setIsFavorite(e.target.value)}
          className="bg-[#0a0a0a] border border-[#333333] px-2 py-1 text-white text-xs"
        >
          <option value="">All</option>
          <option value="true">Favorites Only</option>
          <option value="false">Non-Favorites</option>
        </select>
      </div>
    </div>
  );
}

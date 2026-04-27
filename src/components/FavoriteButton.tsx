'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';

interface FavoriteButtonProps {
  transactionId: string;
  isFavorite?: boolean;
  onToggle?: (isFavorite: boolean) => void;
}

export function FavoriteButton({
  transactionId,
  isFavorite = false,
  onToggle,
}: FavoriteButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [favorite, setFavorite] = useState(isFavorite);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/transactions/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId }),
      });

      if (res.ok) {
        const data = await res.json();
        setFavorite(data.isFavorite);
        onToggle?.(data.isFavorite);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={cn(
        'p-1 transition-colors',
        favorite
          ? 'text-yellow-500 hover:text-yellow-600'
          : 'text-[#666666] hover:text-[#999999]'
      )}
      title={favorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <span className="text-lg">{favorite ? '★' : '☆'}</span>
    </button>
  );
}

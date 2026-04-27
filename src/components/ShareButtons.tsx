'use client';

import { useState } from 'react';
import { SharePlatform } from '@/types/sharing';

interface ShareButtonsProps {
  shareUrl: string;
  amount: string;
  currency: string;
  onShare?: (platform: SharePlatform) => void;
}

export function ShareButtons({ shareUrl, amount, currency, onShare }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareText = `I just completed a transaction of ${amount} ${currency} using Stellar-Spend! 🚀`;

  const platforms = [
    {
      id: 'twitter' as SharePlatform,
      label: 'Twitter',
      icon: '𝕏',
      color: 'bg-black',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      id: 'facebook' as SharePlatform,
      label: 'Facebook',
      icon: 'f',
      color: 'bg-blue-600',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      id: 'linkedin' as SharePlatform,
      label: 'LinkedIn',
      icon: 'in',
      color: 'bg-blue-700',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    },
    {
      id: 'email' as SharePlatform,
      label: 'Email',
      icon: '✉',
      color: 'bg-gray-600',
      url: `mailto:?subject=Check out my Stellar-Spend transaction&body=${encodeURIComponent(`I just completed a transaction of ${amount} ${currency}.\n\nView details: ${shareUrl}`)}`,
    },
  ];

  const handleShare = (platform: SharePlatform, url: string) => {
    onShare?.(platform);
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">Share this transaction</p>
      
      <div className="flex flex-wrap gap-2">
        {platforms.map((platform) => (
          <button
            key={platform.id}
            onClick={() => handleShare(platform.id, platform.url)}
            className={`${platform.color} text-white px-3 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition`}
            title={`Share on ${platform.label}`}
          >
            {platform.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={shareUrl}
          readOnly
          className="flex-1 px-3 py-2 border rounded-lg text-sm bg-gray-50"
        />
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-gray-200 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
    </div>
  );
}

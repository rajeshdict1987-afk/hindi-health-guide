'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Advertisement } from '../types/ad';
import { getStoredAds } from '../lib/store';
import { ExternalLink, Megaphone } from 'lucide-react';

interface AdDisplayProps {
  position: 'footer' | 'bottom' | 'mid' | 'article-sidebar' | 'article-inline';
  className?: string;
}

export function AdDisplay({ position, className = '' }: AdDisplayProps) {
  const [ads, setAds] = useState<Advertisement[]>([]);

  useEffect(() => {
    const allAds = getStoredAds();
    setAds(allAds.filter(ad => ad.active && ad.position === position));
  }, [position]);

  if (ads.length === 0) return null;

  const ad = ads[0];

  return (
    <div className={`bg-gradient-to-br from-white via-stone-50 to-rose-50/30 border-2 border-rose-500/20 rounded-2xl p-5 sm:p-6 shadow-md relative overflow-hidden group ${className}`}>
      {/* Ad Badge */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 text-[11px] uppercase tracking-wider bg-rose-600 text-white px-2.5 py-1 rounded-full font-bold shadow-sm">
        <Megaphone className="w-3.5 h-3.5 animate-pulse" />
        <span>विशेष विज्ञापन (Sponsored)</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-5 items-center">
        {ad.imageUrl && (
          <div className="w-full sm:w-44 h-32 relative rounded-xl overflow-hidden shrink-0 bg-stone-200 shadow-inner">
            <Image
              src={ad.imageUrl}
              alt={ad.title}
              fill
              className="object-cover group-hover:scale-105 transition duration-500"
              referrerPolicy="no-referrer"
            />
          </div>
        )}
        <div className="flex-1 min-w-0 space-y-2">
          <h4 className="font-black text-stone-900 text-lg sm:text-xl tracking-tight line-clamp-1 group-hover:text-rose-600 transition">
            {ad.title}
          </h4>
          <p className="text-sm text-stone-700 line-clamp-2 leading-relaxed">
            {ad.description}
          </p>
          {ad.targetUrl && (
            <div className="pt-1">
              <a
                href={ad.targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-rose-600 to-teal-600 hover:from-rose-700 hover:to-teal-700 px-4 py-2 rounded-xl shadow transition"
              >
                <span>अधिक जानें / विजिट करें</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

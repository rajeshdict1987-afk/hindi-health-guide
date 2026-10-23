'use client';

import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div 
      role="status" 
      aria-live="polite"
      className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-50 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 border border-amber-500/40 p-3.5 text-xs text-white shadow-2xl backdrop-blur animate-in fade-in slide-in-from-bottom duration-300"
    >
      <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center shrink-0">
        <WifiOff className="w-4 h-4 text-amber-400 animate-pulse" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-amber-300">ऑफ़लाइन मोड (Offline Mode)</p>
        <p className="text-[11px] text-stone-300 leading-snug">
          इंटरनेट कनेक्शन नहीं है। आप कैश्ड (सहेजे गए) स्वास्थ्य लेख पढ़ सकते हैं।
        </p>
      </div>
    </div>
  );
};

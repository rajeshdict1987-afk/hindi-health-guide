'use client';

import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X } from 'lucide-react';

export const PWAInstallButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:from-emerald-700 hover:to-teal-700 transition ${className}`}
        title="हिंदी हेल्थ गाइड ऐप इंस्टॉल करें"
      >
        <Download className="w-3.5 h-3.5" />
        <span>ऐप इंस्टॉल करें</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition ${className}`}
          title="iPhone / iPad पर इंस्टॉल करें"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>iOS ऐप</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-600" />
                  <span>iPhone / iPad पर जोड़ें</span>
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed space-y-2">
                1. Safari ब्राउज़र में नीचे दिए गए <strong>Share (शेयर)</strong> बटन <span className="font-mono text-emerald-700">⎋</span> पर टैप करें।<br />
                2. नीचे स्क्रॉल करें और <strong>&apos;Add to Home Screen (होम स्क्रीन पर जोड़ें)&apos;</strong> चुनें।
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition shadow"
              >
                समझ गया (Close)
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};

'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home, PhoneCall, ShieldAlert } from 'lucide-react';
import { SITE_CONFIG } from '../src/config/site-config';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to console for diagnostics
    console.error('Unhandled App Router Error:', error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 bg-stone-50">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-md border border-stone-200 p-8 sm:p-10 text-center space-y-6">
        {/* Error Icon */}
        <div className="w-16 h-16 rounded-2xl bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
          <AlertTriangle className="w-8 h-8" />
        </div>

        {/* Heading & Hindi Message */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">तकनीकी समस्या (Application Error)</span>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            क्षमा करें, पृष्ठ लोड करने में त्रुटि हुई
          </h1>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-md mx-auto">
            सर्वर अथवा पृष्ठ लोड करते समय कोई अप्रत्याशित समस्या उत्पन्न हुई है। कृपया पृष्ठ पुनः लोड करें या मुख्य पृष्ठ पर वापस जाएँ।
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>पुनः प्रयास करें (Try Again)</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold px-6 py-3 rounded-xl transition border border-stone-200"
          >
            <Home className="w-4 h-4 text-stone-600" />
            <span>होमपेज पर जाएँ</span>
          </Link>
        </div>

        {/* Health Emergency Notice */}
        <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 text-left space-y-2 text-xs text-stone-600">
          <div className="flex items-center gap-2 font-bold text-stone-800">
            <PhoneCall className="w-4 h-4 text-rose-600" />
            <span>आपातकालीन सहायता (National Health Helpline)</span>
          </div>
          <p>
            यदि आपको तुरंत चिकित्सकीय सलाह अथवा आपातकालीन परामर्श की आवश्यकता है, तो राष्ट्रीय स्वास्थ्य टोल-फ्री हेल्पलाइन <strong className="text-rose-700 font-mono text-sm">1075</strong> या <strong className="text-rose-700 font-mono text-sm">104</strong> पर कॉल करें।
          </p>
        </div>

        {/* Technical Digest for Debugging */}
        {error?.digest && (
          <div className="pt-2 border-t border-stone-100 text-[11px] font-mono text-stone-400">
            एरर संदर्भ कोड: <span className="text-stone-500">{error.digest}</span>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Share2, Search, ArrowLeft, Sparkles, BookOpen } from 'lucide-react';

function ShareTargetContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const title = searchParams.get('title') || '';
  const text = searchParams.get('text') || '';
  const url = searchParams.get('url') || '';

  const combinedQuery = [title, text].filter(Boolean).join(' ') || url;

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-emerald-100 p-6 sm:p-8 space-y-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center mx-auto shadow-md">
          <Share2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            PWA शेयर टारगेट (Share Target)
          </span>
          <h1 className="text-2xl font-black text-stone-900">
            स्वास्थ्य सामग्री प्राप्त हुई
          </h1>
          <p className="text-sm text-stone-600">
            आपके द्वारा शेयर किए गए विषय का विश्लेषण करने के लिए नीचे दिए गए विकल्पों में से चुनें।
          </p>
        </div>

        {(title || text || url) && (
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-left space-y-2 text-xs">
            {title && (
              <div>
                <span className="font-bold text-stone-500">शीर्षक:</span>
                <p className="font-semibold text-stone-900 text-sm mt-0.5">{title}</p>
              </div>
            )}
            {text && (
              <div>
                <span className="font-bold text-stone-500">सामग्री:</span>
                <p className="text-stone-700 line-clamp-3 mt-0.5">{text}</p>
              </div>
            )}
            {url && (
              <div>
                <span className="font-bold text-stone-500">लिंक:</span>
                <p className="text-teal-700 truncate mt-0.5 font-mono">{url}</p>
              </div>
            )}
          </div>
        )}

        <div className="space-y-3 pt-2">
          {combinedQuery && (
            <button
              onClick={() => router.push(`/search?q=${encodeURIComponent(combinedQuery)}`)}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-3.5 px-4 rounded-xl shadow hover:from-emerald-700 hover:to-teal-700 transition text-sm"
            >
              <Search className="w-4 h-4" />
              <span>संबंधित स्वास्थ्य लेख खोजें (Search Articles)</span>
            </button>
          )}

          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold py-3 px-4 rounded-xl transition text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>मुख्य पृष्ठ पर जाएं</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ShareTargetPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-stone-500">लोड हो रहा है...</div>}>
      <ShareTargetContent />
    </Suspense>
  );
}

'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { INITIAL_ARTICLES } from '../../src/data/initialArticles';
import { Search as SearchIcon, ArrowLeft, Clock, ArrowRight } from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams?.get('q') || '';

  const results = INITIAL_ARTICLES.filter(
    (a) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(query.toLowerCase()) ||
      a.categoryHindi.toLowerCase().includes(query.toLowerCase()) ||
      a.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="bg-stone-50 py-16 px-3 sm:px-6 space-y-12 min-h-[75vh] w-full">
      <div className="w-full max-w-full space-y-4">
        <Link href="/" className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 text-sm font-semibold transition">
          <ArrowLeft className="w-4 h-4" /> मुख्य पृष्ठ पर लौटें
        </Link>
        <h1 className="text-3xl font-bold text-stone-900 flex items-center gap-3">
          <SearchIcon className="w-8 h-8 text-rose-600" />
          <span>खोज परिणाम: &quot;{query}&quot;</span>
        </h1>
        <p className="text-stone-600 text-sm">कुल {results.length} लेख मिले।</p>
      </div>

      <div className="w-full max-w-full space-y-6">
        {results.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl text-center shadow-sm border border-stone-200 space-y-3">
            <h3 className="text-xl font-bold text-stone-800">कोई परिणाम नहीं मिला</h3>
            <p className="text-stone-500 text-sm">कृपया किसी अन्य कीवर्ड (जैसे: कंडोम, पीरियड्स, एसटीआई) के साथ खोजें।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {results.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-stone-200 transition flex flex-col sm:flex-row gap-6 items-center justify-between group"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3 text-xs text-stone-500">
                    <span className="bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full font-semibold">
                      {article.categoryHindi}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {article.readTime}
                    </span>
                  </div>
                  <h3 className="font-bold text-stone-900 text-xl group-hover:text-rose-600 transition">
                    {article.title}
                  </h3>
                  <p className="text-stone-600 text-sm line-clamp-2">{article.excerpt}</p>
                </div>
                <div className="shrink-0">
                  <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-600 px-4 py-2 rounded-xl text-sm font-semibold group-hover:bg-rose-600 group-hover:text-white transition">
                    पढ़ें <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[75vh] flex items-center justify-center p-8 text-stone-500">
          खोज परिणाम लोड हो रहे हैं...
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}

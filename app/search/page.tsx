'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { INITIAL_ARTICLES } from '../../src/data/initialArticles';
import { Search as SearchIcon, ArrowLeft, Clock, ArrowRight } from 'lucide-react';

import { getStoredArticles } from '../../src/lib/store';

function SearchContent() {
  const searchParams = useSearchParams();
  const rawQuery = searchParams?.get('q') || '';
  const query = rawQuery.trim();

  // Combine stored articles and initial articles for comprehensive search
  const [allArticles, setAllArticles] = React.useState<any[]>(INITIAL_ARTICLES);

  React.useEffect(() => {
    try {
      const stored = getStoredArticles();
      if (stored && stored.length > 0) {
        setAllArticles(stored);
      } else {
        fetch('/api/articles')
          .then((res) => res.json())
          .then((data) => {
            if (Array.isArray(data) && data.length > 0) setAllArticles(data);
          })
          .catch(() => {});
      }
    } catch {
      // fallback to INITIAL_ARTICLES
    }
  }, []);

  const searchTerms = query.toLowerCase().split(/\s+/).filter(Boolean);

  const results = allArticles.filter((a) => {
    if (!query) return true;
    const title = (a.title || '').toLowerCase();
    const excerpt = (a.excerpt || '').toLowerCase();
    const category = (a.categoryHindi || a.category || '').toLowerCase();
    const tags = Array.isArray(a.tags) ? a.tags.join(' ').toLowerCase() : '';
    const fullText = `${title} ${excerpt} ${category} ${tags}`;

    // If whole query matches directly
    if (fullText.includes(query.toLowerCase())) return true;

    // Or if all individual search terms match
    return searchTerms.length > 0 && searchTerms.some((term: string) => fullText.includes(term));
  });

  return (
    <div className="bg-emerald-50/30 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 space-y-10 min-h-[75vh] w-full">
      <div className="w-full max-w-5xl mx-auto space-y-4">
        <Link href="/" className="inline-flex items-center gap-2 text-teal-700 hover:text-teal-800 text-sm font-semibold transition">
          <ArrowLeft className="w-4 h-4" /> मुख्य पृष्ठ पर लौटें
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-3">
          <SearchIcon className="w-7 h-7 sm:w-8 sm:h-8 text-teal-700" />
          <span>खोज परिणाम: &quot;{query || 'सभी लेख'}&quot;</span>
        </h1>
        <p className="text-slate-600 text-sm">
          {searchTerms.length > 1 ? (
            <span>खोज शब्द: {searchTerms.map((t: string) => `"${t}"`).join(', ')} • </span>
          ) : null}
          कुल {results.length} लेख मिले।
        </p>
      </div>

      <div className="w-full max-w-5xl mx-auto space-y-6">
        {results.length === 0 ? (
          <div className="bg-white p-10 sm:p-14 rounded-3xl text-center shadow-sm border border-emerald-100 space-y-3">
            <h3 className="text-xl font-bold text-slate-800">कोई परिणाम नहीं मिला</h3>
            <p className="text-slate-500 text-sm">कृपया किसी अन्य कीवर्ड (जैसे: हिंदी, हेल्थ, प्रजनन स्वास्थ्य, कंडोम, पीरियड्स) के साथ खोजें।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {results.map((article) => (
              <Link
                key={article.id || article.slug}
                href={`/articles/${article.slug}`}
                className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs hover:shadow-md border border-slate-200/80 hover:border-teal-300 transition flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between group"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="bg-emerald-100 text-teal-800 px-2.5 py-0.5 rounded-full font-semibold">
                      {article.categoryHindi || 'स्वास्थ्य मार्गदर्शन'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {article.readTime || '4 मिनट'}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg sm:text-xl group-hover:text-teal-700 transition">
                    {article.title}
                  </h3>
                  <p className="text-slate-600 text-sm line-clamp-2">{article.excerpt}</p>
                </div>
                <div className="shrink-0 self-end sm:self-center">
                  <span className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-700 border border-teal-200 px-4 py-2 rounded-xl text-sm font-semibold group-hover:bg-teal-700 group-hover:text-white transition">
                    लेख पढ़ें <ArrowRight className="w-4 h-4" />
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

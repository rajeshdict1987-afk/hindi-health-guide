import React, { useState, useEffect } from 'react';
import { Search, X, BookOpen, ArrowLeft } from 'lucide-react';
import { articleService } from '../services/articleService';
import { SITE_CONFIG } from '../config/site-config';
import { ArticleCard } from '../components/ArticleCard';
import { SEOHead } from '../components/SEOHead';
import { useRouter } from '../context/RouterContext';

export const SearchPage: React.FC = () => {
  const { searchParams, navigate } = useRouter();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || '';

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
    setSelectedCategory(searchParams.get('category') || '');
  }, [searchParams]);

  const { articles: searchResults } = articleService.getArticles({
    searchQuery: query,
    categorySlug: selectedCategory || undefined,
    status: 'published',
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (selectedCategory) params.set('category', selectedCategory);
    navigate(`/search?${params.toString()}`);
  };

  const clearSearch = () => {
    setQuery('');
    navigate('/search');
  };

  return (
    <>
      <SEOHead
        title={query ? `खोज परिणाम: "${query}"` : 'स्वास्थ्य लेख खोजें'}
        description="हिंदी हेल्थ गाइड पर यौन एवं प्रजनन स्वास्थ्य संबंधी विषयों और डॉक्टर-समीक्षित लेखों की खोज करें।"
      />

      <div className="bg-stone-50 min-h-screen py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Header Form */}
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              स्वास्थ्य लेख एवं विषय खोजें
            </h1>
            <p className="mt-2 text-stone-600 text-sm sm:text-base">
              प्रमाणित चिकित्सा साक्ष्यों और डॉक्टर-समीक्षित गाइडों में से खोजें
            </p>

            <form onSubmit={handleSearchSubmit} className="mt-6 flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="खोजें: मासिक धर्म, कंडोम, आपातकालीन गोली, सहमति, प्यूबर्टी..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-11 pr-10 py-3.5 bg-white border border-stone-300 rounded-2xl text-stone-900 shadow-sm focus:outline-hidden focus:border-teal-700 text-sm sm:text-base"
                />
                <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-3.5" />
                {query && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3.5 top-3.5 text-stone-400 hover:text-stone-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-6 py-3.5 rounded-2xl transition shadow-sm text-sm sm:text-base shrink-0"
              >
                खोजें
              </button>
            </form>

            {/* Category Filter Pills */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => setSelectedCategory('')}
                className={`px-3 py-1.5 rounded-full transition font-semibold ${
                  !selectedCategory
                    ? 'bg-teal-700 text-white'
                    : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                }`}
              >
                सभी श्रेणियां
              </button>
              {SITE_CONFIG.categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCategory(c.slug === selectedCategory ? '' : c.slug)}
                  className={`px-3 py-1.5 rounded-full transition font-medium ${
                    selectedCategory === c.slug
                      ? 'bg-teal-700 text-white font-semibold'
                      : 'bg-white border border-stone-200 text-stone-700 hover:border-teal-600'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-200">
            <div className="text-sm text-stone-600">
              {query ? (
                <>
                  "<strong className="text-stone-900">{query}</strong>" के लिए कुल{' '}
                  <strong className="text-teal-700">{searchResults.length}</strong> परिणाम मिले
                </>
              ) : (
                <>
                  सभी उपलब्ध स्वास्थ्य लेख (<strong className="text-stone-900">{searchResults.length}</strong>)
                </>
              )}
            </div>
            {query && (
              <button
                onClick={clearSearch}
                className="text-xs text-stone-500 hover:text-teal-800 underline"
              >
                सभी लेख देखें
              </button>
            )}
          </div>

          {/* Results Grid or Empty State */}
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {searchResults.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-stone-300 max-w-xl mx-auto my-8">
              <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-stone-800">कोई परिणाम नहीं मिला</h3>
              <p className="text-sm text-stone-500 mt-1">
                "{query}" से मेल खाता कोई स्वास्थ्य लेख नहीं मिला। कृपया वर्तनी जांचें या कोई अन्य शब्द खोजें।
              </p>
              <div className="mt-6 pt-6 border-t border-stone-100">
                <p className="text-xs text-stone-400 font-semibold mb-3">सुझाए गए विषय:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['मासिक धर्म', 'कंडोम', 'आपातकालीन', 'हस्तमैथुन', 'सहमति'].map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setQuery(term);
                        navigate(`/search?q=${encodeURIComponent(term)}`);
                      }}
                      className="text-xs bg-teal-50 text-teal-800 px-3 py-1.5 rounded-lg hover:bg-teal-100 font-semibold transition"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

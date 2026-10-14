import React, { useState } from 'react';
import {
  ChevronRight,
  Filter,
  Stethoscope,
  BookOpen,
  ArrowLeft,
  Home,
} from 'lucide-react';
import { SITE_CONFIG } from '../config/site-config';
import { articleService } from '../services/articleService';
import { ArticleCard } from '../components/ArticleCard';
import { CategoryIcon } from '../components/CategoryIcon';
import { AdPlacement } from '../components/AdPlacement';
import { SEOHead } from '../components/SEOHead';
import { useRouter } from '../context/RouterContext';

interface CategoryPageProps {
  slug: string;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ slug }) => {
  const { navigate } = useRouter();
  const [onlyReviewed, setOnlyReviewed] = useState(false);

  // Find category in site config
  const category = SITE_CONFIG.categories.find((c) => c.slug === slug);

  if (!category) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-stone-900">श्रेणी नहीं मिली (Category Not Found)</h1>
        <p className="mt-3 text-stone-600">
          अनुरोधित श्रेणी उपलब्ध नहीं है। कृपया स्वीकृत श्रेणियों में से चुनें।
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 inline-flex items-center gap-2 bg-teal-700 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-teal-800 transition"
        >
          <ArrowLeft className="w-4 h-4" /> होमपेज पर लौटें
        </button>
      </div>
    );
  }

  const isSeventhCategory = category.isMedicallyReviewedOnly || slug === 'medically-reviewed-articles';

  // Query articles for this category
  const { articles: categoryArticles } = articleService.getArticles({
    categorySlug: slug,
    status: 'published',
    medicallyReviewedOnly: isSeventhCategory || onlyReviewed,
  });

  const canonicalUrl = `${SITE_CONFIG.productionUrl}/category/${category.slug}`;

  return (
    <>
      <SEOHead
        title={category.seoTitle}
        description={category.seoDescription}
        canonicalUrl={canonicalUrl}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: category.name,
          description: category.description,
          url: canonicalUrl,
          inLanguage: 'hi-IN',
        }}
      />

      <div className="bg-stone-50 min-h-screen py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-stone-500 mb-6" aria-label="Breadcrumb">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1 hover:text-teal-800 transition"
            >
              <Home className="w-3.5 h-3.5" /> होम
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <button
              onClick={() => {
                navigate('/');
                setTimeout(() => {
                  document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="hover:text-teal-800 transition"
            >
              श्रेणियां
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-semibold text-stone-900 truncate">{category.name}</span>
          </nav>

          {/* Category Header Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-xs mb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                    isSeventhCategory
                      ? 'bg-purple-700 text-white'
                      : 'bg-teal-700 text-white'
                  }`}
                >
                  <CategoryIcon name={category.iconName} className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                    {category.englishName}
                  </span>
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 mt-1">
                    {category.name}
                  </h1>
                  <p className="mt-3 text-stone-600 text-sm sm:text-base max-w-3xl leading-relaxed">
                    {category.description}
                  </p>
                </div>
              </div>

              {/* Filter toggle if not already 7th category */}
              {!isSeventhCategory && (
                <div className="self-start md:self-center shrink-0">
                  <button
                    onClick={() => setOnlyReviewed(!onlyReviewed)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 border transition ${
                      onlyReviewed
                        ? 'bg-purple-700 text-white border-purple-700 shadow-sm'
                        : 'bg-stone-50 text-stone-700 border-stone-300 hover:bg-stone-100'
                    }`}
                  >
                    <Stethoscope className="w-4 h-4" />
                    <span>केवल डॉक्टर-समीक्षित लेख ({onlyReviewed ? 'चालू' : 'बंद'})</span>
                  </button>
                </div>
              )}
            </div>

            {/* Category Meta Stats */}
            <div className="mt-6 pt-6 border-t border-stone-100 flex flex-wrap items-center justify-between text-xs sm:text-sm text-stone-500 gap-4">
              <div className="flex items-center gap-4">
                <span>
                  कुल लेख: <strong className="text-stone-900">{categoryArticles.length}</strong>
                </span>
                <span>•</span>
                <span>भाषा: <strong className="text-stone-900">हिंदी (hi-IN)</strong></span>
                <span>•</span>
                <span>मानक: <strong className="text-teal-700">WHO/NACO प्रमाणित</strong></span>
              </div>
              {isSeventhCategory && (
                <div className="inline-flex items-center gap-1.5 text-purple-700 bg-purple-50 px-3 py-1 rounded-md text-xs font-bold">
                  <Stethoscope className="w-3.5 h-3.5" />
                  सभी लेख NMC पंजीकृत चिकित्सकों द्वारा सत्यापित हैं
                </div>
              )}
            </div>
          </div>

          {/* Articles List */}
          {categoryArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categoryArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-stone-300">
              <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-stone-800">
                इस श्रेणी में वर्तमान में कोई प्रकाशित लेख नहीं है
              </h3>
              <p className="text-sm text-stone-500 mt-1 max-w-md mx-auto">
                हमारी मेडिकल संपादकीय टीम नए लेखों की समीक्षा कर रही है। कृपया शीघ्र ही पुनः देखें या अन्य श्रेणियों के लेख पढ़ें।
              </p>
              {onlyReviewed && (
                <button
                  onClick={() => setOnlyReviewed(false)}
                  className="mt-4 text-xs font-bold text-teal-700 underline"
                >
                  'केवल डॉक्टर-समीक्षित' फ़िल्टर हटाएं
                </button>
              )}
            </div>
          )}

          {/* Ad Placement */}
          <AdPlacement format="horizontal" className="mt-12" />

          {/* Other Categories Explorer */}
          <div className="mt-16 pt-12 border-t border-stone-200">
            <h3 className="text-xl font-bold text-stone-900 mb-6">
              अन्य स्वास्थ्य श्रेणियां देखें
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {SITE_CONFIG.categories
                .filter((c) => c.slug !== slug)
                .map((c) => (
                  <button
                    key={c.id}
                    onClick={() => navigate(`/category/${c.slug}`)}
                    className="p-3 bg-white rounded-xl border border-stone-200 hover:border-teal-600 hover:shadow-md transition text-left group"
                  >
                    <div className="text-teal-700 mb-1.5 group-hover:scale-110 transition-transform">
                      <CategoryIcon name={c.iconName} className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-bold text-stone-800 group-hover:text-teal-800 line-clamp-1">
                      {c.name}
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

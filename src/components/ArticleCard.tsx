import React from 'react';
import { Clock, Calendar, Stethoscope, ArrowRight } from 'lucide-react';
import { Article } from '../types/article';
import { SITE_CONFIG } from '../config/site-config';
import { useRouter } from '../context/RouterContext';

interface ArticleCardProps {
  article: Article;
  variant?: 'standard' | 'compact' | 'featured';
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, variant = 'standard' }) => {
  const { navigate } = useRouter();
  const category = SITE_CONFIG.categories.find((c) => c.slug === article.categorySlug);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('hi-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const isReviewed = article.medicalReview && article.medicalReview.isReviewed;

  if (variant === 'featured') {
    return (
      <article
        onClick={() => navigate(`/articles/${article.slug}`)}
        className="group relative bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-xl hover:border-teal-500/40 transition-all duration-300 cursor-pointer grid grid-cols-1 lg:grid-cols-12 gap-0"
      >
        <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-full overflow-hidden bg-stone-100">
          <img
            src={article.image.url}
            alt={article.image.alt || article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
          {category && (
            <span className="absolute top-4 left-4 bg-teal-800/90 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-xs shadow-sm">
              {category.name}
            </span>
          )}
        </div>

        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {category && (
                <span className="hidden lg:inline-block bg-teal-50 text-teal-800 text-xs font-bold px-2.5 py-1 rounded-md">
                  {category.name}
                </span>
              )}
              {isReviewed && (
                <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 text-xs font-semibold px-2.5 py-1 rounded-md border border-purple-200/60">
                  <Stethoscope className="w-3.5 h-3.5" />
                  डॉक्टर द्वारा समीक्षित
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 group-hover:text-teal-800 transition leading-snug">
              {article.title}
            </h2>

            <p className="mt-3 text-stone-600 text-sm sm:text-base leading-relaxed line-clamp-3">
              {article.excerpt}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(article.publishedAt || article.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {article.readingTimeMinutes} मिनट पठन
              </span>
            </div>
            <span className="text-teal-700 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              पढ़ें <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article
        onClick={() => navigate(`/articles/${article.slug}`)}
        className="group flex gap-4 p-3 rounded-xl hover:bg-white hover:shadow-md transition cursor-pointer border border-transparent hover:border-stone-200"
      >
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden shrink-0 bg-stone-100">
          <img
            src={article.image.url}
            alt={article.image.alt || article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
        <div className="flex flex-col justify-between flex-1 min-w-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {category && (
                <span className="text-[11px] font-bold text-teal-700">{category.name}</span>
              )}
              {isReviewed && (
                <span className="text-[10px] font-semibold text-purple-700 flex items-center gap-0.5">
                  <Stethoscope className="w-3 h-3" /> समीक्षित
                </span>
              )}
            </div>
            <h3 className="text-sm font-bold text-stone-900 group-hover:text-teal-800 line-clamp-2 leading-snug">
              {article.title}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-stone-400 mt-2">
            <span>{article.readingTimeMinutes} मिनट</span>
            <span>•</span>
            <span>{formatDate(article.publishedAt || article.createdAt)}</span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      onClick={() => navigate(`/articles/${article.slug}`)}
      className="group bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-xl hover:border-teal-500/40 transition-all duration-300 flex flex-col cursor-pointer"
    >
      <div className="relative h-48 sm:h-52 overflow-hidden bg-stone-100">
        <img
          src={article.image.url}
          alt={article.image.alt || article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {category && (
          <span className="absolute top-3 left-3 bg-teal-800/90 text-white text-xs font-semibold px-2.5 py-1 rounded-md backdrop-blur-xs">
            {category.name}
          </span>
        )}
        {isReviewed && (
          <span className="absolute bottom-3 right-3 bg-purple-900/90 text-white text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 backdrop-blur-xs">
            <Stethoscope className="w-3 h-3" /> डॉक्टर-समीक्षित
          </span>
        )}
      </div>

      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-stone-900 group-hover:text-teal-800 transition line-clamp-2 leading-snug">
            {article.title}
          </h3>
          <p className="mt-2.5 text-stone-600 text-sm leading-relaxed line-clamp-3">
            {article.excerpt}
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span>{formatDate(article.publishedAt || article.createdAt)}</span>
            <span>•</span>
            <span>{article.readingTimeMinutes} मिनट पठन</span>
          </div>
          <span className="text-teal-700 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center">
            पढ़ें →
          </span>
        </div>
      </div>
    </article>
  );
};

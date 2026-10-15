'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Article } from '../types/article';
import { getStoredArticles } from '../lib/store';
import { SITE_CONFIG } from '../config/site-config';
import { ArrowLeft, Clock, Calendar, CheckCircle2, ShieldCheck, Share2, TrendingUp, FolderTree, PhoneCall } from 'lucide-react';
import { AdDisplay } from '../components/AdDisplay';

interface ArticlePageProps {
  slug: string;
}

export function ArticlePage({ slug }: ArticlePageProps) {
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const all = getStoredArticles();
    setAllArticles(all);
    const found = all.find((a) => a.slug === slug);
    if (found) {
      setArticle(found);
      setRelatedArticles(all.filter((a) => a.category === found.category && a.id !== found.id));
    }
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-3xl font-bold text-stone-900">लेख नहीं मिला (Article Not Found)</h1>
        <p className="text-stone-600">क्षमा करें, आप जिस लेख की तलाश कर रहे हैं वह मौजूद नहीं है या हटा दिया गया है।</p>
        <div>
          <Link href="/" className="inline-flex items-center gap-2 bg-rose-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-rose-700 transition">
            <ArrowLeft className="w-4 h-4" /> मुख्य पृष्ठ पर लौटें
          </Link>
        </div>
      </div>
    );
  }

  const trendingArticles = allArticles.slice(0, 5);

  return (
    <div className="bg-stone-50 pb-20">
      {/* Article Header Banner */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-rose-950 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Link href="/" className="inline-flex items-center gap-2 text-stone-300 hover:text-white text-sm font-medium transition">
            <ArrowLeft className="w-4 h-4" /> मुख्य पृष्ठ पर वापस जाएं
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-rose-600/85 text-white px-3.5 py-1 rounded-full text-xs font-semibold backdrop-blur">
              {article.categoryHindi}
            </span>
            <div className="flex items-center gap-2 text-stone-300 text-xs">
              <Clock className="w-3.5 h-3.5" />
              <span>{article.readTime} पढ़ने का समय</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight max-w-4xl">
            {article.title}
          </h1>

          <p className="text-lg text-stone-300 leading-relaxed max-w-3xl">
            {article.excerpt}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-700 text-sm text-stone-300 max-w-5xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-600/30 border border-rose-500/40 flex items-center justify-center font-bold text-white">
                {article.author?.name ? article.author.name.charAt(0) : 'ड'}
              </div>
              <div>
                <div className="font-semibold text-white">{article.author?.name || 'विशेषज्ञ'}</div>
                <div className="text-xs text-stone-400">{article.author?.role || 'डॉक्टर'}</div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-rose-400" />
                {new Date(article.publishedAt).toLocaleDateString('hi-IN')}
              </span>
              {article.reviewedBy && (
                <span className="flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 px-3 py-1 rounded-lg">
                  <ShieldCheck className="w-4 h-4" />
                  समीक्षित: {article.reviewedBy.name} ({article.reviewedBy.credentials})
                </span>
              )}
              <button 
                onClick={handleShare}
                className="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-white px-3 py-1.5 rounded-lg transition"
                title="शेयर करें"
              >
                <Share2 className="w-3.5 h-3.5" />
                {copied ? 'कॉपी हो गया!' : 'शेयर करें'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content & Sidebar 70/30 Grid Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Article Content (~70% width -> lg:col-span-8) */}
          <article className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden p-6 sm:p-10 space-y-8">
              {/* Featured Image */}
              {article.image?.url && (
                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-md">
                  <Image
                    src={article.image.url}
                    alt={article.image.alt || article.title}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                    priority
                  />
                </div>
              )}

              {/* Ad Display Inside Article Mid */}
              <AdDisplay position="mid" />

              {/* Content HTML */}
              <div 
                className="prose prose-stone max-w-none text-stone-800 leading-relaxed space-y-6 text-base sm:text-lg [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-stone-900 [&>h2]:mt-8 [&>h2]:mb-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2 [&>p]:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {/* Ad Display Bottom */}
              <AdDisplay position="bottom" />

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="pt-8 border-t border-stone-200 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider mr-2">टैग्स:</span>
                  {article.tags.map((tag, idx) => (
                    <span key={idx} className="bg-stone-100 text-stone-700 px-3 py-1 rounded-full text-xs font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Medical Review Notice */}
              <div className="bg-teal-50 border border-teal-200 p-6 rounded-2xl flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 mt-1">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="space-y-1 text-sm text-teal-900">
                  <h4 className="font-bold">विशेषज्ञ चिकित्सा समीक्षा (Medical Review)</h4>
                  <p className="text-teal-800 leading-relaxed">
                    यह लेख भारत के प्रमाणित स्वास्थ्य विशेषज्ञों और संपादकीय टीम द्वारा विश्व स्वास्थ्य संगठन (WHO) के दिशा-निर्देशों के तहत सत्यापित किया गया है।
                  </p>
                </div>
              </div>
            </div>

            {/* Related Articles in Same Category */}
            {relatedArticles.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-stone-900">संबंधित लेख</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedArticles.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/articles/${rel.slug}`}
                      className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-stone-200 transition flex flex-col justify-between group"
                    >
                      <div className="space-y-3">
                        <span className="text-xs font-semibold text-rose-600">{rel.categoryHindi}</span>
                        <h4 className="font-bold text-stone-900 text-lg group-hover:text-rose-600 transition line-clamp-2">
                          {rel.title}
                        </h4>
                        <p className="text-xs text-stone-600 line-clamp-2">{rel.excerpt}</p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                        <span>{rel.readTime}</span>
                        <span className="font-semibold text-rose-600 group-hover:translate-x-1 transition">पढ़ें &rarr;</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Right Sidebar (~30% width -> lg:col-span-4) featuring Related Posts, Categories, and 'article-sidebar' Ads */}
          <aside className="lg:col-span-4 space-y-8">
            
            {/* Article Sidebar Ad Display */}
            <AdDisplay position="article-sidebar" />

            {/* Categories Widget */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-stone-100 font-bold text-stone-900 text-lg">
                <FolderTree className="w-5 h-5 text-rose-600" />
                <h3>स्वास्थ्य श्रेणियां (Categories)</h3>
              </div>
              <ul className="space-y-2">
                {SITE_CONFIG.categories.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/category/${cat.slug}`}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-rose-50 text-stone-700 hover:text-rose-700 transition text-sm font-medium group"
                    >
                      <span>{cat.hindiName}</span>
                      <span className="text-stone-400 group-hover:translate-x-1 transition">&rarr;</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trending Articles Widget */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-stone-100 font-bold text-stone-900 text-lg">
                <TrendingUp className="w-5 h-5 text-rose-600" />
                <h3>ट्रेंडिंग स्वास्थ्य लेख</h3>
              </div>
              <div className="space-y-4">
                {trendingArticles.map((art, idx) => (
                  <Link
                    key={art.id}
                    href={`/articles/${art.slug}`}
                    className="flex items-start gap-3 group pb-3 border-b border-stone-100 last:border-0 last:pb-0"
                  >
                    <span className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-stone-900 group-hover:text-rose-600 transition line-clamp-2">
                        {art.title}
                      </h4>
                      <span className="text-xs text-stone-500">{art.readTime}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Helplines / Helpline Widget */}
            <div className="bg-gradient-to-br from-rose-900 to-rose-950 text-white rounded-3xl p-6 shadow-md space-y-4">
              <div className="flex items-center gap-2 text-rose-300">
                <PhoneCall className="w-5 h-5" />
                <h3 className="font-bold text-white text-lg">राष्ट्रीय स्वास्थ्य हेल्पलाइन</h3>
              </div>
              <p className="text-sm text-stone-200 leading-relaxed">
                गोपनीय चिकित्सा सलाह या आपातकालीन सहायता के लिए राष्ट्रीय टोल-फ्री नंबर पर संपर्क करें।
              </p>
              <div className="bg-white/10 rounded-2xl p-4 text-center font-mono font-bold text-lg tracking-wider text-rose-200 border border-white/20">
                1075 / 104
              </div>
            </div>

          </aside>

        </div>
      </div>
    </div>
  );
}

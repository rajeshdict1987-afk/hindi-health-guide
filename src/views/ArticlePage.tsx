'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Article } from '../types/article';
import { getStoredArticles } from '../lib/store';
import { SITE_CONFIG } from '../config/site-config';
import { ArrowLeft, Clock, Calendar, CheckCircle2, ShieldCheck, Share2, TrendingUp, FolderTree, PhoneCall } from 'lucide-react';
import { AdDisplay } from '../components/AdDisplay';
import { AdsterraNativeAd } from '../components/AdsterraNativeAd';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ReadingProgressBar } from '../components/ReadingProgressBar';

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
      setRelatedArticles(all.filter((a) => a.category === found.category && a.id !== found.id).slice(0, 4));
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

  // Step-by-Step / Section-wise Native Ad Placements (Requirement 1)
  const renderMilestoneContent = (htmlContent: string) => {
    if (!htmlContent) return null;

    // Split by <h2> tags to find natural content milestone boundaries
    const h2Sections = htmlContent.split(/(?=<h2)/i).filter(s => s.trim().length > 0);

    if (h2Sections.length >= 3) {
      const introSection = h2Sections[0];
      const causesSection = h2Sections[1];
      const solutionsSection = h2Sections.slice(2).join('');

      return (
        <div className="space-y-6">
          {/* Milestone 1: Introduction / Overview Section */}
          <div 
            className="prose prose-stone max-w-none text-stone-800 leading-relaxed space-y-6 text-base sm:text-lg [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-stone-900 [&>h2]:mt-8 [&>h2]:mb-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2 [&>p]:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: introSection }}
          />

          {/* Placement 1: After introduction / overview section */}
          <div className="py-2">
            <AdsterraNativeAd placement="article-after-intro" />
          </div>

          {/* Milestone 2: Problem / Causes description section */}
          <div 
            className="prose prose-stone max-w-none text-stone-800 leading-relaxed space-y-6 text-base sm:text-lg [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-stone-900 [&>h2]:mt-8 [&>h2]:mb-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2 [&>p]:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: causesSection }}
          />

          {/* Placement 2: After problem / causes description section */}
          <div className="py-2">
            <AdsterraNativeAd placement="article-after-causes" />
          </div>

          {/* Milestone 3: Remedies / Solutions & conclusions section */}
          <div 
            className="prose prose-stone max-w-none text-stone-800 leading-relaxed space-y-6 text-base sm:text-lg [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-stone-900 [&>h2]:mt-8 [&>h2]:mb-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2 [&>p]:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: solutionsSection }}
          />

          {/* Placement 3: After remedies / solutions section */}
          <div className="py-2">
            <AdsterraNativeAd placement="article-after-solutions" />
          </div>
        </div>
      );
    }

    // Fallback: If no <h2> tags, split by paragraph intervals
    const paragraphs = htmlContent.split('</p>').filter(p => p.trim().length > 0);
    if (paragraphs.length >= 4) {
      const part1 = paragraphs.slice(0, 1).join('</p>') + '</p>';
      const part2 = paragraphs.slice(1, 3).join('</p>') + '</p>';
      const part3 = paragraphs.slice(3).join('</p>');

      return (
        <div className="space-y-6">
          <div 
            className="prose prose-stone max-w-none text-stone-800 leading-relaxed space-y-6 text-base sm:text-lg [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-stone-900 [&>h2]:mt-8 [&>h2]:mb-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2 [&>p]:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: part1 }}
          />
          <div className="py-2">
            <AdsterraNativeAd placement="article-after-intro" />
          </div>
          <div 
            className="prose prose-stone max-w-none text-stone-800 leading-relaxed space-y-6 text-base sm:text-lg [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-stone-900 [&>h2]:mt-8 [&>h2]:mb-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2 [&>p]:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: part2 }}
          />
          <div className="py-2">
            <AdsterraNativeAd placement="article-after-causes" />
          </div>
          <div 
            className="prose prose-stone max-w-none text-stone-800 leading-relaxed space-y-6 text-base sm:text-lg [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-stone-900 [&>h2]:mt-8 [&>h2]:mb-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2 [&>p]:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: part3 }}
          />
          <div className="py-2">
            <AdsterraNativeAd placement="article-after-solutions" />
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div 
          className="prose prose-stone max-w-none text-stone-800 leading-relaxed space-y-6 text-base sm:text-lg [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-stone-900 [&>h2]:mt-8 [&>h2]:mb-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2 [&>p]:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
        <div className="py-2">
          <AdsterraNativeAd placement="article-after-solutions" />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-stone-50 pb-20 w-full overflow-x-hidden">
      <ReadingProgressBar />
      
      {/* Breadcrumbs Navigation */}
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 pt-4">
        <Breadcrumbs 
          items={[
            { label: article.categoryHindi, href: `/category/${article.category}` },
            { label: article.title }
          ]} 
        />
      </div>

      {/* Article Header Banner */}
      <header className="bg-gradient-to-br from-stone-900 via-stone-800 to-rose-950 text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 mt-4">
        <div className="max-w-[1400px] mx-auto space-y-6">
          <Link href="/" className="inline-flex items-center gap-2 text-stone-300 hover:text-white text-sm font-medium transition">
            <ArrowLeft className="w-4 h-4" /> मुख्य पृष्ठ पर वापस जाएं
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-rose-600/85 text-white px-3.5 py-1 rounded-full text-xs font-semibold backdrop-blur">
              {article.categoryHindi}
            </span>
            <div className="flex items-center gap-2 text-stone-300 text-xs">
              <Clock className="w-3.5 h-3.5 text-rose-400" />
              <span>{article.readTime} पढ़ने का समय</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black leading-tight max-w-4xl">
            {article.title}
          </h1>

          <p className="text-base sm:text-lg text-stone-300 leading-relaxed max-w-3xl">
            {article.excerpt}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-700 text-sm text-stone-300 max-w-5xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-600/30 border border-rose-500/40 flex items-center justify-center font-bold text-white text-base">
                {article.author?.name ? article.author.name.charAt(0) : 'र'}
              </div>
              <div>
                <div className="font-semibold text-white">{article.author?.name || 'राजेश कुमार साहू (गुरु)'}</div>
                <div className="text-xs text-rose-300 font-medium">{article.author?.role || 'मुख्य संपादक (Chief Editor)'}</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-stone-300">
                <Calendar className="w-4 h-4 text-rose-400" />
                <time dateTime={article.publishedAt}>{new Date(article.publishedAt).toLocaleDateString('hi-IN')}</time>
              </span>
              
              {/* Task 3: Clean "✅ एआई फैक्ट-चेक वेरिफाइड" green badge alongside the editor's details */}
              <span className="inline-flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-semibold px-3 py-1.5 rounded-lg shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>✅ एआई फैक्ट-चेक वेरिफाइड</span>
              </span>

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
      </header>

      {/* Responsive Framing: Mobile Stacked, Tablet Balanced, Desktop 60% Main / 25% Middle-Trending / 15% Sidebar */}
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 mt-8 w-full overflow-x-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-[minmax(0,60fr)_minmax(0,25fr)_minmax(0,15fr)] gap-6 sm:gap-8 items-start w-full">
          
          {/* Main Article Content (60% width on Desktop) */}
          <article className="lg:col-span-7 xl:col-span-1 space-y-8 min-w-0 w-full">
            <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden p-6 sm:p-10 space-y-8">
              
              {/* Featured Image */}
              {article.image?.url && (
                <figure className="relative aspect-video rounded-2xl overflow-hidden shadow-md bg-stone-100">
                  <Image
                    src={article.image.url}
                    alt={article.image.alt || article.title}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                    priority
                  />
                </figure>
              )}

              {/* AI Fact-Check Verification Banner */}
              <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-emerald-950 text-sm sm:text-base">
                        ✅ एआई फैक्ट-चेक वेरिफाइड (AI Fact-Checked & Verified)
                      </span>
                      <span className="bg-emerald-200/80 text-emerald-900 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-300">
                        WHO & NACO मानक
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-emerald-900/90 leading-relaxed">
                      इस स्वास्थ्य लेख के सभी चिकित्सकीय व वैज्ञानिक तथ्यों को राष्ट्रीय एड्स नियंत्रण संगठन (NACO), विश्व स्वास्थ्य संगठन (WHO) तथा स्वास्थ्य मंत्रालय के क्लिनिकल मानकों के अनुसार विश्लेषित एवं क्रॉस-वेरिफाइड किया गया है। मुख्य संपादक: <strong>राजेश कुमार साहू (गुरु)</strong>।
                    </p>
                  </div>
                </div>
              </div>

              {/* Render Milestone-Structured Article Content with Placements 1, 2, and 3 */}
              {renderMilestoneContent(article.content)}

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center gap-2">
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
                  <p className="text-teal-800 leading-relaxed text-xs sm:text-sm">
                    यह लेख भारत के प्रमाणित स्वास्थ्य विशेषज्ञों और संपादकीय टीम द्वारा विश्व स्वास्थ्य संगठन (WHO) के दिशा-निर्देशों के तहत सत्यापित किया गया है।
                  </p>
                </div>
              </div>

              {/* FAQ Section */}
              {article.faqs && article.faqs.length > 0 && (
                <section className="bg-stone-50 border border-stone-200 p-6 sm:p-8 rounded-2xl space-y-6 mt-6">
                  <h3 className="text-xl font-bold text-stone-900 border-b border-stone-200 pb-3">
                    अक्सर पूछे जाने वाले सवाल (FAQs)
                  </h3>
                  <div className="space-y-4">
                    {article.faqs.map((faq, index) => (
                      <div key={index} className="bg-white border border-stone-200 rounded-xl p-4 space-y-2 shadow-sm">
                        <h4 className="font-bold text-stone-900 text-base flex items-start gap-2">
                          <span className="text-rose-600 font-black">Q{index + 1}.</span> {faq.question}
                        </h4>
                        <p className="text-stone-700 text-sm leading-relaxed pl-6">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Placement 4: At the bottom of the article before related health posts */}
              <div className="pt-6 border-t border-stone-200/80">
                <AdsterraNativeAd placement="article-bottom-before-related" />
              </div>
            </div>
          </article>

          {/* Middle / Trending Section (25% width on Desktop) */}
          <section className="lg:col-span-3 xl:col-span-1 space-y-6 min-w-0 w-full lg:sticky lg:top-24 self-start">
            
            {/* Trending Articles Widget */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-stone-200 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-stone-100 font-bold text-stone-900 text-base sm:text-lg">
                <TrendingUp className="w-5 h-5 text-rose-600" />
                <h3>ट्रेंडिंग स्वास्थ्य लेख</h3>
              </div>
              <div className="space-y-3.5">
                {trendingArticles.map((art, idx) => (
                  <Link
                    key={art.id}
                    href={`/articles/${art.slug}`}
                    className="flex items-start gap-3 group pb-3 border-b border-stone-100 last:border-0 last:pb-0"
                  >
                    <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="space-y-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-rose-600 transition line-clamp-2 leading-snug">
                        {art.title}
                      </h4>
                      <span className="text-[11px] text-stone-500">{art.readTime}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Sticky Desktop Adsterra Native Ad */}
            <div className="py-1">
              <AdsterraNativeAd placement="sidebar-sticky" />
            </div>

            {/* Related Articles in Same Category */}
            {relatedArticles.length > 0 && (
              <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-stone-200 space-y-4">
                <h4 className="font-bold text-stone-900 text-sm sm:text-base pb-2 border-b border-stone-100">
                  संबंधित स्वास्थ्य लेख
                </h4>
                <div className="space-y-3">
                  {relatedArticles.slice(0, 4).map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/articles/${rel.slug}`}
                      className="block group space-y-1 pb-3 border-b border-stone-100 last:border-0 last:pb-0"
                    >
                      <span className="text-[11px] font-semibold text-rose-600">{rel.categoryHindi}</span>
                      <h5 className="font-bold text-stone-900 text-xs sm:text-sm group-hover:text-rose-600 transition line-clamp-2">
                        {rel.title}
                      </h5>
                      <span className="text-[11px] text-stone-500">{rel.readTime}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Right Sidebar (15% width on Desktop) */}
          <aside className="lg:col-span-2 xl:col-span-1 space-y-5 min-w-0 w-full lg:sticky lg:top-24 self-start">
            
            {/* Chief Editor Card */}
            <div className="bg-stone-900 text-white rounded-2xl p-4 shadow-sm space-y-2 border border-stone-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                  रा
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-xs text-white truncate">राजेश कुमार साहू</h4>
                  <p className="text-[10px] text-rose-300">मुख्य संपादक (Chief Editor)</p>
                </div>
              </div>
              <p className="text-[11px] text-stone-300 leading-tight">
                WHO एवं NACO दिशानिर्देशों के अनुरूप क्लिनिकल तथ्य समीक्षा।
              </p>
            </div>

            {/* Categories Widget */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200 space-y-3">
              <div className="flex items-center gap-1.5 pb-2 border-b border-stone-100 font-bold text-stone-900 text-xs uppercase tracking-wider">
                <FolderTree className="w-3.5 h-3.5 text-rose-600" />
                <span>श्रेणियां</span>
              </div>
              <ul className="space-y-1.5">
                {SITE_CONFIG.categories.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/category/${cat.slug}`}
                      className="flex items-center justify-between p-1.5 rounded-lg hover:bg-rose-50 text-stone-700 hover:text-rose-700 transition text-xs font-medium group"
                    >
                      <span className="truncate">{cat.hindiName}</span>
                      <span className="text-stone-400 group-hover:translate-x-0.5 transition text-[10px]">&rarr;</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Helplines Widget */}
            <div className="bg-gradient-to-br from-rose-900 to-rose-950 text-white rounded-2xl p-4 shadow-md space-y-2.5">
              <div className="flex items-center gap-1.5 text-rose-300">
                <PhoneCall className="w-4 h-4" />
                <h4 className="font-bold text-white text-xs">हेल्पलाइन</h4>
              </div>
              <p className="text-[11px] text-stone-200 leading-tight">
                गोपनीय आपातकालीन चिकित्सा सहायता (24x7)
              </p>
              <div className="bg-white/10 rounded-xl p-2 text-center font-mono font-bold text-base text-rose-200 border border-white/20">
                1075 / 104
              </div>
            </div>

            {/* Standalone Sidebar AdDisplay at bottom if configured */}
            <AdDisplay position="article-sidebar" />

          </aside>

        </div>
      </div>
    </div>
  );
}

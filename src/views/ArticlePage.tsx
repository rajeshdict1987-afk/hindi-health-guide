'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Article } from '../types/article';
import { getStoredArticles, mergeArticles } from '../lib/store';
import { SITE_CONFIG } from '../config/site-config';
import { ArrowLeft, Clock, Calendar, CheckCircle2, ShieldCheck, Share2, TrendingUp, FolderTree, PhoneCall } from 'lucide-react';
import { AdDisplay } from '../components/AdDisplay';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ReadingProgressBar } from '../components/ReadingProgressBar';
import { ClinicalReviewerBadge } from '../components/ClinicalReviewerBadge';
import AdsterraBanner from '../components/AdsterraBanner';
import AdsterraNative from '../components/AdsterraNative';
import { doc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';


interface ArticlePageProps {
  slug: string;
  initialArticle?: Article | null;
}

export function ArticlePage({ slug, initialArticle }: ArticlePageProps) {
  const [article, setArticle] = useState<Article | null>(initialArticle || null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const all = getStoredArticles();
    setAllArticles(all);

    // If initialArticle passed from server, initialize immediately
    if (initialArticle) {
      setArticle(initialArticle);
      setRelatedArticles(all.filter((a) => a.category === initialArticle.category && a.id !== initialArticle.id).slice(0, 4));
    }

    // Always fetch latest server articles via API for fresh desktop/mobile sync
    fetch('/api/articles')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.articles) && data.articles.length > 0) {
          const merged = mergeArticles(all, data.articles);
          setAllArticles(merged);
          const decodedSlug = decodeURIComponent(slug).trim().toLowerCase();
          const target = merged.find(
            (a: Article) => a.slug === slug || a.slug.toLowerCase() === decodedSlug || a.id === slug
          );
          if (target && !article) {
            setArticle(target);
            setRelatedArticles(merged.filter((a: Article) => a.category === target.category && a.id !== target.id).slice(0, 4));
          }
        }
      })
      .catch(() => {});

    if (!initialArticle) {
      const decodedSlug = decodeURIComponent(slug).trim();
      const normalizedTarget = decodedSlug.replace(/-+/g, '-').replace(/^-+|-+$/g, '');
      const found = all.find(
        (a) =>
          a.slug === slug ||
          a.slug === decodedSlug ||
          a.id === slug ||
          a.slug.replace(/-+/g, '-').replace(/^-+|-+$/g, '') === normalizedTarget
      );
      if (found) {
        setArticle(found);
        setRelatedArticles(all.filter((a) => a.category === found.category && a.id !== found.id).slice(0, 4));
      } else if (isFirebaseConfigured && db) {
        // Fallback to Firestore if needed and configured
        getDoc(doc(db, 'articles', slug))
          .then((docSnap) => {
            if (docSnap.exists()) {
              const artData = docSnap.data() as Article;
              setArticle(artData);
              setRelatedArticles(all.filter((a) => a.category === artData.category && a.id !== artData.id).slice(0, 4));
            }
          })
          .catch(() => {});
      }
    }
  }, [slug, initialArticle]);

  const handleShare = () => {
    const articleSlug = article?.slug || slug;
    const shareUrl = `https://www.hindihealthguide.org/articles/${articleSlug}`;
    const shareTitle = article?.title || 'हिंदी हेल्थ गाइड';
    const shareText = `${shareUrl}\n\n*${shareTitle}*\n\n${article?.excerpt || ''}`;

    if (navigator.share) {
      navigator.share({
        title: shareTitle,
        text: shareText,
        url: shareUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${shareTitle}\n${shareUrl}`);
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

  // In-Article Ad Banner Components
  const InArticleBanner1 = () => (
    <div className="my-8 not-prose flex flex-col items-center justify-center">
      <div className="hidden sm:block">
        <AdsterraBanner keyId="d2edcc8ed4140105f91b01b7c7314eef" width={468} height={60} />
      </div>
      <div className="block sm:hidden">
        <AdsterraBanner keyId="6ee720141ab5d1099514b9f6d51ceaa5" width={320} height={50} />
      </div>
    </div>
  );

  const InArticleBanner2 = () => (
    <div className="my-8 not-prose flex justify-center">
      <AdsterraBanner keyId="5d7e9c6d3afd394fc2cfcd19fabfe3b9" width={300} height={250} />
    </div>
  );

  const InArticleNative = () => (
    <div className="my-8 not-prose">
      <AdsterraNative />
    </div>
  );

  // Balanced, Non-destructive In-Article Ad & Content Renderer
  // Supports short articles up to 3,000+ words long-form articles without ANY truncation
  const renderMilestoneContent = (rawHtmlContent: string) => {
    if (!rawHtmlContent) return null;

    // Purge any 'गुरु' prefix from content
    const htmlContent = rawHtmlContent
      .replace(/गुरु\s*राजेश\s*कुमार\s*साहू/g, 'राजेश कुमार साहू')
      .replace(/गुरु\s*राजेश/g, 'राजेश')
      .replace(/Guru\s*Rajesh\s*Kumar\s*Sahu/gi, 'Rajesh Kumar Sahu')
      .replace(/Guru\s*Rajesh/gi, 'Rajesh');

    const isHtml = /<[a-z][\s\S]*>/i.test(htmlContent);

    // =========================================================================
    // BRANCH A: Plain text (not wrapped in HTML)
    // =========================================================================
    if (!isHtml) {
      const rawParas = htmlContent.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
      const paras = rawParas.length > 1 ? rawParas : htmlContent.split(/\n+/).map(p => p.trim()).filter(Boolean);
      const totalParas = paras.length;

      // Distribute ads across paragraphs for long articles (up to 3000 words)
      const adPositions: number[] = [];
      if (totalParas >= 12) {
        adPositions.push(Math.floor(totalParas * 0.25), Math.floor(totalParas * 0.55), Math.floor(totalParas * 0.8));
      } else if (totalParas >= 7) {
        adPositions.push(Math.floor(totalParas * 0.35), Math.floor(totalParas * 0.7));
      } else if (totalParas >= 4) {
        adPositions.push(Math.floor(totalParas * 0.5));
      }

      return (
        <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed space-y-6">
          {paras.map((para, idx) => (
            <React.Fragment key={idx}>
              <p className="text-gray-800 leading-relaxed text-base sm:text-lg">{para}</p>
              {adPositions[0] === idx && <InArticleBanner1 />}
              {adPositions[1] === idx && <InArticleNative />}
              {adPositions[2] === idx && <InArticleBanner2 />}
            </React.Fragment>
          ))}
          <div className="mt-8 pt-4 border-t border-stone-200 not-prose">
            <AdsterraNative />
          </div>
        </div>
      );
    }

    // =========================================================================
    // BRANCH B: HTML formatted articles (supports 3000+ words seamlessly)
    // =========================================================================
    const pRegex = /<\/p>/gi;
    const splitIndices: number[] = [];
    let match: RegExpExecArray | null;

    while ((match = pRegex.exec(htmlContent)) !== null) {
      splitIndices.push(match.index + match[0].length);
    }

    // If fewer than 4 paragraphs, render entire content in one single complete div
    if (splitIndices.length < 4) {
      return (
        <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed space-y-6 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-gray-900 [&>h2]:mt-8 [&>h2]:mb-4 [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-gray-800 [&>h3]:mt-6 [&>h3]:mb-3 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:space-y-2 [&>p]:leading-relaxed [&>p]:mb-4">
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          <InArticleBanner1 />
          <div className="mt-8 pt-4 border-t border-stone-200 not-prose">
            <AdsterraNative />
          </div>
        </div>
      );
    }

    // For longer articles with 4+ paragraphs (including 3000 words):
    const totalP = splitIndices.length;
    const selectedPoints: number[] = [];
    if (totalP >= 10) {
      selectedPoints.push(
        splitIndices[Math.floor(totalP * 0.25)],
        splitIndices[Math.floor(totalP * 0.55)],
        splitIndices[Math.floor(totalP * 0.8)]
      );
    } else {
      selectedPoints.push(
        splitIndices[Math.floor(totalP * 0.35)],
        splitIndices[Math.floor(totalP * 0.7)]
      );
    }

    // Slice cleanly at verified </p> boundaries with zero content loss
    const chunks: string[] = [];
    let prev = 0;
    for (const pt of selectedPoints) {
      if (pt > prev && pt < htmlContent.length) {
        chunks.push(htmlContent.substring(prev, pt));
        prev = pt;
      }
    }
    chunks.push(htmlContent.substring(prev));

    return (
      <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed space-y-6 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-gray-900 [&>h2]:mt-8 [&>h2]:mb-4 [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-gray-800 [&>h3]:mt-6 [&>h3]:mb-3 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:space-y-2 [&>p]:leading-relaxed [&>p]:mb-4">
        {chunks.map((chunk, idx) => (
          <React.Fragment key={idx}>
            <div dangerouslySetInnerHTML={{ __html: chunk }} />
            {idx === 0 && selectedPoints.length > 0 && <InArticleBanner1 />}
            {idx === 1 && selectedPoints.length >= 2 && (selectedPoints.length >= 3 ? <InArticleNative /> : <InArticleBanner2 />)}
            {idx === 2 && selectedPoints.length >= 3 && <InArticleBanner2 />}
          </React.Fragment>
        ))}
        <div className="mt-8 pt-4 border-t border-stone-200 not-prose">
          <AdsterraNative />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-stone-50 pb-20 w-full overflow-x-hidden">
      <ReadingProgressBar />
      
      {/* Breadcrumbs Navigation */}
      <div className="w-full max-w-full px-3 sm:px-6 pt-4">
        <Breadcrumbs 
          items={[
            { label: article.categoryHindi, href: `/category/${article.category}` },
            { label: article.title }
          ]} 
        />
      </div>

      {/* Article Header Banner */}
      <header className="bg-gradient-to-br from-stone-900 via-stone-800 to-rose-950 text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 mt-4 w-full">
        <div className="text-center flex flex-col items-center justify-center max-w-4xl mx-auto space-y-6 px-3 sm:px-6">
          <Link href="/" className="inline-flex items-center gap-2 text-stone-300 hover:text-white text-sm font-medium transition mb-1">
            <ArrowLeft className="w-4 h-4" /> मुख्य पृष्ठ पर वापस जाएं
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="bg-rose-600/85 text-white px-3.5 py-1 rounded-full text-xs font-semibold backdrop-blur shadow-sm">
              {article.categoryHindi}
            </span>
            <div className="flex items-center gap-2 text-stone-300 text-xs">
              <Clock className="w-3.5 h-3.5 text-rose-400" />
              <span>{article.readTime} पढ़ने का समय</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black leading-tight text-center tracking-tight">
            {article.title}
          </h1>

          <p className="text-base sm:text-lg text-stone-300 leading-relaxed text-center max-w-3xl">
            {article.excerpt}
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 pt-6 border-t border-stone-700/80 text-sm text-stone-300 w-full">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-600/30 border border-rose-500/40 flex items-center justify-center font-bold text-white text-base shrink-0">
                {(article.author?.name || 'राजेश कुमार साहू').replace(/गुरु\s*/gi, '').replace(/Guru\s*/gi, '').trim().charAt(0) || 'र'}
              </div>
              <div className="text-center sm:text-left">
                <div className="font-semibold text-white">
                  {(article.author?.name || 'राजेश कुमार साहू').replace(/गुरु\s*/gi, '').replace(/Guru\s*/gi, '').trim() || 'राजेश कुमार साहू'}
                </div>
                <div className="text-xs text-rose-300 font-medium">{article.author?.role || 'मुख्य संपादक (Chief Editor)'}</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-stone-300">
                <Calendar className="w-4 h-4 text-rose-400" />
                <time dateTime={article.publishedAt}>{new Date(article.publishedAt).toLocaleDateString('hi-IN')}</time>
              </span>
              
              {/* Task 3: Clean "✅ एआई फैक्ट-चेक वेरिफाइड" green badge alongside the editor's details */}
              <span className="inline-flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-semibold px-3 py-1.5 rounded-lg shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>✅ एआई फैक्ट-चेक वेरिफाइड</span>
              </span>

              <a 
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`https://www.hindihealthguide.org/articles/${article.slug}\n\n*${article.title}*\n\n${article.excerpt || ''}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg transition font-medium"
                title="WhatsApp पर शेयर करें"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>

              <button 
                onClick={handleShare}
                className="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-white px-3 py-1.5 rounded-lg transition cursor-pointer"
                title="शेयर या लिंक कॉपी करें"
              >
                <Share2 className="w-3.5 h-3.5" />
                {copied ? 'लिंक कॉपी हो गया!' : 'शेयर लिंक'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Top Banner (728x90 Desktop / 320x50 Mobile) */}
      <div className="w-full max-w-full px-3 sm:px-6 my-4">
        <div className="hidden md:flex justify-center">
          <AdsterraBanner keyId="79ab62f6d42e81834759afbed25d87f3" width={728} height={90} />
        </div>
        <div className="flex md:hidden justify-center">
          <AdsterraBanner keyId="6ee720141ab5d1099514b9f6d51ceaa5" width={320} height={50} />
        </div>
      </div>

      {/* Responsive Framing: Mobile Stacked, Tablet Balanced, Desktop 60% Main / 25% Middle-Trending / 15% Sidebar */}
      <div className="w-full max-w-full px-3 sm:px-6 mt-8 overflow-x-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,60fr)_minmax(0,25fr)_minmax(0,15fr)] gap-6 lg:gap-8 items-start w-full">
          
          {/* Main Article Content (60% width on Desktop) */}
          <article className="space-y-8 min-w-0 w-full">
            <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden p-6 sm:p-10 space-y-8">
              
              {/* Featured Image */}
              {article.image?.url && (
                <figure className="relative aspect-video rounded-2xl overflow-hidden shadow-md bg-stone-100">
                  <Image
                    src={article.image.url}
                    alt={article.image.alt || article.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 850px"
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
                      इस स्वास्थ्य लेख के सभी चिकित्सकीय व वैज्ञानिक तथ्यों को राष्ट्रीय एड्स नियंत्रण संगठन (NACO), विश्व स्वास्थ्य संगठन (WHO) तथा स्वास्थ्य मंत्रालय के क्लिनिकल मानकों के अनुसार विश्लेषित एवं क्रॉस-वेरिफाइड किया गया है। मुख्य संपादक: <strong>राजेश कुमार साहू</strong>।
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

              {/* Clinical Reviewer, Medical Board & Mandatory Disclaimer (YMYL / E-E-A-T) */}
              <ClinicalReviewerBadge article={article} />


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

              {/* Authoritative Medical Citation for AEO / GEO */}
              <div className="pt-6 border-t border-stone-200/80 bg-emerald-50/50 rounded-2xl p-4 sm:p-5 border border-emerald-100 flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-slate-700 space-y-1">
                  <p className="font-bold text-slate-900">चिकित्सीय समीक्षा एवं संदर्भ (Medical Review & Standards):</p>
                  <p className="leading-relaxed">
                    यह लेख <strong>विश्व स्वास्थ्य संगठन (WHO)</strong>, <strong>राष्ट्रीय एड्स नियंत्रण संगठन (NACO)</strong> एवं भारत सरकार के स्वास्थ्य एवं परिवार कल्याण मंत्रालय (MoHFW) के अधिकृत क्लिनिकल मानकों पर आधारित है।
                  </p>
                  <p className="text-[11px] text-slate-500 pt-1">
                    समीक्षक: <span className="font-semibold text-slate-800">राजेश कुमार साहू</span> (मुख्य संपादक) | किसी भी गंभीर व्यक्तिगत लक्षण हेतु निकटतम पंजीकृत चिकित्सक या सरकारी हेल्पलाइन 108/1097 पर संपर्क करें।
                  </p>
                </div>
              </div>
            </div>
          </article>

          {/* Middle / Trending Section (25% width on Desktop) */}
          <section className="space-y-6 min-w-0 w-full lg:sticky lg:top-24 self-start">
            
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
          <aside className="space-y-5 min-w-0 w-full lg:sticky lg:top-24 self-start">
            
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

            {/* Quick Health Tips Widget */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200 space-y-3">
              <div className="flex items-center gap-1.5 pb-2 border-b border-stone-100 font-bold text-stone-900 text-xs uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                <span>त्वरित स्वास्थ्य टिप्स</span>
              </div>
              <div className="space-y-2 text-[11px] text-stone-600 leading-tight">
                <div className="p-2 bg-stone-50 rounded-lg border border-stone-100">
                  <strong className="text-stone-800 block text-xs mb-0.5">दोहरी सुरक्षा</strong>
                  कंडोम अनचाहे गर्भ और एसटीआई दोनों से 98% रक्षा करता है।
                </div>
                <div className="p-2 bg-stone-50 rounded-lg border border-stone-100">
                  <strong className="text-stone-800 block text-xs mb-0.5">हेल्पलाइन</strong>
                  राष्ट्रीय एड्स हेल्पलाइन 1097 पर 24 घंटे मुफ्त सलाह उपलब्ध है।
                </div>
              </div>
            </div>

            {/* Standalone Sidebar AdDisplay at bottom if configured */}
            <AdDisplay position="article-sidebar" />

            {/* Adsterra Sticky Sidebar Banners */}
            <div className="space-y-4 pt-2">
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-stone-200 flex justify-center overflow-hidden">
                <AdsterraBanner keyId="5d7e9c6d3afd394fc2cfcd19fabfe3b9" width={300} height={250} />
              </div>
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-stone-200 flex justify-center overflow-hidden">
                <AdsterraBanner keyId="61dc3f3fb172427e9e611bb565029b7b" width={160} height={600} />
              </div>
            </div>

          </aside>

        </div>
      </div>
    </div>
  );
}

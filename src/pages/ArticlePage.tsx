import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  Share2,
  Printer,
  ChevronRight,
  ShieldAlert,
  ExternalLink,
  BookOpen,
  CheckCircle,
  HelpCircle,
  Copy,
  Check,
  Home,
  ArrowLeft,
} from 'lucide-react';
import { articleService } from '../services/articleService';
import { SITE_CONFIG } from '../config/site-config';
import { SEOHead } from '../components/SEOHead';
import { ArticleCard } from '../components/ArticleCard';
import { AdPlacement } from '../components/AdPlacement';
import { useRouter } from '../context/RouterContext';

interface ArticlePageProps {
  slug: string;
}

export const ArticlePage: React.FC<ArticlePageProps> = ({ slug }) => {
  const { navigate } = useRouter();
  const [copied, setCopied] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const article = articleService.getArticleBySlug(slug, true); // Include unpublished if editor preview
  const isPreview = article?.status !== 'published';

  useEffect(() => {
    if (article && article.status === 'published') {
      articleService.incrementViews(article.id);
    }
  }, [article?.id, article?.status]);

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-stone-900">लेख नहीं मिला (Article Not Found)</h1>
        <p className="mt-3 text-stone-600">
          अनुरोधित स्वास्थ्य लेख उपलब्ध नहीं है या हटा दिया गया है।
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 inline-flex items-center gap-2 bg-teal-700 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-teal-800 transition"
        >
          <ArrowLeft className="w-4 h-4" /> होमपेज पर जाएं
        </button>
      </div>
    );
  }

  const category = SITE_CONFIG.categories.find((c) => c.slug === article.categorySlug);
  const relatedArticles = articleService.getRelatedArticles(article.slug, article.categorySlug, 3);
  const isReviewed = article.medicalReview && article.medicalReview.isReviewed;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('hi-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareWhatsApp = () => {
    if (typeof window !== 'undefined') {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(`${article.title} - ${SITE_CONFIG.hindiName}: `);
      window.open(`https://api.whatsapp.com/send?text=${text}${url}`, '_blank');
    }
  };

  const handleShareTwitter = () => {
    if (typeof window !== 'undefined') {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(article.title);
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  // Structured Data (Article & FAQPage)
  const canonicalUrl = `${SITE_CONFIG.productionUrl}/articles/${article.slug}`;
  const jsonLdData: any = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.excerpt,
      image: [article.image.url],
      datePublished: article.publishedAt || article.createdAt,
      dateModified: article.updatedAt,
      author: {
        '@type': 'Person',
        name: article.author.name,
        jobTitle: article.author.hindiTitle,
      },
      publisher: {
        '@type': 'Organization',
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.productionUrl,
      },
      inLanguage: 'hi-IN',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonicalUrl,
      },
    },
  ];

  if (article.faqs && article.faqs.length > 0) {
    jsonLdData.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: article.faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer,
        },
      })),
    });
  }

  // Parse simple markdown headings and paragraphs
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-4" />;

      if (trimmed.startsWith('## ')) {
        const text = trimmed.replace('## ', '');
        return (
          <h2
            key={idx}
            id={`heading-${idx}`}
            className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-10 mb-4 pb-2 border-b border-stone-200 scroll-mt-24"
          >
            {text}
          </h2>
        );
      }

      if (trimmed.startsWith('### ')) {
        const text = trimmed.replace('### ', '');
        return (
          <h3
            key={idx}
            className="text-xl font-bold text-stone-800 mt-6 mb-3 scroll-mt-24"
          >
            {text}
          </h3>
        );
      }

      if (trimmed.startsWith('> ')) {
        const text = trimmed.replace('> ', '');
        return (
          <blockquote
            key={idx}
            className="border-l-4 border-teal-600 bg-teal-50/80 p-4 rounded-r-xl my-5 text-stone-800 text-sm sm:text-base italic"
          >
            {text}
          </blockquote>
        );
      }

      if (trimmed.startsWith('- ')) {
        const text = trimmed.replace('- ', '');
        return (
          <li key={idx} className="ml-6 list-disc text-stone-700 text-base sm:text-lg my-1.5 leading-relaxed">
            <span dangerouslySetInnerHTML={{ __html: formatInline(text) }} />
          </li>
        );
      }

      if (/^\d+\.\s/.test(trimmed)) {
        const text = trimmed.replace(/^\d+\.\s/, '');
        return (
          <li key={idx} className="ml-6 list-decimal text-stone-700 text-base sm:text-lg my-1.5 leading-relaxed">
            <span dangerouslySetInnerHTML={{ __html: formatInline(text) }} />
          </li>
        );
      }

      if (trimmed.startsWith('|')) {
        // Table row representation
        return (
          <div key={idx} className="text-xs sm:text-sm font-mono bg-stone-100 p-1.5 rounded overflow-x-auto my-1">
            {trimmed}
          </div>
        );
      }

      return (
        <p
          key={idx}
          className="text-stone-700 text-base sm:text-lg leading-relaxed sm:leading-loose my-3"
          dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }}
        />
      );
    });
  };

  const formatInline = (str: string) => {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-stone-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
  };

  return (
    <>
      <SEOHead
        title={article.seo.title || article.title}
        description={article.seo.metaDescription || article.excerpt}
        canonicalUrl={article.seo.canonicalUrl || canonicalUrl}
        ogType="article"
        publishedTime={article.publishedAt || article.createdAt}
        authorName={article.author.name}
        imageUrl={article.image.url}
        jsonLd={jsonLdData}
      />

      {/* Private Draft Preview Banner if draft */}
      {isPreview && (
        <div className="bg-amber-500 text-stone-950 font-bold px-4 py-2.5 text-center text-sm shadow-md flex items-center justify-center gap-2 sticky top-20 z-30">
          <ShieldAlert className="w-4 h-4" />
          <span>निजी पूर्वावलोकन (Private Preview Mode) – यह लेख अभी सार्वजनिक नहीं है ({article.status})</span>
          <button
            onClick={() => navigate(`/admin/articles/${article.id}/edit`)}
            className="underline ml-2 bg-stone-900 text-white px-2 py-0.5 rounded text-xs"
          >
            एडिट करें
          </button>
        </div>
      )}

      <article className="bg-white min-h-screen py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-stone-500 mb-6 no-print" aria-label="Breadcrumb">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1 hover:text-teal-800 transition"
            >
              <Home className="w-3.5 h-3.5" /> होम
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            {category && (
              <>
                <button
                  onClick={() => navigate(`/category/${category.slug}`)}
                  className="hover:text-teal-800 transition truncate max-w-[150px] sm:max-w-none"
                >
                  {category.name}
                </button>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              </>
            )}
            <span className="font-semibold text-stone-900 truncate max-w-[200px] sm:max-w-xs">
              {article.title}
            </span>
          </nav>

          {/* Category Badge & Meta */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {category && (
              <button
                onClick={() => navigate(`/category/${category.slug}`)}
                className="bg-teal-50 text-teal-800 hover:bg-teal-100 text-xs font-bold px-3 py-1.5 rounded-lg transition"
              >
                {category.name}
              </button>
            )}
            {isReviewed && (
              <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-purple-200">
                <Stethoscope className="w-3.5 h-3.5" />
                चिकित्सकीय रूप से समीक्षित (Medically Reviewed)
              </span>
            )}
          </div>

          {/* Article H1 Title */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight sm:leading-tight">
            {article.title}
          </h1>

          {/* Author, Dates & Reading Time */}
          <div className="mt-6 pt-6 border-t border-stone-100 flex flex-wrap items-center justify-between text-xs sm:text-sm text-stone-500 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-stone-900">{article.author.name}</div>
                <div className="text-xs text-stone-500">{article.author.hindiTitle}</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-stone-400" />
                {formatDate(article.publishedAt || article.createdAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-stone-400" />
                {article.readingTimeMinutes} मिनट पठन
              </span>
            </div>
          </div>

          {/* Doctor Review Callout Box if reviewed */}
          {isReviewed && article.medicalReview && (
            <div className="mt-8 bg-purple-50/70 border border-purple-200/90 rounded-2xl p-5 sm:p-6 text-xs sm:text-sm">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-extrabold text-purple-950 text-base">
                      चिकित्सक द्वारा सत्यापित एवं समीक्षित
                    </span>
                    <span className="text-purple-700 font-semibold text-xs">
                      समीक्षा तिथि: {formatDate(article.medicalReview.reviewedDate)}
                    </span>
                  </div>
                  <p className="text-stone-700">
                    इस लेख की चिकित्सा तथ्यों की प्रामाणिकता की समीक्षा{' '}
                    <strong className="text-stone-900">{article.medicalReview.reviewerName}</strong> (
                    {article.medicalReview.reviewerRole}) द्वारा की गई है।
                  </p>
                  {article.medicalReview.reviewerRegistration && (
                    <div className="text-stone-500 text-xs">
                      पंजीकरण विवरण:{' '}
                      <span className="font-mono font-medium text-stone-700">
                        {article.medicalReview.reviewerRegistration}
                      </span>
                    </div>
                  )}
                  {article.medicalReview.reviewNotes && (
                    <p className="text-purple-900/90 text-xs italic bg-purple-100/60 p-2.5 rounded-lg mt-2 border border-purple-200/50">
                      "नोट: {article.medicalReview.reviewNotes}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Quick Answer (सीधा उत्तर) Callout Box */}
          {article.quickAnswer && (
            <div className="mt-8 bg-teal-50 border-2 border-teal-600/30 rounded-2xl p-6 sm:p-7 shadow-xs">
              <div className="flex items-center gap-2 text-teal-900 font-extrabold text-lg sm:text-xl mb-2">
                <CheckCircle className="w-5 h-5 text-teal-700 shrink-0" />
                <span>सीधा उत्तर (Quick Answer)</span>
              </div>
              <p className="text-stone-800 text-base sm:text-lg leading-relaxed font-medium">
                {article.quickAnswer}
              </p>
            </div>
          )}

          {/* Social Share & Action Bar */}
          <div className="mt-8 pt-4 pb-4 border-y border-stone-200 flex flex-wrap items-center justify-between gap-4 no-print">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1 mr-1">
                <Share2 className="w-3.5 h-3.5" /> शेयर करें:
              </span>
              <button
                onClick={handleShareWhatsApp}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
              >
                WhatsApp
              </button>
              <button
                onClick={handleShareTwitter}
                className="bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
              >
                X (Twitter)
              </button>
              <button
                onClick={handleCopyLink}
                className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1 border border-stone-200"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'कॉपी हुआ!' : 'लिंक कॉपी'}</span>
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="text-stone-600 hover:text-stone-900 text-xs font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-stone-100 transition"
              title="लेख प्रिंट करें"
            >
              <Printer className="w-4 h-4" />
              <span>प्रिंट / PDF</span>
            </button>
          </div>

          {/* Featured Image */}
          <figure className="mt-8 rounded-3xl overflow-hidden border border-stone-200 bg-stone-100 shadow-sm">
            <img
              src={article.image.url}
              alt={article.image.alt || article.title}
              className="w-full max-h-[500px] object-cover"
            />
            {(article.image.caption || article.image.credit) && (
              <figcaption className="p-3 bg-stone-50 text-xs text-stone-500 flex flex-col sm:flex-row justify-between gap-1 border-t border-stone-200">
                <span>{article.image.caption}</span>
                {article.image.credit && (
                  <span className="text-stone-400 font-medium">स्रोत: {article.image.credit}</span>
                )}
              </figcaption>
            )}
          </figure>

          {/* Article Main Body */}
          <div className="mt-10 article-body prose prose-stone max-w-none">
            {renderFormattedContent(article.content)}
          </div>

          {/* Mid Article Ad */}
          <AdPlacement format="horizontal" className="my-10 no-print" />

          {/* FAQs Section */}
          {article.faqs && article.faqs.length > 0 && (
            <div className="mt-12 bg-stone-50 rounded-3xl p-6 sm:p-8 border border-stone-200">
              <div className="flex items-center gap-2 mb-6">
                <HelpCircle className="w-5 h-5 text-teal-700" />
                <h3 className="text-xl sm:text-2xl font-bold text-stone-900">
                  अक्सर पूछे जाने वाले सवाल (FAQ)
                </h3>
              </div>
              <div className="space-y-3">
                {article.faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-xl border border-stone-200 overflow-hidden transition"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full text-left p-4 font-bold text-stone-900 flex items-center justify-between gap-4 hover:text-teal-800"
                      >
                        <span className="text-sm sm:text-base">{faq.question}</span>
                        <span className="text-teal-700 text-lg font-mono">{isOpen ? '−' : '+'}</span>
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 text-stone-600 text-sm sm:text-base leading-relaxed border-t border-stone-100 pt-3">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Verified Scientific References Section */}
          {article.references && article.references.length > 0 && (
            <div className="mt-12 bg-stone-50/80 rounded-2xl p-6 border border-stone-200">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-base mb-4">
                <BookOpen className="w-4 h-4 text-teal-700" />
                <span>वैज्ञानिक एवं चिकित्सा संदर्भ (Verified Scientific References)</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm">
                {article.references.map((ref, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-stone-700">
                    <span className="text-stone-400 font-mono">[{idx + 1}]</span>
                    <div>
                      <strong className="text-stone-900">{ref.organization}</strong>: {ref.title}{' '}
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-700 hover:text-teal-900 font-medium inline-flex items-center gap-0.5 underline break-all"
                      >
                        सत्यापित स्रोत <ExternalLink className="w-3 h-3 inline" />
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Medical Disclaimer Callout */}
          <div className="mt-8 bg-amber-50 border border-amber-200/90 rounded-2xl p-5 text-xs text-amber-900 leading-relaxed flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-amber-950 font-bold mb-0.5">चिकित्सीय अस्वीकरण:</strong>
              यह जानकारी केवल जन जागरूकता और शिक्षा के लिए है। किसी भी शारीरिक लक्षण, संदेह या इलाज के लिए हमेशा अपने योग्य डॉक्टर से व्यक्तिगत परामर्श लें।
            </div>
          </div>

          {/* Author Card */}
          <div className="mt-10 bg-stone-100/70 rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left border border-stone-200">
            <div className="w-16 h-16 rounded-full bg-teal-700 text-white flex items-center justify-center font-extrabold text-xl shrink-0">
              {article.author.name.charAt(0)}
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-teal-800">लेखक परिचय</div>
              <h4 className="text-lg font-bold text-stone-900">{article.author.name}</h4>
              <p className="text-xs text-stone-500 font-semibold">{article.author.hindiTitle}</p>
              <p className="text-sm text-stone-600 mt-2 leading-relaxed">{article.author.bio}</p>
            </div>
          </div>

          {/* Related Articles Grid */}
          {relatedArticles.length > 0 && (
            <div className="mt-16 pt-10 border-t border-stone-200 no-print">
              <h3 className="text-xl sm:text-2xl font-bold text-stone-900 mb-6">
                संबंधित स्वास्थ्य लेख
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((rel) => (
                  <ArticleCard key={rel.id} article={rel} />
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  HeartPulse, 
  BookOpen, 
  ShieldAlert, 
  CheckCircle2, 
  HelpCircle, 
  Smile, 
  MessageSquare,
  ArrowRight, 
  CheckCircle, 
  ShieldCheck, 
  Sparkles,
  Users,
  Award,
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FolderTree,
  TrendingUp,
  PhoneCall,
  Zap
} from 'lucide-react';
import { SITE_CONFIG, CategoryConfig } from '../config/site-config';
import { Article } from '../types/article';
import { getStoredArticles } from '../lib/store';
import { INITIAL_ARTICLES } from '../data/initialArticles';
import { AdDisplay } from '../components/AdDisplay';
import AdsterraBanner from '../components/AdsterraBanner';
import AdsterraNative from '../components/AdsterraNative';

const HERO_SLIDES = [
  {
    id: 'reproductive-health',
    categoryHindi: 'प्रजनन स्वास्थ्य',
    route: '/category/reproductive-health',
    badge: 'WHO प्रमाणित मानक • श्रेणी 1/7',
    title: 'सुरक्षित मातृत्व एवं संपूर्ण प्रजनन स्वास्थ्य',
    description: 'मासिक धर्म, गर्भधारण, पोषण और प्रजनन अंगों की वैज्ञानिक व प्रामाणिक जानकारी। योग्य विशेषज्ञों द्वारा समीक्षित क्लिनिकल तथ्य।',
    ctaText: 'प्रजनन स्वास्थ्य लेख पढ़ें',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'प्रजनन स्वास्थ्य - हिंदी हेल्थ गाइड',
    overlayBadge: 'विशेषज्ञ चिकित्सा समीक्षा',
    overlayText: 'योग्य स्त्री रोग विशेषज्ञों और स्वास्थ्य वैज्ञानिकों द्वारा सत्यापित सामग्री।',
  },
  {
    id: 'sexual-education',
    categoryHindi: 'यौन शिक्षा',
    route: '/category/sexual-education',
    badge: 'वैज्ञानिक व संकोचमुक्त समझ • श्रेणी 2/7',
    title: 'स्वस्थ जीवन एवं संकोचमुक्त वैज्ञानिक यौन शिक्षा',
    description: 'शारीरिक विकास, सुरक्षित संबंध, आपसी सहमति और वैज्ञानिक तथ्यों की स्पष्ट, प्रामाणिक व झिझकमुक्त समझ।',
    ctaText: 'यौन शिक्षा मार्गदर्शिका पढ़ें',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'यौन शिक्षा - हिंदी हेल्थ गाइड',
    overlayBadge: 'संकोचमुक्त मार्गदर्शन',
    overlayText: 'युवाओं और वयस्कों के लिए वैज्ञानिक व संवेदनशील स्वास्थ्य परामर्श।',
  },
  {
    id: 'sti-hiv-prevention',
    categoryHindi: 'एसटीआई और एचआईवी रोकथाम',
    route: '/category/sti-hiv-prevention',
    badge: 'NACO मानक समर्थित • हेल्पलाइन 1097 • श्रेणी 3/7',
    title: 'एसटीआई और एचआईवी से बचाव, लक्षण, जांच व उपचार',
    description: 'राष्ट्रीय एड्स नियंत्रण संगठन (NACO) के क्लिनिकल मानकों के अनुसार लक्षण पहचान, पोस्ट-एक्सपोजर प्रोफिलैक्सिस (PEP) और समय पर जांच।',
    ctaText: 'एचआईवी व एसटीआई बचाव गाइड',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'एसटीआई और एचआईवी रोकथाम - हिंदी हेल्थ गाइड',
    overlayBadge: 'गोपनीय जांच व उपचार',
    overlayText: 'राष्ट्रीय एड्स नियंत्रण संगठन (NACO) दिशा-निर्देशों के अनुरूप।',
  },
  {
    id: 'contraception-family-planning',
    categoryHindi: 'गर्भनिरोधक और परिवार नियोजन',
    route: '/category/contraception-family-planning',
    badge: 'दोहरी सुरक्षा (Dual Protection) • श्रेणी 4/7',
    title: 'आधुनिक गर्भनिरोधक विकल्प एवं सुरक्षित परिवार नियोजन',
    description: 'कंडोम, ओरल पिल्स (छाया/माला-डी), आईयूडी (कॉपर-टी) व आपातकालीन गर्भनिरोध की सही खुराक और उपयोग विधि।',
    ctaText: 'गर्भनिरोधक विकल्प जानें',
    imageUrl: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'गर्भनिरोधक और परिवार नियोजन - हिंदी हेल्थ गाइड',
    overlayBadge: 'दोहरी सुरक्षा परामर्श',
    overlayText: 'अनचाहे गर्भ और एसटीआई संक्रमण से एक साथ पूर्ण सुरक्षा।',
  },
  {
    id: 'myths-facts',
    categoryHindi: 'मिथक और तथ्य',
    route: '/category/myths-facts',
    badge: '100% साइंटिफिक फैक्ट-चेक्ड • श्रेणी 5/7',
    title: 'यौन स्वास्थ्य के सामाजिक भ्रम बनाम चिकित्सा विज्ञान',
    description: 'हस्तमैथुन, स्वप्नदोष, शारीरिक बनावट और गुप्त रोगों से जुड़े सामाजिक अंधविश्वासों का वैज्ञानिक व चिकित्सकीय समाधान।',
    ctaText: 'सत्य और वैज्ञानिक तथ्य पढ़ें',
    imageUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'मिथक और तथ्य - हिंदी हेल्थ गाइड',
    overlayBadge: 'क्लिनिकल फैक्ट-चेक',
    overlayText: 'भ्रामक विज्ञापनों और नीम-हकीमों के अंधविश्वासों से सुरक्षित रहें।',
  },
  {
    id: 'mental-emotional-health',
    categoryHindi: 'मानसिक और भावनात्मक स्वास्थ्य',
    route: '/category/mental-emotional-health',
    badge: 'टेली-मानस 14416 समर्थित • श्रेणी 6/7',
    title: 'स्वस्थ संबंध, आपसी सहमति एवं भावनात्मक कल्याण',
    description: 'रिश्तों की समझ, यौन सहमति (Consent), चिंता, अवसाद और मानसिक तनाव से मुक्ति के वैज्ञानिक और मानवीय उपाय।',
    ctaText: 'मानसिक स्वास्थ्य लेख पढ़ें',
    imageUrl: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'मानसिक और भावनात्मक स्वास्थ्य - हिंदी हेल्थ गाइड',
    overlayBadge: 'भावनात्मक एवं मानसिक परामर्श',
    overlayText: 'सहमति, स्वस्थ रिश्ते और मानसिक शांति के लिए प्रमाणित क्लिनिकल परामर्श।',
  },
  {
    id: 'expert-advice-qa',
    categoryHindi: 'विशेषज्ञ सलाह और प्रश्नोत्तरी',
    route: '/category/expert-advice-qa',
    badge: '100% गोपनीय क्लिनिकल Q&A • श्रेणी 7/7',
    title: 'चिकित्सकीय सलाह, परामर्श एवं गोपनीय प्रश्नोत्तरी',
    description: 'वरिष्ठ स्त्री रोग, यूरोलॉजिस्ट और यौन रोग विशेषज्ञों द्वारा आपके व्यक्तिगत व संवेदनशील प्रश्नों के प्रामाणिक उत्तर।',
    ctaText: 'विशेषज्ञ प्रश्नोत्तरी पढ़ें',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'विशेषज्ञ सलाह और प्रश्नोत्तरी - हिंदी हेल्थ गाइड',
    overlayBadge: 'गोपनीय विशेषज्ञ उत्तर',
    overlayText: 'अनुभवी चिकित्सकों और स्वास्थ्य विशेषज्ञों द्वारा सत्यापित चिकित्सकीय समाधान।',
  },
];

export function HomePage() {
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const loaded = getStoredArticles();
    if (loaded && loaded.length > 0) {
      setArticles(loaded);
    }
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'HeartPulse': return <HeartPulse className="w-5 h-5 text-rose-600" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5 text-emerald-600" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5 text-amber-600" />;
      case 'CheckCircle2': return <CheckCircle2 className="w-5 h-5 text-blue-600" />;
      case 'HelpCircle': return <HelpCircle className="w-5 h-5 text-purple-600" />;
      case 'Smile': return <Smile className="w-5 h-5 text-indigo-600" />;
      case 'MessageSquare': return <MessageSquare className="w-5 h-5 text-teal-600" />;
      default: return <HeartPulse className="w-5 h-5 text-teal-600" />;
    }
  };

  // Helper to fetch 2-3 articles for a specific category with fallback
  const getCategoryArticles = (catSlug: string): Article[] => {
    const normalizedCategory = (itemCat: string) => {
      if (catSlug === 'sexual-education' && (itemCat === 'sex-education' || itemCat === 'sexual-education')) return true;
      if (catSlug === 'expert-advice-qa' && (itemCat === 'expert-advice-faq' || itemCat === 'expert-advice-qa')) return true;
      return itemCat === catSlug;
    };

    const found = articles.filter(a => normalizedCategory(a.category));
    if (found.length >= 2) {
      return found.slice(0, 3);
    }

    const fallback = INITIAL_ARTICLES.filter(a => normalizedCategory(a.category));
    return fallback.slice(0, 3);
  };

  // Category Sections grouped for alternating interleaving (Requirement 2)
  const catGroup1 = SITE_CONFIG.categories.slice(0, 2); // Categories 1 & 2
  const catGroup2 = SITE_CONFIG.categories.slice(2, 4); // Categories 3 & 4
  const catGroup3 = SITE_CONFIG.categories.slice(4, 6); // Categories 5 & 6
  const catGroup4 = SITE_CONFIG.categories.slice(6);    // Category 7

  const renderCategoryCard = (cat: CategoryConfig) => {
    const catArticles = getCategoryArticles(cat.slug);
    return (
      <div 
        key={cat.slug}
        className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 space-y-6"
      >
        {/* Category Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-stone-100 flex items-center justify-center shrink-0">
              {getCategoryIcon(cat.icon)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-stone-900">{cat.hindiName}</h3>
              <p className="text-xs text-stone-500 line-clamp-1">{cat.description}</p>
            </div>
          </div>

          <Link
            href={`/category/${cat.slug}`}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-xl transition self-start sm:self-auto"
          >
            <span>सभी {cat.hindiName} लेख देखें</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Direct Articles Grid (2-3 Articles) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {catArticles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="group bg-stone-50 hover:bg-white rounded-2xl p-4 border border-stone-200/80 hover:border-rose-200 hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-stone-200">
                  <Image
                    src={article.image.url}
                    alt={article.image.alt || article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-2 left-2 bg-stone-900/80 backdrop-blur text-white text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Clock className="w-3 h-3 text-rose-400" />
                    {article.readTime}
                  </span>
                </div>

                <h4 className="font-bold text-stone-900 text-base group-hover:text-rose-600 transition line-clamp-2 leading-snug">
                  {article.title}
                </h4>

                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-200/60 flex items-center justify-between text-xs text-stone-500">
                <span className="font-medium text-stone-700">{article.author?.name || 'राजेश कुमार साहू'}</span>
                <span className="text-rose-600 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition">
                  पढ़ें &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-16 pb-20 overflow-x-hidden w-full">
      {/* Top Banner (728x90 Desktop / 320x50 Mobile) */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 pt-4">
        <div className="hidden md:flex justify-center">
          <AdsterraBanner keyId="79ab62f6d42e81834759afbed25d87f3" width={728} height={90} />
        </div>
        <div className="flex md:hidden justify-center">
          <AdsterraBanner keyId="6ee720141ab5d1099514b9f6d51ceaa5" width={320} height={50} />
        </div>
      </div>

      {/* 5-Slide Interactive Auto-Carousel Hero Section (Auto changes every 3s, manual arrows & dot indicators) */}
      <section 
        className="relative bg-gradient-to-br from-slate-950 via-teal-950 to-emerald-950 text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        aria-roledescription="carousel"
        aria-label="प्रमुख स्वास्थ्य श्रेणियां हिंडोला"
      >
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        {/* Manual Navigation Arrows */}
        <button
          onClick={prevSlide}
          aria-label="पिछली स्लाइड"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/70 hover:bg-teal-700 text-white backdrop-blur border border-white/20 flex items-center justify-center transition cursor-pointer shadow-lg active:scale-95"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button
          onClick={nextSlide}
          aria-label="अगली स्लाइड"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/70 hover:bg-teal-700 text-white backdrop-blur border border-white/20 flex items-center justify-center transition cursor-pointer shadow-lg active:scale-95"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Carousel Slide Track */}
        <div className="w-full max-w-full relative z-10 px-4 sm:px-8 lg:px-12">
          <div className="relative min-h-[520px] sm:min-h-[440px] lg:min-h-[420px]">
            {HERO_SLIDES.map((slide, idx) => {
              const isActive = idx === currentSlide;
              return (
                <div
                  key={slide.id}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center transition-all duration-700 ease-in-out ${
                    isActive 
                      ? 'opacity-100 relative z-10 pointer-events-auto translate-x-0' 
                      : 'opacity-0 absolute inset-0 z-0 pointer-events-none -translate-x-4'
                  }`}
                  aria-hidden={!isActive}
                >
                  <div className="space-y-5 text-left">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-300">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{slide.badge}</span>
                    </div>

                    <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                      {slide.title}
                    </h1>

                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                      {slide.description}
                    </p>

                    <div className="flex flex-wrap gap-3.5 pt-2">
                      <Link
                        href={slide.route}
                        className="bg-teal-700 hover:bg-teal-800 text-white font-semibold px-5 sm:px-6 py-3 rounded-xl shadow-lg transition flex items-center gap-2 text-sm sm:text-base cursor-pointer"
                      >
                        <span>{slide.ctaText}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      <Link
                        href="/about"
                        className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold px-5 sm:px-6 py-3 rounded-xl backdrop-blur transition text-sm sm:text-base cursor-pointer"
                      >
                        संपादकीय नीति
                      </Link>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 aspect-video lg:aspect-4/3">
                      <Image
                        src={slide.imageUrl}
                        alt={slide.imageAlt}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                        priority={idx === 0}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex items-end p-5 sm:p-6">
                        <div className="space-y-1">
                          <span className="text-[11px] uppercase tracking-widest text-emerald-300 font-bold">
                            {slide.overlayBadge}
                          </span>
                          <p className="text-xs sm:text-sm font-medium text-white leading-snug">
                            {slide.overlayText}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dot Indicators */}
          <div className="flex items-center justify-center gap-2 pt-6">
            {HERO_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`स्लाइड ${idx + 1}: ${slide.categoryHindi}`}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentSlide
                    ? 'w-8 bg-emerald-400 shadow-md shadow-emerald-400/50'
                    : 'w-2.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="w-full max-w-full px-3 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm">100% प्रमाणिक</h3>
              <p className="text-xs text-stone-500 mt-0.5">वैज्ञानिक तथ्यों पर आधारित</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm">विशेषज्ञ टीम</h3>
              <p className="text-xs text-stone-500 mt-0.5">वरिष्ठ स्त्री रोग विशेषज्ञ</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm">गोपनीयता सुरक्षा</h3>
              <p className="text-xs text-stone-500 mt-0.5">पूरी तरह सुरक्षित एवं निजी</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm">मानक दिशा-निर्देश</h3>
              <p className="text-xs text-stone-500 mt-0.5">WHO / NACO अनुपालित</p>
            </div>
          </div>
        </div>
      </section>

      {/* FULL-WIDTH DESKTOP 3-COLUMN LAYOUT (60% Main Newsfeed - 25% Middle/Trending - 15% Right Sidebar) */}
      <section className="w-full max-w-full px-3 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,60fr)_minmax(0,25fr)_minmax(0,15fr)] gap-6 lg:gap-8 items-start w-full">
          
          {/* ============================================================ */}
          {/* LEFT MAIN COLUMN (60% width): Main News Feed & Articles List */}
          {/* ============================================================ */}
          <div className="space-y-10 min-w-0 w-full">
            
            {/* News Feed Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  <Zap className="w-3.5 h-3.5" />
                  <span>मुख्य स्वास्थ्य समाचार व प्रमाणित लेख</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                  ताजा क्लिनिकल मार्गदर्शिका एवं स्वास्थ्य समाचार
                </h2>
              </div>
              <span className="text-xs text-stone-500 font-semibold bg-stone-100 px-3 py-1.5 rounded-xl self-start sm:self-auto">
                {articles.length} प्रमाणित लेख
              </span>
            </div>

            {/* Adsterra Native Ad */}
            <div className="my-2">
              <AdsterraNative />
            </div>

            {/* Lead / Featured Article Card */}
            {articles[0] && (
              <Link
                href={`/articles/${articles[0].slug}`}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg border border-stone-200 transition block"
              >
                <div className="relative aspect-video sm:aspect-21/9 overflow-hidden bg-stone-100">
                  <Image
                    src={articles[0].image.url}
                    alt={articles[0].image.alt || articles[0].title}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-500"
                    referrerPolicy="no-referrer"
                    priority
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-rose-700 shadow">
                    विशेष आलेख • {articles[0].categoryHindi}
                  </div>
                </div>
                <div className="p-6 sm:p-7 space-y-3">
                  <div className="flex items-center gap-3 text-xs text-stone-500">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-rose-500" />
                      {articles[0].readTime}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-rose-500" />
                      {new Date(articles[0].publishedAt).toLocaleDateString('hi-IN')}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-stone-900 text-xl sm:text-2xl group-hover:text-rose-600 transition leading-snug">
                    {articles[0].title}
                  </h3>
                  <p className="text-stone-600 text-sm sm:text-base leading-relaxed line-clamp-2">
                    {articles[0].excerpt}
                  </p>
                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-xs">
                        {(articles[0].author?.name || 'रा').charAt(0)}
                      </div>
                      <span className="font-semibold text-stone-700">{articles[0].author?.name || 'राजेश कुमार साहू'}</span>
                    </div>
                    <span className="text-rose-600 font-bold flex items-center gap-1 group-hover:translate-x-1 transition">
                      विस्तार से पढ़ें &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {/* Recent Articles 2-Col Grid */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-stone-900 pb-2 border-b border-stone-100">
                हालिया प्रकाशित लेख (Recent Articles)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {articles.slice(1, 7).map((article) => (
                  <Link
                    key={article.id}
                    href={`/articles/${article.slug}`}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-stone-200 transition flex flex-col justify-between group"
                  >
                    <div>
                      <div className="relative aspect-video overflow-hidden bg-stone-100">
                        <Image
                          src={article.image.url}
                          alt={article.image.alt || article.title}
                          fill
                          className="object-cover group-hover:scale-105 transition duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-stone-800 shadow-xs">
                          {article.categoryHindi}
                        </div>
                      </div>
                      <div className="p-4 sm:p-5 space-y-2">
                        <div className="flex items-center gap-2 text-[11px] text-stone-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-rose-500" />
                            {article.readTime}
                          </span>
                          <span>•</span>
                          <span>{new Date(article.publishedAt).toLocaleDateString('hi-IN')}</span>
                        </div>
                        <h4 className="font-bold text-stone-900 text-sm sm:text-base group-hover:text-rose-600 transition line-clamp-2 leading-snug">
                          {article.title}
                        </h4>
                        <p className="text-stone-600 text-xs line-clamp-2 leading-relaxed">
                          {article.excerpt}
                        </p>
                      </div>
                    </div>
                    <div className="px-4 sm:px-5 pb-4 pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                      <span className="text-stone-600 font-medium truncate max-w-[130px]">{article.author?.name || 'राजेश कुमार साहू'}</span>
                      <span className="text-rose-600 font-bold group-hover:translate-x-1 transition shrink-0">पढ़ें &rarr;</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Adsterra 300x250 Banner */}
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-stone-200 flex justify-center overflow-hidden my-4">
              <AdsterraBanner keyId="5d7e9c6d3afd394fc2cfcd19fabfe3b9" width={300} height={250} />
            </div>

            {/* Category Deep Dives (Block 1: Categories 1 & 2) */}
            <div className="space-y-8">
              {catGroup1.map(renderCategoryCard)}
            </div>

            {/* Category Deep Dives (Block 2 & 3: Remaining Categories) */}
            <div className="space-y-8">
              {catGroup2.map(renderCategoryCard)}
              {catGroup3.map(renderCategoryCard)}
              {catGroup4.map(renderCategoryCard)}
            </div>

            {/* Standalone Sponsor Banner */}
            <div className="pt-2">
              <AdDisplay position="mid" />
            </div>

          </div>

          {/* ============================================================ */}
          {/* MIDDLE COLUMN (25% width): Top Categories, Trending & Guides */}
          {/* ============================================================ */}
          <div className="space-y-6 min-w-0 w-full lg:sticky lg:top-24 self-start">
            
            {/* Top Health Categories Widget */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-stone-200 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-stone-100 font-bold text-stone-900 text-base sm:text-lg">
                <FolderTree className="w-5 h-5 text-rose-600" />
                <h3>शीर्ष स्वास्थ्य श्रेणियां</h3>
              </div>
              <ul className="space-y-1.5">
                {SITE_CONFIG.categories.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/category/${cat.slug}`}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-rose-50 text-stone-700 hover:text-rose-700 transition text-xs sm:text-sm font-medium group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="shrink-0">{getCategoryIcon(cat.icon)}</span>
                        <span className="truncate">{cat.hindiName}</span>
                      </div>
                      <span className="text-stone-400 group-hover:translate-x-1 transition text-xs">&rarr;</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trending Health Articles Widget */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-stone-200 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-stone-100 font-bold text-stone-900 text-base sm:text-lg">
                <TrendingUp className="w-5 h-5 text-rose-600" />
                <h3>ट्रेंडिंग स्वास्थ्य लेख</h3>
              </div>
              <div className="space-y-3.5">
                {articles.slice(0, 5).map((art, idx) => (
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

            {/* Featured Health Guides */}
            <div className="bg-gradient-to-br from-teal-900 to-teal-950 text-white rounded-3xl p-5 sm:p-6 shadow-md space-y-4">
              <div className="flex items-center gap-2 text-teal-300">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-bold text-white text-base">विशेष स्वास्थ्य गाइड</h3>
              </div>
              <div className="space-y-3 text-xs">
                <Link
                  href="/category/reproductive-health"
                  className="block bg-white/10 hover:bg-white/20 p-3 rounded-xl transition border border-white/10"
                >
                  <span className="font-bold text-teal-200 block text-xs">सुरक्षित मातृत्व एवं प्रजनन गाइड</span>
                  <span className="text-stone-300 text-[11px] mt-0.5 block">क्लिनिकल पोषण एवं प्रजनन अंग स्वच्छता</span>
                </Link>
                <Link
                  href="/category/sti-hiv-prevention"
                  className="block bg-white/10 hover:bg-white/20 p-3 rounded-xl transition border border-white/10"
                >
                  <span className="font-bold text-teal-200 block text-xs">72-घंटे PEP व HIV सुरक्षा गाइड</span>
                  <span className="text-stone-300 text-[11px] mt-0.5 block">NACO दिशा-निर्देश व निःशुल्क ICTC केंद्र</span>
                </Link>
                <Link
                  href="/category/contraception-family-planning"
                  className="block bg-white/10 hover:bg-white/20 p-3 rounded-xl transition border border-white/10"
                >
                  <span className="font-bold text-teal-200 block text-xs">कंडोम व दोहरी सुरक्षा (Dual Protection)</span>
                  <span className="text-stone-300 text-[11px] mt-0.5 block">गर्भ व संक्रमण से 98% सुरक्षित रहने के नियम</span>
                </Link>
              </div>
            </div>

            {/* Adsterra 160x300 Banner */}
            <div className="bg-white p-3 rounded-3xl shadow-sm border border-stone-200 flex justify-center overflow-hidden">
              <AdsterraBanner keyId="f7a12dec279062caee5ec7fc0bf4ba24" width={160} height={300} />
            </div>

          </div>

          {/* ============================================================ */}
          {/* RIGHT SIDEBAR COLUMN (15% width): Helplines, Tips & Ads      */}
          {/* ============================================================ */}
          <div className="space-y-5 min-w-0 w-full lg:sticky lg:top-24 self-start">
            
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

            {/* National Helplines Widget */}
            <div className="bg-gradient-to-br from-rose-900 to-rose-950 text-white rounded-2xl p-4 shadow-md space-y-2.5">
              <div className="flex items-center gap-1.5 text-rose-300">
                <PhoneCall className="w-4 h-4" />
                <h4 className="font-bold text-white text-xs">राष्ट्रीय हेल्पलाइन</h4>
              </div>
              <p className="text-[11px] text-stone-200 leading-tight">
                गोपनीय आपातकालीन चिकित्सा सहायता (24x7)
              </p>
              <div className="bg-white/10 rounded-xl p-2 text-center font-mono font-bold text-base text-rose-200 border border-white/20">
                1075 / 104
              </div>
              <div className="space-y-1.5 font-mono text-center">
                <div className="bg-white/10 rounded-lg p-1.5 text-[11px] font-bold text-rose-200 border border-white/20">
                  एम्बुलेंस: 108 / 102
                </div>
                <div className="bg-white/10 rounded-lg p-1.5 text-[11px] font-bold text-rose-200 border border-white/20">
                  NACO एड्स: 1097
                </div>
                <div className="bg-white/10 rounded-lg p-1.5 text-[11px] font-bold text-rose-200 border border-white/20">
                  टेली-मानस: 14416
                </div>
              </div>
            </div>

            {/* Quick Health Tips Widget */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200 space-y-3">
              <div className="flex items-center gap-1.5 pb-2 border-b border-stone-100 font-bold text-stone-900 text-xs uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                <span>त्वरित स्वास्थ्य टिप्स</span>
              </div>
              <div className="space-y-2 text-[11px] text-stone-600 leading-tight">
                <div className="p-2 bg-stone-50 rounded-lg border border-stone-100">
                  <strong className="text-stone-800 block text-xs mb-0.5">दोहरी सुरक्षा</strong>
                  कंडोम अनचाहे गर्भ और एसटीआई दोनों से 98% रक्षा करता है।
                </div>
                <div className="p-2 bg-stone-50 rounded-lg border border-stone-100">
                  <strong className="text-stone-800 block text-xs mb-0.5">यूपीटी टेस्ट</strong>
                  पीरियड मिस होने के 5-7 दिन बाद सुबह की पेशाब से जांचें।
                </div>
                <div className="p-2 bg-stone-50 rounded-lg border border-stone-100">
                  <strong className="text-stone-800 block text-xs mb-0.5">दैनिक स्वच्छता</strong>
                  प्रतिदिन 3 लीटर पानी पिएं और केवल सादे पानी से सफाई रखें।
                </div>
              </div>
            </div>

            {/* Ad Placement */}
            <AdDisplay position="bottom" />

            {/* Adsterra 160x600 Skyscraper Banner */}
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-stone-200 flex justify-center overflow-hidden">
              <AdsterraBanner keyId="61dc3f3fb172427e9e611bb565029b7b" width={160} height={600} />
            </div>

          </div>

        </div>
      </section>

      {/* Medical Disclaimer Banner */}
      <section className="w-full max-w-full px-3 sm:px-6">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-bold text-amber-900 text-lg">चिकित्सा अस्वीकरण (Medical Disclaimer)</h3>
            <p className="text-amber-800 text-sm leading-relaxed">
              {SITE_CONFIG.hindiName} पर उपलब्ध सभी सामग्रियां केवल सामान्य जानकारी और शैक्षिक उद्देश्यों के लिए हैं। इसे पेशेवर चिकित्सीय निदान, सलाह या उपचार का विकल्प न समझें। स्वास्थ्य संबंधी किसी भी प्रश्न के लिए हमेशा अपने योग्य चिकित्सक से परामर्श लें।
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

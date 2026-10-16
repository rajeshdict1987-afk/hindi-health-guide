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
  ChevronRight
} from 'lucide-react';
import { SITE_CONFIG, CategoryConfig } from '../config/site-config';
import { Article } from '../types/article';
import { getStoredArticles } from '../lib/store';
import { INITIAL_ARTICLES } from '../data/initialArticles';
import { AdDisplay } from '../components/AdDisplay';
import { AdsterraNativeAd } from '../components/AdsterraNativeAd';

const HERO_SLIDES = [
  {
    id: 'reproductive-health',
    categoryHindi: 'प्रजनन स्वास्थ्य',
    route: '/category/reproductive-health',
    badge: 'WHO प्रमाणित मानक • श्रेणी 1/5',
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
    badge: 'वैज्ञानिक व संकोचमुक्त समझ • श्रेणी 2/5',
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
    badge: 'NACO मानक समर्थित • हेल्पलाइन 1097 • श्रेणी 3/5',
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
    badge: 'दोहरी सुरक्षा (Dual Protection) • श्रेणी 4/5',
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
    badge: '100% साइंटिफिक फैक्ट-चेक्ड • श्रेणी 5/5',
    title: 'यौन स्वास्थ्य के सामाजिक भ्रम बनाम चिकित्सा विज्ञान',
    description: 'हस्तमैथुन, स्वप्नदोष, शारीरिक बनावट और गुप्त रोगों से जुड़े सामाजिक अंधविश्वासों का वैज्ञानिक व चिकित्सकीय समाधान।',
    ctaText: 'सत्य और वैज्ञानिक तथ्य पढ़ें',
    imageUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'मिथक और तथ्य - हिंदी हेल्थ गाइड',
    overlayBadge: 'क्लिनिकल फैक्ट-चेक',
    overlayText: 'भ्रामक विज्ञापनों और नीम-हकीमों के अंधविश्वासों से सुरक्षित रहें।',
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <span className="font-medium text-stone-700">{article.author?.name || 'राजेश कुमार साहू (गुरु)'}</span>
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
      {/* 5-Slide Interactive Auto-Carousel Hero Section (Auto changes every 3s, manual arrows & dot indicators) */}
      <section 
        className="relative bg-gradient-to-br from-rose-900 via-stone-900 to-teal-950 text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        aria-roledescription="carousel"
        aria-label="प्रमुख स्वास्थ्य श्रेणियां हिंडोला"
      >
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#e11d48_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        {/* Manual Navigation Arrows */}
        <button
          onClick={prevSlide}
          aria-label="पिछली स्लाइड"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-stone-900/70 hover:bg-rose-600 text-white backdrop-blur border border-white/20 flex items-center justify-center transition cursor-pointer shadow-lg active:scale-95"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button
          onClick={nextSlide}
          aria-label="अगली स्लाइड"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-stone-900/70 hover:bg-rose-600 text-white backdrop-blur border border-white/20 flex items-center justify-center transition cursor-pointer shadow-lg active:scale-95"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Carousel Slide Track */}
        <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-12">
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
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-rose-300">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{slide.badge}</span>
                    </div>

                    <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                      {slide.title}
                    </h1>

                    <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-xl">
                      {slide.description}
                    </p>

                    <div className="flex flex-wrap gap-3.5 pt-2">
                      <Link
                        href={slide.route}
                        className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-5 sm:px-6 py-3 rounded-xl shadow-lg transition flex items-center gap-2 text-sm sm:text-base cursor-pointer"
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
                          <span className="text-[11px] uppercase tracking-widest text-teal-300 font-bold">
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
                    ? 'w-8 bg-rose-500 shadow-md shadow-rose-500/50'
                    : 'w-2.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

      {/* HEALTH CATEGORIES SECTION WITH INTERLEAVED NATIVE ADS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-700 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            स्वास्थ्य श्रेणियां एवं नवीनतम लेख
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            श्रेणी अनुसार स्वास्थ्य लेख पढ़ें
          </h2>
          <p className="text-stone-600 text-sm">
            प्रत्येक विषय के तहत डॉक्टरों और विशेषज्ञों द्वारा तैयार सीधे लेख देखें और बिना किसी बाधा के पढ़ें।
          </p>
        </div>

        {/* Alternating Interleaving: Category Block 1 (Categories 1 & 2) */}
        <div className="space-y-8">
          {catGroup1.map(renderCategoryCard)}
        </div>

        {/* NATIVE AD INTERLEAVING 1 (Between Cat 1-2 and Cat 3-4) */}
        <div className="py-2">
          <AdsterraNativeAd placement="homepage-interleave-1" />
        </div>

        {/* Alternating Interleaving: Category Block 2 (Categories 3 & 4) */}
        <div className="space-y-8">
          {catGroup2.map(renderCategoryCard)}
        </div>

        {/* NATIVE AD INTERLEAVING 2 (Between Cat 3-4 and Cat 5-6) */}
        <div className="py-2">
          <AdsterraNativeAd placement="homepage-interleave-2" />
        </div>

        {/* Alternating Interleaving: Category Block 3 (Categories 5 & 6) */}
        <div className="space-y-8">
          {catGroup3.map(renderCategoryCard)}
        </div>

        {/* NATIVE AD INTERLEAVING 3 (Between Cat 5-6 and Cat 7) */}
        <div className="py-2">
          <AdsterraNativeAd placement="homepage-interleave-3" />
        </div>

        {/* Alternating Interleaving: Category Block 4 (Category 7: Expert Advice & Q&A) */}
        <div className="space-y-8">
          {catGroup4.map(renderCategoryCard)}
        </div>
      </section>

      {/* Standalone Sponsor Banner (Separated) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdDisplay position="mid" />
      </section>

      {/* Latest All Articles Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">हालिया स्वास्थ्य लेख</h2>
            <p className="text-stone-600 text-sm mt-1">चिकित्सकों द्वारा समीक्षित ताजा स्वास्थ्य लेख और प्रामाणिक मार्गदर्शिकाएं</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.slice(0, 9).map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-stone-200 transition flex flex-col group"
            >
              <div className="relative aspect-video overflow-hidden bg-stone-100">
                <Image
                  src={article.image.url}
                  alt={article.image.alt || article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-stone-800 shadow">
                  {article.categoryHindi}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-rose-500" />
                      {article.readTime}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-rose-500" />
                      {new Date(article.publishedAt).toLocaleDateString('hi-IN')}
                    </span>
                  </div>
                  <h3 className="font-bold text-stone-900 text-lg group-hover:text-rose-600 transition line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-stone-600 text-sm line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-xs">
                      {(article.author?.name || 'राजेश कुमार साहू (गुरु)').charAt(0)}
                    </div>
                    <span className="text-xs font-medium text-stone-700">{article.author?.name || 'राजेश कुमार साहू (गुरु)'}</span>
                  </div>
                  <span className="text-rose-600 font-semibold text-xs sm:text-sm flex items-center gap-1 group-hover:translate-x-1 transition">
                    पूरा पढ़ें <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom Ad Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdDisplay position="bottom" />
      </section>

      {/* Medical Disclaimer Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

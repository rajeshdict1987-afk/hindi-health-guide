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
  Calendar
} from 'lucide-react';
import { SITE_CONFIG, CategoryConfig } from '../config/site-config';
import { Article } from '../types/article';
import { getStoredArticles } from '../lib/store';
import { INITIAL_ARTICLES } from '../data/initialArticles';
import { AdDisplay } from '../components/AdDisplay';
import { AdsterraNativeAd } from '../components/AdsterraNativeAd';

export function HomePage() {
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);

  useEffect(() => {
    const loaded = getStoredArticles();
    if (loaded && loaded.length > 0) {
      setArticles(loaded);
    }
  }, []);

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
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-rose-900 via-stone-900 to-teal-950 text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#e11d48_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-rose-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>WHO & NACO दिशा-निर्देशों द्वारा प्रमाणित</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              भारत का विश्वसनीय <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-teal-300">यौन एवं प्रजनन स्वास्थ्य</span> मंच
            </h1>
            <p className="text-base sm:text-lg text-stone-300 leading-relaxed">
              {SITE_CONFIG.description}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/category/reproductive-health"
                className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg transition flex items-center gap-2 text-sm sm:text-base"
              >
                <span>लेख पढ़ना शुरू करें</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/about"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold px-6 py-3.5 rounded-xl backdrop-blur transition text-sm sm:text-base"
              >
                हमारे बारे में जानें
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 aspect-video lg:aspect-4/3">
              <Image
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80"
                alt="Hindi Health Guide Hero"
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end p-6">
                <div className="space-y-1">
                  <span className="text-xs uppercase tracking-widest text-teal-300 font-bold">विशेषज्ञ चिकित्सा समीक्षा</span>
                  <p className="text-sm font-medium text-white">योग्य स्त्री रोग विशेषज्ञों और स्वास्थ्य वैज्ञानिकों द्वारा सत्यापित सामग्री।</p>
                </div>
              </div>
            </div>
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

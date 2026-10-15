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
  ArrowRight, 
  CheckCircle, 
  ShieldCheck, 
  Sparkles,
  Users,
  Award
} from 'lucide-react';
import { SITE_CONFIG } from '../config/site-config';
import { Article } from '../types/article';
import { getStoredArticles } from '../lib/store';
import { AdDisplay } from '../components/AdDisplay';

export function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    setArticles(getStoredArticles());
  }, []);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'HeartPulse': return <HeartPulse className="w-6 h-6 text-rose-600" />;
      case 'BookOpen': return <BookOpen className="w-6 h-6 text-emerald-600" />;
      case 'ShieldAlert': return <ShieldAlert className="w-6 h-6 text-amber-600" />;
      case 'CheckCircle2': return <CheckCircle2 className="w-6 h-6 text-blue-600" />;
      case 'HelpCircle': return <HelpCircle className="w-6 h-6 text-purple-600" />;
      case 'Smile': return <Smile className="w-6 h-6 text-indigo-600" />;
      default: return <HeartPulse className="w-6 h-6 text-teal-600" />;
    }
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-rose-900 via-stone-900 to-teal-950 text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#e11d48_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-rose-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>WHO & NACO दिशा-निर्देशों द्वारा प्रमाणित</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              भारत का विश्वसनीय <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-teal-300">यौन एवं प्रजनन स्वास्थ्य</span> मंच
            </h1>
            <p className="text-lg text-stone-300 leading-relaxed">
              {SITE_CONFIG.description}
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/category/reproductive-health"
                className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg transition flex items-center gap-2"
              >
                <span>लेख पढ़ना शुरू करें</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/about"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold px-6 py-3.5 rounded-xl backdrop-blur transition"
              >
                हमारे बारे में जानें
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 aspect-video lg:aspect-4/3">
              <Image
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80"
                alt="Hindi Health Guide Hero"
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6">
                <div className="space-y-1">
                  <span className="text-xs uppercase tracking-widest text-teal-300 font-bold">विशेषज्ञ समीक्षा</span>
                  <p className="text-sm font-medium text-white">योग्य स्त्री रोग विशेषज्ञों और स्वास्थ्य वैज्ञानिकों द्वारा सत्यापित सामग्री।</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm">100% प्रमाणिक</h3>
              <p className="text-xs text-stone-500 mt-0.5">वैज्ञानिक तथ्यों पर आधारित</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600 shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm">विशेषज्ञ टीम</h3>
              <p className="text-xs text-stone-500 mt-0.5">एम्स और देश के वरिष्ठ डॉक्टर</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm">गोपनीयता सुरक्षा</h3>
              <p className="text-xs text-stone-500 mt-0.5">आपकी जानकारी पूरी तरह सुरक्षित</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm">मानक दिशा-निर्देश</h3>
              <p className="text-xs text-stone-500 mt-0.5">WHO / NACO अनुपालित</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mid Ad Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdDisplay position="mid" />
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h2 className="text-3xl font-bold text-stone-900">स्वास्थ्य श्रेणियां</h2>
          <p className="text-stone-600 text-sm">अपने स्वास्थ्य और जिज्ञासा के अनुसार सही विषय चुनें और वैज्ञानिक जानकारी प्राप्त करें।</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SITE_CONFIG.categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-stone-200 transition group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  {getCategoryIcon(cat.icon)}
                </div>
                <h3 className="font-bold text-stone-900 text-lg mb-2 group-hover:text-rose-600 transition">{cat.hindiName}</h3>
                <p className="text-sm text-stone-600 leading-relaxed">{cat.description}</p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-rose-600 font-semibold text-sm">
                <span>लेख देखें</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Articles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-stone-900">हालिया स्वास्थ्य लेख</h2>
            <p className="text-stone-600 text-sm mt-1">चिकित्सकों द्वारा समीक्षित ताजा लेख और मार्गदर्शिकाएं</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-stone-200 transition flex flex-col group"
            >
              <div className="relative aspect-video overflow-hidden bg-stone-100">
                <Image
                  src={article.image.url}
                  alt={article.image.alt}
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
                    <span>पढ़ने का समय: {article.readTime}</span>
                    <span>•</span>
                    <span>{new Date(article.publishedAt).toLocaleDateString('hi-IN')}</span>
                  </div>
                  <h3 className="font-bold text-stone-900 text-xl group-hover:text-rose-600 transition line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-stone-600 text-sm line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-xs">
                      {article.author.name.charAt(0)}
                    </div>
                    <span className="text-xs font-medium text-stone-700">{article.author.name}</span>
                  </div>
                  <span className="text-rose-600 font-semibold text-sm flex items-center gap-1 group-hover:translate-x-1 transition">
                    पढ़ें <ArrowRight className="w-4 h-4" />
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
              {SITE_CONFIG.hindiName} पर उपलब्ध सभी सामग्रियां केवल सामान्य जानकारी और शैक्षिक उद्देश्यों के लिए हैं। इसे पेशेवर चिकित्सीय निदान, सलाह या उपचार का विकल्प न समझें। स्वास्थ्य संबंधी किसी भी प्रश्न के लिए हमेशा अपने चिकित्सक से परामर्श लें।
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

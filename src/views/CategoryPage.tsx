'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SITE_CONFIG, CategoryConfig } from '../config/site-config';
import { Article } from '../types/article';
import { getStoredArticles } from '../lib/store';
import { ArrowLeft, Clock, ArrowRight } from 'lucide-react';
import { AdDisplay } from '../components/AdDisplay';

import { INITIAL_ARTICLES } from '../data/initialArticles';

interface CategoryPageProps {
  slug: string;
}

export function CategoryPage({ slug }: CategoryPageProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const category = SITE_CONFIG.categories.find((c: CategoryConfig) => c.slug === slug);

  useEffect(() => {
    const all = getStoredArticles();
    const normalizedCategory = (itemCat: string) => {
      if (slug === 'sexual-education' && (itemCat === 'sex-education' || itemCat === 'sexual-education')) return true;
      if (slug === 'expert-advice-qa' && (itemCat === 'expert-advice-faq' || itemCat === 'expert-advice-qa')) return true;
      return itemCat === slug;
    };
    const filtered = all.filter((a) => normalizedCategory(a.category));
    if (filtered.length > 0) {
      setArticles(filtered);
    } else {
      setArticles(INITIAL_ARTICLES.filter((a) => normalizedCategory(a.category)));
    }
  }, [slug]);

  if (!category) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-3xl font-bold text-stone-900">श्रेणी नहीं मिली (Category Not Found)</h1>
        <p className="text-stone-600">क्षमा करें, आप जिस श्रेणी की तलाश कर रहे हैं वह मौजूद नहीं है।</p>
        <div>
          <Link href="/" className="inline-flex items-center gap-2 bg-rose-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-rose-700 transition">
            <ArrowLeft className="w-4 h-4" /> मुख्य पृष्ठ पर लौटें
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 pb-20 space-y-12">
      {/* Category Banner */}
      <div className="bg-gradient-to-br from-rose-900 via-stone-900 to-teal-950 text-white py-14 sm:py-16 px-4 sm:px-6 lg:px-8 w-full">
        <div className="w-full max-w-full space-y-4 px-3 sm:px-6">
          <Link href="/" className="inline-flex items-center gap-2 text-stone-300 hover:text-white text-sm font-medium transition">
            <ArrowLeft className="w-4 h-4" /> मुख्य पृष्ठ पर वापस जाएं
          </Link>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black">{category.hindiName}</h1>
          <p className="text-lg text-stone-300 w-full leading-relaxed">{category.description}</p>
        </div>
      </div>

      {/* Mid Ad Banner */}
      <div className="w-full max-w-full px-3 sm:px-6">
        <AdDisplay position="mid" />
      </div>

      {/* Articles Grid */}
      <div className="w-full max-w-full px-3 sm:px-6">
        {articles.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl text-center shadow-sm border border-stone-200 space-y-3">
            <h3 className="text-xl font-bold text-stone-800">इस श्रेणी में अभी कोई लेख उपलब्ध नहीं है</h3>
            <p className="text-sm text-stone-500">शीघ्र ही इस विषय पर नए लेख जोड़े जाएंगे या आप एडमिन पैनल से नया आर्टिकल पोस्ट कर सकते हैं।</p>
            <div className="pt-4 flex justify-center gap-4">
              <Link href="/admin" className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-teal-700 transition">
                एडमिन पैनल पर जाएं
              </Link>
              <Link href="/" className="inline-flex items-center gap-2 bg-rose-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-rose-700 transition">
                मुख्य पृष्ठ पर जाएं
              </Link>
            </div>
          </div>
        ) : (
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
                    alt={article.image.alt || article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{article.readTime} पढ़ने का समय</span>
                    </div>
                    <h3 className="font-bold text-stone-900 text-xl group-hover:text-rose-600 transition line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-stone-600 text-sm line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-rose-600 font-semibold text-sm">
                    <span>लेख पढ़ें</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Ad Banner */}
      <div className="w-full max-w-full px-3 sm:px-6">
        <AdDisplay position="bottom" />
      </div>
    </div>
  );
}

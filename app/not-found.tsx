import React from 'react';
import Link from 'next/link';
import { FileQuestion, Home, Search, FolderTree, PhoneCall, ArrowRight } from 'lucide-react';
import { SITE_CONFIG } from '../src/config/site-config';

export const metadata = {
  title: 'पृष्ठ नहीं मिला (404 Not Found) | हिंदी हेल्थ गाइड',
  description: 'यह पृष्ठ उपलब्ध नहीं है या हटा दिया गया है। प्रामाणिक स्वास्थ्य मार्गदर्शन हेतु मुख्य श्रेणियों को देखें।',
};

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 bg-stone-50">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-sm border border-stone-200 p-8 sm:p-12 text-center space-y-8">
        {/* 404 Icon & Header */}
        <div className="space-y-3">
          <div className="w-20 h-20 rounded-3xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
            <FileQuestion className="w-10 h-10" />
          </div>
          <div className="inline-block px-3 py-1 bg-stone-100 text-stone-700 text-xs font-mono font-bold rounded-full">
            404 • पृष्ठ अनुपलब्ध
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            यह पृष्ठ नहीं मिला
          </h1>
          <p className="text-sm sm:text-base text-stone-600 max-w-md mx-auto leading-relaxed">
            आप जिस स्वास्थ्य लेख या पृष्ठ की तलाश कर रहे हैं, वह स्थानांतरित हो चुका है या इसका लिंक गलत है।
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-3 rounded-xl shadow-md transition"
          >
            <Home className="w-4 h-4" />
            <span>मुख्य पृष्ठ पर जाएँ (Home)</span>
          </Link>
          <Link
            href="/search"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold px-6 py-3 rounded-xl transition border border-stone-200"
          >
            <Search className="w-4 h-4 text-stone-600" />
            <span>स्वास्थ्य विषय खोजें</span>
          </Link>
        </div>

        {/* Explore Categories */}
        <div className="pt-6 border-t border-stone-100 text-left space-y-4">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
            <FolderTree className="w-4 h-4 text-rose-600" />
            <span>प्रमुख स्वास्थ्य श्रेणियां देखें:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {SITE_CONFIG.categories.slice(0, 6).map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="p-3 bg-stone-50 hover:bg-rose-50 text-stone-700 hover:text-rose-700 rounded-xl border border-stone-200/80 transition flex items-center justify-between font-medium group"
              >
                <span>{cat.hindiName}</span>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-1 transition text-rose-600" />
              </Link>
            ))}
          </div>
        </div>

        {/* Emergency Helplines Callout */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-left text-xs text-amber-950 flex items-start gap-3">
          <PhoneCall className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            गोपनीय चिकित्सा सलाह या आपातकालीन सहायता के लिए राष्ट्रीय स्वास्थ्य हेल्पलाइन <strong className="font-mono text-sm text-stone-900">1075</strong> अथवा <strong className="font-mono text-sm text-stone-900">104</strong> पर कॉल करें।
          </p>
        </div>
      </div>
    </div>
  );
}

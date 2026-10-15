import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'नियम एवं शर्तें (Terms of Service)',
  description: 'हिंदी हेल्थ गाइड के उपयोग की शर्तें।',
};

export default function TermsPage() {
  return (
    <div className="bg-stone-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-stone-200">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 text-sm font-semibold mb-6">
            <ArrowLeft className="w-4 h-4" /> मुख्य पृष्ठ पर लौटें
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900">नियम एवं शर्तें (Terms of Service)</h1>
        </div>

        <div className="prose prose-stone max-w-none space-y-6 text-stone-800 leading-relaxed">
          <p>
            इस वेबसाइट का उपयोग करके आप हमारे नियमों और शर्तों से बंधे होने की सहमति देते हैं। वेबसाइट पर उपलब्ध सभी सामग्री कॉपीराइट संरक्षित है।
          </p>
        </div>
      </div>
    </div>
  );
}

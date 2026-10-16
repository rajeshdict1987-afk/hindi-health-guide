import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';
import { SITE_CONFIG } from '../../src/config/site-config';

export const metadata = {
  title: 'संपर्क करें (Contact Us) | हिंदी हेल्थ गाइड',
  description: 'हिंदी हेल्थ गाइड टीम और मुख्य संपादक से संपर्क करें।',
  alternates: {
    canonical: `${SITE_CONFIG.productionUrl}/contact`,
  },
};

export default function ContactPage() {
  return (
    <div className="bg-stone-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-stone-200">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 text-sm font-semibold mb-6">
            <ArrowLeft className="w-4 h-4" /> मुख्य पृष्ठ पर लौटें
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900">संपर्क करें (Contact Us)</h1>
          <p className="text-stone-600 text-lg mt-2">अपने सुझाव, प्रश्न या प्रतिक्रिया हमारे साथ साझा करें।</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 space-y-3">
            <Mail className="w-6 h-6 text-rose-600" />
            <h3 className="font-bold text-stone-900">ईमेल</h3>
            <p className="text-sm text-stone-600">support@hindihealthguide.in</p>
          </div>

          <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 space-y-3">
            <Phone className="w-6 h-6 text-teal-600" />
            <h3 className="font-bold text-stone-900">हेल्पलाइन</h3>
            <p className="text-sm text-stone-600">राष्ट्रीय स्वास्थ्य सेवा: 1075</p>
          </div>

          <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 space-y-3">
            <MapPin className="w-6 h-6 text-amber-600" />
            <h3 className="font-bold text-stone-900">कार्यालय</h3>
            <p className="text-sm text-stone-600">नई दिल्ली, भारत</p>
          </div>
        </div>
      </div>
    </div>
  );
}

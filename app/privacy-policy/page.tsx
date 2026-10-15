import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SITE_CONFIG } from '../../src/config/site-config';

export const metadata = {
  title: 'गोपनीयता नीति (Privacy Policy)',
  description: 'हिंदी हेल्थ गाइड की गोपनीयता और डाटा सुरक्षा नीति।',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-stone-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-stone-200">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 text-sm font-semibold mb-6">
            <ArrowLeft className="w-4 h-4" /> मुख्य पृष्ठ पर लौटें
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900">गोपनीयता नीति (Privacy Policy)</h1>
        </div>

        <div className="prose prose-stone max-w-none space-y-6 text-stone-800 leading-relaxed">
          <p>
            {SITE_CONFIG.hindiName} आपकी गोपनीयता का पूर्ण सम्मान और सुरक्षा करता है। हम आपके द्वारा साझा किए गए किसी भी व्यक्तिगत स्वास्थ्य डेटा को तृतीय पक्षों के साथ साझा नहीं करते हैं।
          </p>
          <h2>कुकीज़ और एनालिटिक्स</h2>
          <p>
            हम वेबसाइट के अनुभव को बेहतर बनाने के लिए मानक कुकीज़ का उपयोग करते हैं। आप अपनी ब्राउज़र सेटिंग से इन्हें नियंत्रित कर सकते हैं।
          </p>
        </div>
      </div>
    </div>
  );
}

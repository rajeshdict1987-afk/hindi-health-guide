import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, FileText, Lock, AlertTriangle, Building2 } from 'lucide-react';
import { SITE_CONFIG } from '../../src/config/site-config';

export const metadata: Metadata = {
  title: 'नियम एवं शर्तें (Terms of Service) | हिंदी हेल्थ गाइड',
  description: 'हिंदी हेल्थ गाइड (दरभंगा डिजिटल नेटवर्क की इकाई) के उपयोग की कानूनी शर्तें, सेवा नियम एवं दिशानिर्देश।',
  alternates: {
    canonical: `${SITE_CONFIG.productionUrl}/terms`,
  },
};

export default function TermsPage() {
  return (
    <div className="bg-emerald-50/40 min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header & Navigation */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-emerald-100/80 space-y-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-teal-700 hover:text-teal-800 text-sm font-semibold transition group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
            <span>मुख्य पृष्ठ पर लौटें</span>
          </Link>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-emerald-100/70 text-emerald-800 text-xs font-bold px-3.5 py-1.5 rounded-full">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>दरभंगा डिजिटल नेटवर्क की डिजिटल पहल</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              नियम एवं शर्तें <span className="text-teal-700">(Terms of Service)</span>
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-3xl">
              कृपया हिंदी हेल्थ गाइड पोर्टल का उपयोग करने से पूर्व इन नियमों और शर्तों को ध्यानपूर्वक पढ़ें।
            </p>
          </div>
        </div>

        {/* Expanded Content Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm border border-emerald-100 space-y-8 text-slate-800 text-base leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-700" />
              1. परिचय एवं स्वीकार्यता (Acceptance of Terms)
            </h2>
            <p>
              <strong>{SITE_CONFIG.hindiName} ({SITE_CONFIG.name})</strong> वेबसाइट (जो कि <strong>दरभंगा डिजिटल नेटवर्क</strong> के स्वामित्व व संचालन में है) का उपयोग करके आप इस बात की पुष्टि करते हैं कि आप इन नियमों और शर्तों से पूरी तरह सहमत हैं। यदि आप इन शर्तों से असहमत हैं, तो कृपया इस पोर्टल का उपयोग न करें।
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              2. बौद्धिक संपदा अधिकार और कॉपीराइट (Intellectual Property & Copyright)
            </h2>
            <p>
              इस पोर्टल पर प्रकाशित सभी लेख, ग्राफिक्स, डिजाइन, लोगो, और डेटाबेस <strong>दरभंगा डिजिटल नेटवर्क</strong> के कॉपीराइट संरक्षित अधिकार के अंतर्गत आते हैं। बिना पूर्व लिखित अनुमति के सामग्री का वाणिज्यिक उपयोग या पुनरुत्पादन प्रतिबंधित है।
            </p>
          </section>

          <section className="space-y-3 bg-amber-50/60 border border-amber-200 rounded-2xl p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-amber-950 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
              3. चिकित्सा अस्वीकरण (Medical Disclaimer)
            </h2>
            <p className="text-stone-700">
              इस वेबसाइट पर दी जाने वाली सभी स्वास्थ्य जानकारियां केवल शैक्षिक और जागरूकता उद्देश्यों के लिए हैं। यह किसी भी पेशेवर चिकित्सीय निदान, उपचार या सलाह का विकल्प नहीं है। किसी भी स्वास्थ्य समस्या के लिए हमेशा योग्य डॉक्टर या क्लिनिकल विशेषज्ञ से परामर्श लें।
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-teal-700" />
              4. विज्ञापन नीति एवं Adsterra नेटवर्क
            </h2>
            <p>
              पोर्टल के संचालन और मुफ़्त शिक्षा को जारी रखने के लिए हम Adsterra विज्ञापन नेटवर्क के विज्ञापन प्रदर्शित करते हैं। उपयोगकर्ता विज्ञापनों पर अपनी स्वेच्छा से इंटरैक्ट करते हैं। विज्ञापनदाताओं की सामग्री या नीतियों के लिए पोर्टल प्रत्यक्ष रूप से उत्तरदायी नहीं है।
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 text-lg">5. संपर्क जानकारी</h3>
            <p className="text-sm text-slate-600">
              नियमों या शर्तों से संबंधित किसी भी प्रश्न के लिए आप हमसे <a href="mailto:info@hindihealthguide.org" className="text-teal-700 font-semibold underline">info@hindihealthguide.org</a> पर संपर्क कर सकते हैं।
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

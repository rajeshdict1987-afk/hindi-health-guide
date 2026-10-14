import React from 'react';
import { FileCheck, Shield, AlertCircle } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { SITE_CONFIG } from '../config/site-config';

export const TermsPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="नियम एवं शर्तें (Terms of Use)"
        description="हिंदी हेल्थ गाइड के उपयोग के नियम, बौद्धिक संपदा अधिकार और उपयोगकर्ता की जिम्मेदारियां।"
      />

      <div className="bg-stone-50 min-h-screen py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              वेबसाइट उपयोग की शर्तें
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight mt-4">
              नियम एवं शर्तें (Terms of Service)
            </h1>
            <p className="mt-3 text-stone-600 text-sm sm:text-base">
              प्रभावी तिथि: 14 अक्टूबर 2026
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-xs space-y-8 text-stone-800 leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-stone-900">1. शर्तों की स्वीकृति</h2>
              <p>
                {SITE_CONFIG.name} ({SITE_CONFIG.hindiName}) का उपयोग करके आप इन नियमों व शर्तों तथा हमारे चिकित्सीय अस्वीकरण से पूर्णतः सहमत होते हैं।
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-stone-100">
              <h2 className="text-xl font-bold text-stone-900">2. बौद्धिक संपदा अधिकार (Copyright)</h2>
              <p>
                इस वेबसाइट पर उपलब्ध सभी मूल हिंदी आलेख, अनुवाद, संरचना और ब्रांड पहचान कॉपीराइट कानूनों द्वारा संरक्षित हैं। गैर-वाणिज्यिक और शैक्षिक उद्देश्यों के लिए उचित संदर्भ (Citation) के साथ उद्धृत किया जा सकता है। पूरी सामग्री का अनधिकृत व्यावसायिक पुनरुत्पादन प्रतिबंधित है।
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-stone-100">
              <h2 className="text-xl font-bold text-stone-900">3. निषिद्ध गतिविधियां</h2>
              <p>
                उपयोगकर्ता किसी भी ऐसी गतिविधि में संलग्न नहीं होंगे जिससे वेबसाइट की सुरक्षा, सर्वर की स्थिरता या अन्य पाठकों की गोपनीयता भंग हो। वेबसाइट के माध्यम से किसी भी प्रकार की अश्लील, भड़काऊ या गैर-कानूनी सामग्री का प्रसार वर्जित है।
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-stone-100">
              <h2 className="text-xl font-bold text-stone-900">4. अधिकार क्षेत्र (Jurisdiction)</h2>
              <p>
                इन शर्तों से संबंधित किसी भी कानूनी विवाद का समाधान भारत के कानूनों के अनुसार किया जाएगा।
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

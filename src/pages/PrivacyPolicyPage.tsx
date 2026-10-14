import React from 'react';
import { Lock, Shield, EyeOff } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { SITE_CONFIG } from '../config/site-config';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="गोपनीयता नीति (Privacy Policy)"
        description="हिंदी हेल्थ गाइड पर आपकी निजता और व्यक्तिगत स्वास्थ्य डेटा की सुरक्षा हमारी सर्वोच्च प्राथमिकता है।"
      />

      <div className="bg-stone-50 min-h-screen py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              डेटा सुरक्षा एवं निजता
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight mt-4">
              गोपनीयता नीति (Privacy Policy)
            </h1>
            <p className="mt-3 text-stone-600 text-sm sm:text-base">
              प्रभावी तिथि: 14 अक्टूबर 2026 | भारत का डिजिटल व्यक्तिगत डेटा संरक्षण (DPDP) अधिनियम
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-xs space-y-8 text-stone-800 leading-relaxed">
            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-6 flex items-start gap-3">
              <EyeOff className="w-6 h-6 text-teal-700 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-teal-950 text-base">शून्य निजी डेटा ट्रैकिंग नीति</h3>
                <p className="text-sm text-stone-700 mt-1">
                  यौन स्वास्थ्य एक संवेदनशील विषय है। हिंदी हेल्थ गाइड पर लेख पढ़ने के लिए आपको किसी पंजीकरण, फोन नंबर या व्यक्तिगत पहचान देने की आवश्यकता नहीं है।
                </p>
              </div>
            </div>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-stone-900">1. हम कौन सी जानकारी एकत्र करते हैं?</h2>
              <p>
                - <strong>सार्वजनिक पाठक:</strong> हम पाठकों का नाम, पता या संवेदनशील पहचान एकत्र नहीं करते। केवल बुनियादी अज्ञात (Anonymous) सर्वर लॉग्स और पृष्ठ दर्शन संख्या (Page Views) दर्ज की जाती है।
                <br />
                - <strong>संपर्क फॉर्म:</strong> यदि आप संपर्क फॉर्म के माध्यम से सवाल पूछते हैं, तो आपके द्वारा स्वेच्छा से दिया गया ईमेल केवल आपके प्रश्न का उत्तर देने हेतु उपयोग किया जाता है। इसे कभी किसी तीसरे पक्ष को बेचा या साझा नहीं किया जाता।
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-stone-100">
              <h2 className="text-xl font-bold text-stone-900">2. कुकीज (Cookies) का उपयोग</h2>
              <p>
                हम उपयोगकर्ता की भाषा वरीयता और फॉन्ट आकार को याद रखने के लिए केवल न्यूनतम आवश्यक कुकीज का उपयोग करते हैं।
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-stone-100">
              <h2 className="text-xl font-bold text-stone-900">3. नाबालिगों की सुरक्षा (Child Safety)</h2>
              <p>
                हमारी वेबसाइट 18 वर्ष से कम आयु के किशोरों के लिए सुरक्षित, वैज्ञानिक और शैक्षिक सामग्री प्रस्तुत करती है, जो UNESCO के अंतर्राष्ट्रीय यौन शिक्षा मानकों के अनुकूल है।
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-stone-100">
              <h2 className="text-xl font-bold text-stone-900">4. डेटा अधिकारी संपर्क</h2>
              <p>
                निजता संबंधी किसी भी प्रश्न के लिए आप हमारे डेटा संरक्षण अधिकारी से <a href="mailto:privacy@hindihealthguide.org" className="text-teal-700 underline font-semibold">privacy@hindihealthguide.org</a> पर संपर्क कर सकते हैं।
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

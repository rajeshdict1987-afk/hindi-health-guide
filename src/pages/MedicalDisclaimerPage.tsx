import React from 'react';
import { ShieldAlert, PhoneCall, AlertOctagon, HelpCircle } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { SITE_CONFIG } from '../config/site-config';

export const MedicalDisclaimerPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="चिकित्सीय अस्वीकरण (Medical Disclaimer)"
        description="हिंदी हेल्थ गाइड का विधिक एवं चिकित्सीय अस्वीकरण। यह मंच केवल सामान्य शैक्षिक जानकारी प्रदान करता है, चिकित्सीय परामर्श का विकल्प नहीं।"
      />

      <div className="bg-stone-50 min-h-screen py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
              वैधानिक सूचना
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight mt-4">
              चिकित्सीय अस्वीकरण (Medical Disclaimer)
            </h1>
            <p className="mt-3 text-stone-600 text-sm sm:text-base">
              कृपया वेबसाइट का उपयोग करने से पूर्व इस महत्वपूर्ण सूचना को ध्यानपूर्वक पढ़ें
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-xs space-y-8 text-stone-800 leading-relaxed">
            {/* Primary Warning Box */}
            <div className="bg-amber-50 border-2 border-amber-500/40 rounded-2xl p-6 text-amber-950 flex items-start gap-4">
              <ShieldAlert className="w-8 h-8 text-amber-600 shrink-0 mt-1" />
              <div className="space-y-2">
                <h2 className="text-lg font-bold">1. डॉक्टर के प्रत्यक्ष परामर्श का विकल्प नहीं</h2>
                <p className="text-sm sm:text-base leading-relaxed">
                  हिंदी हेल्थ गाइड (Hindi Health Guide) पर प्रकाशित सभी लेख, उत्तर, चित्र, ग्राफिक्स और अन्य सामग्री केवल सामान्य शैक्षिक और जन-जागरूकता के उद्देश्य से तैयार की गई है। यह किसी भी प्रकार से पेशेवर चिकित्सा परामर्श, शारीरिक जांच, रोग निदान (Diagnosis) या व्यक्तिगत उपचार (Treatment) का विकल्प नहीं है।
                </p>
              </div>
            </div>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-rose-600" />
                2. आपातकालीन स्थितियां (Medical Emergencies)
              </h2>
              <p>
                यदि आप या आपका कोई परिजन किसी चिकित्सीय आपात स्थिति, गंभीर रक्तस्राव, असहनीय दर्द, तीव्र संक्रमण, विषाक्तता या आत्मघाती विचारों से जूझ रहे हैं, तो तुरंत निकटतम अस्पताल के इमरजेंसी विभाग में जाएं या भारत सरकार की 112 आपातकालीन सेवा पर कॉल करें। ऑनलाइन वेबसाइट पर उत्तर की प्रतीक्षा न करें।
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-stone-100">
              <h2 className="text-xl font-bold text-stone-900">
                3. दवाओं और खुराकों की सीमाएं
              </h2>
              <p>
                यद्यपि हमारे लेखों में दवाओं (जैसे आपातकालीन गर्भनिरोधक, एंटीबायोटिक्स या टीके) के सामान्य चिकित्सीय उपयोग की जानकारी दी जाती है, परंतु प्रत्येक मानव शरीर की शारीरिक स्थिति, एलर्जी और सह-रुग्णताएं (Co-morbidities) भिन्न होती हैं। किसी भी दवा का सेवन करने से पूर्व हमेशा एमबीबीएस डॉक्टर या योग्य फार्मासिस्ट से परामर्श लें। स्वयं-चिकित्सा (Self-medication) घातक हो सकती है।
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-stone-100">
              <h2 className="text-xl font-bold text-stone-900">
                4. डॉक्टर-मरीज संबंध का अभाव
              </h2>
              <p>
                इस वेबसाइट की सामग्री पढ़ने, संपर्क फॉर्म के माध्यम से सवाल पूछने या ईमेल भेजने से किसी भी प्रकार का डॉक्टर-मरीज संबंध (Doctor-Patient Relationship) स्थापित नहीं होता है।
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-stone-100">
              <h2 className="text-xl font-bold text-stone-900">
                5. राष्ट्रीय सहायता केंद्र
              </h2>
              <p>
                यौन स्वास्थ्य और मानसिक तनाव से संबंधित मुफ्त और गोपनीय सहायता के लिए आप राष्ट्रीय हेल्पलाइन पर संपर्क कर सकते हैं:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {SITE_CONFIG.helplines.map((h, i) => (
                  <div key={i} className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="font-bold text-sm text-stone-900">{h.name}</div>
                    <div className="text-lg font-extrabold text-teal-700 mt-1">{h.number}</div>
                    <div className="text-xs text-stone-500 mt-0.5">{h.description}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

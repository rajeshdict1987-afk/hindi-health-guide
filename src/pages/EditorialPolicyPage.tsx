import React from 'react';
import { ShieldCheck, CheckCircle2, FileText, AlertTriangle, Stethoscope } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { SITE_CONFIG } from '../config/site-config';

export const EditorialPolicyPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="संपादकीय एवं तथ्य-जांच नीति (Editorial Policy)"
        description="हिंदी हेल्थ गाइड की संपादकीय नीति: तथ्य-सत्यापन, चिकित्सा समीक्षा, निष्पक्षता, सहमति मानक और गैर-अश्लीलता की प्रतिबद्धता।"
      />

      <div className="bg-stone-50 min-h-screen py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              मानक एवं गुणवत्ता आश्वासन
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight mt-4">
              संपादकीय नीति (Editorial & Review Policy)
            </h1>
            <p className="mt-3 text-stone-600 text-sm sm:text-base">
              अंतिम अद्यतन: 14 अक्टूबर 2026 | मानक: WHO, MoHFW, NACO एवं ICMR
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-xs space-y-8 text-stone-800 leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-700" />
                1. तथ्य सत्यापन एवं वैज्ञानिक अनुसंधान (Fact-Checking Process)
              </h2>
              <p>
                हिंदी हेल्थ गाइड पर प्रकाशित होने वाली प्रत्येक सामग्री वैज्ञानिक और सहकर्मी-समीक्षित (Peer-Reviewed) चिकित्सा साक्ष्यों पर आधारित होती है। हमारे लेखक और संपादक प्राथमिक स्रोतों के रूप में केवल निम्नलिखित मान्य संस्थानों के दिशानिर्देशों को स्वीकार करते हैं:
              </p>
              <ul className="list-disc ml-6 space-y-1 text-stone-700">
                <li>विश्व स्वास्थ्य संगठन (WHO)</li>
                <li>स्वास्थ्य एवं परिवार कल्याण मंत्रालय, भारत सरकार (MoHFW)</li>
                <li>राष्ट्रीय एड्स नियंत्रण संगठन (NACO)</li>
                <li>भारतीय आयुर्विज्ञान अनुसंधान परिषद (ICMR)</li>
                <li>सेंटर्स फॉर डिजीज कंट्रोल एंड प्रिवेंशन (CDC)</li>
                <li>प्रतिष्ठित मेडिकल जर्नल्स (The Lancet, PubMed, BMJ, Indian Journal of Psychiatry)</li>
              </ul>
            </section>

            <section className="space-y-3 pt-6 border-t border-stone-100">
              <h2 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-purple-700" />
                2. स्वतंत्र चिकित्सा समीक्षा (Independent Medical Review)
              </h2>
              <p>
                संवेदनशील स्वास्थ्य और औषधीय लेखों की समीक्षा सक्रिय नैदानिक अभ्यास (Clinical Practice) में कार्यरत पंजीकृत चिकित्सकों द्वारा की जाती है। समीक्षा के दौरान डॉक्टर यह सुनिश्चित करते हैं:
              </p>
              <ul className="list-disc ml-6 space-y-1 text-stone-700">
                <li>दवाओं के नाम, खुराक और समय-सीमा चिकित्सकीय रूप से सुरक्षित हैं।</li>
                <li>संकेत और लक्षण सही वैज्ञानिक शब्दावली में समझाए गए हैं।</li>
                <li>इलाज की कोई झूठी गारंटी या अंधविश्वास को बढ़ावा नहीं दिया गया है।</li>
                <li>डॉक्टर का नाम, विशेषता और NMC/राज्य मेडिकल काउंसिल पंजीकरण संख्या लेख के साथ पारदर्शी रूप से प्रकाशित की जाती है।</li>
              </ul>
            </section>

            <section id="consent" className="space-y-3 pt-6 border-t border-stone-100">
              <h2 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-700" />
                3. यौन शिक्षा बनाम अश्लीलता (Sexuality Education vs Pornography)
              </h2>
              <p>
                हिंदी हेल्थ गाइड यौन शिक्षा को अश्लील मनोरंजन और पोर्नोग्राफी से 100% अलग रखने के लिए प्रतिबद्ध है। हमारी भाषा शालीन, आदरपूर्ण और वैज्ञानिक देवनागरी हिंदी है। किसी भी प्रकार की उत्तेजक, आपत्तिजनक या गैर-सहमति वाली सामग्री का प्रकाशन हमारे मंच पर पूरी तरह वर्जित है।
              </p>
              <p>
                हम पारस्परिक सहमति (Consent), लैंगिक समानता और नाबालिगों की सुरक्षा (POCSO Act 2012) को हर लेख में रेखांकित करते हैं।
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-stone-100">
              <h2 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                4. त्रुटि सुधार एवं अद्यतन नीति (Corrections Policy)
              </h2>
              <p>
                चिकित्सा विज्ञान निरंतर प्रगतिशील है। यदि किसी लेख में नए अनुसंधान के अनुसार संशोधन की आवश्यकता होती है या कोई तथ्यात्मक त्रुटि ध्यान में आती है, तो हमारी संपादकीय टीम 48 घंटे के भीतर उसकी पुनः समीक्षा कर सुधार दर्ज करती है। पाठक <a href="mailto:editorial@hindihealthguide.org" className="text-teal-700 font-semibold underline">editorial@hindihealthguide.org</a> पर संशोधन अनुरोध भेज सकते हैं।
              </p>
            </section>

            <section className="space-y-3 pt-6 border-t border-stone-100">
              <h2 className="text-2xl font-bold text-stone-900">
                5. विज्ञापन और प्रायोजित सामग्री (Commercial Transparency)
              </h2>
              <p>
                संपादकीय स्वतंत्रता हमारी सर्वोच्च प्राथमिकता है। कोई भी विज्ञापनदाता हमारी संपादकीय नीति या लेखों के चिकित्सा निष्कर्षों को प्रभावित नहीं कर सकता। यदि भविष्य में कोई प्रायोजित लेख शामिल किया जाएगा, तो उस पर 'प्रायोजित' या 'Sponsored' का स्पष्ट लेबल प्रदर्शित होगा।
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

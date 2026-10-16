import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Eye, Lock, FileText, CheckCircle2 } from 'lucide-react';
import { SITE_CONFIG } from '../../src/config/site-config';

export const metadata = {
  title: 'गोपनीयता नीति (Privacy Policy) | हिंदी हेल्थ गाइड',
  description: 'हिंदी हेल्थ गाइड (Hindi Health Guide) की कानूनी गोपनीयता नीति, Adsterra विज्ञापन नेटवर्क प्रकटीकरण और कुकीज़ ट्रैकिंग दिशानिर्देश।',
  alternates: {
    canonical: `${SITE_CONFIG.productionUrl}/privacy-policy`,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-stone-50 py-16 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-10 bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-stone-200">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 text-sm font-semibold mb-6 transition">
            <ArrowLeft className="w-4 h-4" /> मुख्य पृष्ठ पर लौटें
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <span className="p-2 bg-rose-100 text-rose-600 rounded-xl">
              <Shield className="w-6 h-6" />
            </span>
            <span className="text-xs uppercase tracking-wider font-bold text-stone-500">कानूनी एवं अनुपालन दस्तावेज़</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">गोपनीयता नीति (Privacy Policy)</h1>
          <p className="text-sm text-stone-500 mt-2">अंतिम नवीनीकरण: 15 अक्टूबर 2026 | मुख्य संपादक: राजेश कुमार साहू (गुरु)</p>
        </div>

        <div className="prose prose-stone max-w-none space-y-8 text-stone-800 leading-relaxed text-sm sm:text-base border-t border-stone-100 pt-6">
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 flex items-center gap-2">
              <Eye className="w-5 h-5 text-rose-600" />
              1. परिचय एवं उद्देश्य (Introduction & Objective)
            </h2>
            <p>
              <strong>{SITE_CONFIG.hindiName} ({SITE_CONFIG.name})</strong> पर आपकी गोपनीयता हमारे लिए सर्वोपरि है। यह गोपनीयता नीति स्पष्ट करती है कि जब आप हमारे पोर्टल (
              <a href={SITE_CONFIG.productionUrl} className="text-rose-600 font-semibold underline">
                {SITE_CONFIG.productionUrl}
              </a>
              ) पर आते हैं या हमारी स्वास्थ्य व शिक्षा सामग्री पढ़ते हैं, तो हम किस प्रकार की जानकारी एकत्र करते हैं, उसका उपयोग कैसे करते हैं और उसे कैसे सुरक्षित रखते हैं।
            </p>
            <p>
              हमारा मंच भारत के डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम (DPDP Act 2023) एवं वैश्विक गोपनीयता मानकों के प्रति पूर्णतः उत्तरदायी और प्रतिबद्ध है।
            </p>
          </section>

          <section className="space-y-4 bg-amber-50/60 border border-amber-200 rounded-2xl p-5 sm:p-6 text-stone-800">
            <h2 className="text-xl font-bold text-amber-950 flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-700" />
              2. Adsterra विज्ञापन नेटवर्क प्रकटीकरण (Adsterra Advertising Network Disclosure)
            </h2>
            <p className="text-sm leading-relaxed text-stone-700">
              यह मंच स्वतंत्र और मुफ़्त उच्च गुणवत्ता वाली स्वास्थ्य शिक्षा प्रदान करने के उद्देश्य से मुद्रीकरण हेतु <strong>Adsterra Advertising Network</strong> के प्रामाणिक स्क्रिप्ट्स का उपयोग करता है। हमारी साइट में निम्नलिखित विज्ञापन मॉड्यूल सक्रिय हैं:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-stone-700">
              <li>
                <strong>Adsterra Social Bar:</strong> यह इंटरैक्टिव नोटिफिकेशन एवं एंगेजमेंट स्ट्रिप (स्क्रिप्ट स्रोत: <code>https://bicea.org/14/fdeaeb8e14ab4a9c96943a0503fc28e4</code>) के माध्यम से उपयोगकर्ताओं को प्रासंगिक जानकारी व प्रायोजित लिंक प्रदर्शित करता है। इसके डिस्प्ले स्टाइल्स <code>app/globals.css</code> में अनुकूलित हैं।
              </li>
              <li>
                <strong>Adsterra Native Banners:</strong> प्राकृतिक सामग्री प्रवाह (Content Stream) के बीच सुव्यवस्थित 4-कंटेनर नेटिव विज्ञापन (स्क्रिप्ट स्रोत: <code>https://bicea.org/21/d9642fd6678c07a30a56b2fd136e6cb5</code>) प्रदर्शित किए जाते हैं ताकि उपयोगकर्ता का पठन अनुभव बाधित न हो।
              </li>
            </ul>
            <p className="text-xs text-stone-600 italic">
              <strong>कानूनी स्पष्टीकरण:</strong> Adsterra नेटवर्क आपके ब्राउज़र में गैर-व्यक्तिगत पहचान योग्य पहचानकर्ता (Non-PII Identifiers), कुकीज़ और वेब बीकन का उपयोग विज्ञापनों की पुनरावृत्ति सीमा (Frequency Capping), धोखाधड़ी रोकथाम (Anti-Fraud), और क्षेत्रीय प्रासंगिकता सुनिश्चित करने के लिए कर सकता है। कोई भी व्यक्तिगत स्वास्थ्य संबंधी रिकॉर्ड Adsterra को प्रेषित नहीं किया जाता।
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              3. कुकीज़ एवं ट्रैकिंग तकनीक (Cookies & Tracking Technologies)
            </h2>
            <p>
              हम वेबसाइट के निर्बाध संचालन, डार्क/लाइट थीम वरीयताओं, पढ़ने की प्रगति (Reading Progress) और विश्लेषणात्मक आंकड़ों के लिए मानक कुकीज़ का उपयोग करते हैं:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-stone-700">
              <li><strong>आवश्यक कुकीज़ (Essential Cookies):</strong> पृष्ठ नेविगेशन और सुरक्षा कार्यों के लिए अनिवार्य।</li>
              <li><strong>लोकल स्टोरेज (Local Storage):</strong> उपयोगकर्ता द्वारा पढ़े जा रहे आर्टिकल्स, बुकमार्क्स और सुरक्षित एडमिन क्रेडेंशियल्स के क्लाइंट-साइड कैशिंग हेतु।</li>
              <li><strong>तृतीय-पक्ष विश्लेषणात्मक व विज्ञापन कुकीज़:</strong> सेवा सुधार और प्रदर्शन मापन के उद्देश्य से प्रयुक्त।</li>
            </ul>
            <p className="text-sm text-stone-600">
              आप अपने वेब ब्राउज़र की प्राथमिकताओं (Browser Settings) में जाकर किसी भी समय कुकीज़ को अस्वीकार या डिलीट कर सकते हैं।
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-rose-600" />
              4. चिकित्सा गोपनीयता एवं कोई व्यक्तिगत स्वास्थ्य रिकॉर्ड नहीं (Zero Health Record Storage)
            </h2>
            <p>
              {SITE_CONFIG.hindiName} एक शैक्षिक एवं जन-जागरूकता पोर्टल है। हम किसी भी पाठक की व्यक्तिगत स्वास्थ्य समस्याएं, रोग इतिहास, लैब रिपोर्ट अथवा संवेदनशील बायोमेट्रिक जानकारी एकत्रित या स्टोर नहीं करते हैं। पोर्टल पर उपलब्ध फॉर्म केवल संपर्क और स्वैच्छिक संपादकीय फीडबैक हेतु उपयोग किए जाते हैं।
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
              5. डेटा सुरक्षा और एडमिन अनुपालन (Administrative Security)
            </h2>
            <p>
              हमारा एडमिन पोर्टल और डेटाबेस फायरस्टोर सुरक्षा नियमों (Firestore Rules) एवं कड़े एन्क्रिप्शन मानकों के तहत सुरक्षित है। किसी भी अनधिकृत तीसरे पक्ष को सामग्री संपादन, प्रकाशन या विलोपन की अनुमति नहीं है। एडमिन प्रमाणीकरण केवल मुख्य संपादक के अधिकृत ईमेल पर प्रतिबंधित है।
            </p>
          </section>

          <section className="space-y-3 bg-stone-100 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-stone-900">6. संपर्क एवं शिकायत अधिकारी (Grievance Officer & Contact)</h2>
            <p className="text-sm text-stone-700 leading-relaxed">
              यदि इस गोपनीयता नीति, विज्ञापन प्रकटीकरण या आपकी व्यक्तिगत जानकारी के संदर्भ में आपका कोई प्रश्न या सुझाव है, तो आप हमारे मुख्य संपादक से सीधे संपर्क कर सकते हैं:
            </p>
            <div className="text-sm font-medium text-stone-900 space-y-1 mt-2">
              <div><strong>मुख्य संपादक (Chief Editor):</strong> राजेश कुमार साहू (गुरु)</div>
              <div><strong>समर्पित ईमेल:</strong> <a href="mailto:rajeshdict.1987@gmail.com" className="text-rose-600 hover:underline">rajeshdict.1987@gmail.com</a></div>
              <div><strong>पोर्टल यूआरएल:</strong> <a href={SITE_CONFIG.productionUrl} className="text-rose-600 hover:underline">{SITE_CONFIG.productionUrl}</a></div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

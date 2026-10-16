import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, HeartPulse, Users, Award } from 'lucide-react';
import { SITE_CONFIG } from '../../src/config/site-config';

export const metadata = {
  title: 'हमारे बारे में (About Us) | हिंदी हेल्थ गाइड',
  description: 'हिंदी हेल्थ गाइड के उद्देश्य, मिशन और चिकित्सा संपादकीय टीम के बारे में जानें।',
  alternates: {
    canonical: `${SITE_CONFIG.productionUrl}/about`,
  },
};

export default function AboutPage() {
  return (
    <div className="bg-stone-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-stone-200">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 text-sm font-semibold mb-6">
            <ArrowLeft className="w-4 h-4" /> मुख्य पृष्ठ पर लौटें
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900">{SITE_CONFIG.hindiName} के बारे में</h1>
          <p className="text-stone-600 text-lg mt-2">वैज्ञानिक, प्रमाण-आधारित और सुरक्षित यौन एवं प्रजनन स्वास्थ्य शिक्षा का समर्पित डिजिटल मंच।</p>
        </div>

        <div className="prose prose-stone max-w-none space-y-6 text-stone-800 leading-relaxed">
          <h2>हमारा मिशन (Our Mission)</h2>
          <p>
            भारत में यौन और प्रजनन स्वास्थ्य (Sexual & Reproductive Health) से जुड़े विषयों पर अक्सर सामाजिक झिझक और गलतफहमियां पाई जाती हैं। हमारा उद्देश्य इन वर्जनाओं को तोड़कर वैज्ञानिक, प्रामाणिक और सुलभ जानकारी हिंदी भाषी जनता तक पहुँचाना है।
          </p>

          <h2>विश्वसनीयता और मानक</h2>
          <p>
            {SITE_CONFIG.hindiName} पर प्रकाशित प्रत्येक लेख विश्व स्वास्थ्य संगठन (WHO), राष्ट्रीयAIDS नियंत्रण संगठन (NACO) और स्वास्थ्य एवं परिवार कल्याण मंत्रालय के आधिकारिक दिशा-निर्देशों पर आधारित है। हमारे सभी लेखों की समीक्षा योग्य चिकित्सकों द्वारा की जाती है।
          </p>

          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-4 not-prose my-8">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">संपादकीय नेतृत्व (Editorial Leadership)</span>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-rose-600 text-white font-black text-2xl flex items-center justify-center shadow-md shrink-0">
                र
              </div>
              <div>
                <h3 className="text-xl font-bold text-stone-900">राजेश कुमार साहू (गुरु)</h3>
                <p className="text-sm font-semibold text-rose-600">मुख्य संपादक (Chief Editor) एवं स्वास्थ्य विश्लेषक</p>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  हिंदी हेल्थ गाइड के संस्थापक व मुख्य संपादक। यौन एवं प्रजनन स्वास्थ्य जागरूकता, वैज्ञानिक विश्लेषण तथा डब्ल्यूएचओ (WHO) व एनएसीओ (NACO) दिशानिर्देशों के अनुरूप सामग्री सत्यापन के लिए समर्पित।
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8 not-prose">
            <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl text-center space-y-2">
              <ShieldCheck className="w-8 h-8 text-rose-600 mx-auto" />
              <h3 className="font-bold text-stone-900">100% प्रामाणिक</h3>
              <p className="text-xs text-stone-600">सत्यापित चिकित्सा स्रोत</p>
            </div>
            <div className="bg-teal-50 border border-teal-200 p-6 rounded-2xl text-center space-y-2">
              <Users className="w-8 h-8 text-teal-600 mx-auto" />
              <h3 className="font-bold text-stone-900">विशेषज्ञ समीक्षा</h3>
              <p className="text-xs text-stone-600">एआई व संपादक सत्यापित</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl text-center space-y-2">
              <Award className="w-8 h-8 text-blue-600 mx-auto" />
              <h3 className="font-bold text-stone-900">सुरक्षित मंच</h3>
              <p className="text-xs text-stone-600">पूर्ण गोपनीयता</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

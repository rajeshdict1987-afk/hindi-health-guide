import React from 'react';
import { ShieldCheck, Heart, Users, Award, BookOpen, Stethoscope, ArrowRight } from 'lucide-react';
import { SITE_CONFIG } from '../config/site-config';
import { SEOHead } from '../components/SEOHead';
import { useRouter } from '../context/RouterContext';

export const AboutPage: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <>
      <SEOHead
        title="हमारे बारे में (About Us)"
        description="हिंदी हेल्थ गाइड का मिशन, संपादकीय दृष्टिकोण और भारत में प्रमाण-आधारित यौन एवं प्रजनन स्वास्थ्य शिक्षा की प्रतिबद्धता।"
      />

      <div className="bg-stone-50 min-h-screen py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              संस्थापक दृष्टि एवं मिशन
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight mt-4">
              हमारे बारे में (About Hindi Health Guide)
            </h1>
            <p className="mt-4 text-stone-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              भारत के करोड़ों हिंदी-भाषी पाठकों के लिए यौन, शारीरिक और प्रजनन स्वास्थ्य की वैज्ञानिक, निर्भीक और डॉक्टर-परीक्षित जानकारी।
            </p>
          </div>

          {/* Mission Card */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-xs mb-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-700 text-white flex items-center justify-center shrink-0">
                <Heart className="w-6 h-6 fill-current" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900">हमारा उद्देश्य (Our Mission)</h2>
                <p className="text-xs text-teal-700 font-semibold">गरिमा, विज्ञान और सम्मान का समन्वय</p>
              </div>
            </div>

            <p className="text-stone-700 text-base sm:text-lg leading-relaxed">
              भारतीय समाज में यौन स्वास्थ्य पर खुलकर बात करना आज भी एक सामाजिक वर्जना (Taboo) माना जाता है। सही मार्गदर्शन के अभाव में युवा इंटरनेट पर भ्रामक विज्ञापनों, अश्लील सामग्री या नीम-हकीमों के झूठे दावों के शिकार होकर मानसिक तनाव और आर्थिक शोषण झेलते हैं।
            </p>

            <p className="text-stone-700 text-base sm:text-lg leading-relaxed">
              <strong>Hindi Health Guide (हिंदी हेल्थ गाइड)</strong> का निर्माण इसी खाई को पाटने के लिए किया गया है। हमारा दृढ़ विश्वास है कि यौन शिक्षा बुनियादी स्वास्थ्य अधिकार है। जब व्यक्ति अपने शरीर, प्रजनन प्रणाली और मानसिक सीमाओं को वैज्ञानिक रूप से समझता है, तभी वह जिम्मेदार, सुरक्षित और परिपक्व निर्णय ले सकता है।
            </p>
          </div>

          {/* Key Principles */}
          <div className="space-y-6 mb-12">
            <h3 className="text-2xl font-extrabold text-stone-900 text-center">
              हमारे 4 मुख्य आधार स्तंभ
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {SITE_CONFIG.editorialPrinciples.map((principle, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold mb-3">
                    {idx + 1}
                  </div>
                  <h4 className="text-lg font-bold text-stone-900 mb-2">{principle.title}</h4>
                  <p className="text-sm text-stone-600 leading-relaxed">{principle.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Medical Advisor Panel Statement */}
          <div className="bg-gradient-to-r from-purple-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Stethoscope className="w-6 h-6 text-purple-300" />
              <h3 className="text-xl font-bold">चिकित्सा विशेषज्ञ सलाहकार मंडल</h3>
            </div>
            <p className="text-purple-100 text-sm sm:text-base leading-relaxed">
              हम किसी भी अप्रमाणित दावे, घरेलू चमत्कारी नुस्खों या इलाज की झूठी गारंटी को कड़ाई से खारिज करते हैं। हमारे सभी प्रमुख लेख राष्ट्रीय आयुर्विज्ञान आयोग (NMC) व राज्य मेडिकल काउंसिलों में पंजीकृत योग्य चिकित्सकों (MBBS, MD/MS, DGO) द्वारा वैज्ञानिक तथ्यों पर परखे जाते हैं।
            </p>
            <div className="mt-6 pt-6 border-t border-purple-800/80 flex flex-wrap items-center justify-between text-xs text-purple-200 gap-4">
              <span>अनुपालन: WHO International Technical Guidance on Sexuality Education</span>
              <button
                onClick={() => navigate('/editorial-policy')}
                className="bg-white text-purple-950 font-bold px-4 py-2 rounded-xl hover:bg-purple-50 transition"
              >
                संपादकीय नीति पढ़ें
              </button>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center pt-6">
            <p className="text-stone-600 text-sm mb-4">
              क्या आपके मन में कोई स्वास्थ्य प्रश्न है जिसे आप गोपनीय रूप से पूछना चाहते हैं?
            </p>
            <button
              onClick={() => navigate('/contact')}
              className="bg-teal-700 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-teal-800 transition inline-flex items-center gap-2 shadow-sm"
            >
              <span>संपादकीय टीम से संपर्क करें</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

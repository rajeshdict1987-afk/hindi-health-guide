import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  ShieldCheck,
  HeartPulse,
  Users,
  Award,
  Building2,
  CheckCircle2,
  BookOpen,
  Mail,
  Phone,
  Sparkles
} from 'lucide-react';
import { SITE_CONFIG } from '../../src/config/site-config';

export const metadata: Metadata = {
  title: 'हमारे बारे में (About Us) | दरभंगा डिजिटल नेटवर्क की इकाई – हिंदी हेल्थ गाइड',
  description:
    'हिंदी हेल्थ गाइड (दरभंगा डिजिटल नेटवर्क की इकाई) का परिचय, उद्देश्य, क्लिनिकल मानक और मुख्य संपादक राजेश कुमार साहू की संपादकीय प्रतिबद्धता।',
  alternates: {
    canonical: `${SITE_CONFIG.productionUrl}/about`,
  },
  openGraph: {
    type: 'website',
    locale: 'hi_IN',
    url: `${SITE_CONFIG.productionUrl}/about`,
    siteName: SITE_CONFIG.hindiName,
    title: 'हमारे बारे में (About Us) | हिंदी हेल्थ गाइड',
    description:
      'दरभंगा डिजिटल नेटवर्क की इकाई हिंदी हेल्थ गाइड के उद्देश्य, मिशन, क्लिनिकल सत्यापन और मुख्य संपादक राजेश कुमार साहू के बारे में विस्तार से जानें।',
  },
};

export default function AboutPage() {
  return (
    <div className="bg-emerald-50/40 min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Navigation & Hero Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-emerald-100/80 space-y-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-teal-700 hover:text-teal-800 text-sm font-semibold transition group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
            <span>मुख्य पृष्ठ पर लौटें</span>
          </Link>

          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-emerald-100/70 text-emerald-800 text-xs font-bold px-3.5 py-1.5 rounded-full">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>दरभंगा डिजिटल नेटवर्क की डिजिटल स्वास्थ्य पहल (Darbhanga Digital Network)</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              {SITE_CONFIG.hindiName} के बारे में
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-3xl">
              भारत में वैज्ञानिक, प्रमाण-आधारित और भ्रांति-मुक्त यौन एवं प्रजनन स्वास्थ्य शिक्षा प्रदान करने वाला एक समर्पित व विश्वसनीय डिजिटल स्वास्थ्य मंच।
            </p>
          </div>
        </div>

        {/* Institutional Identity & Parent Unit */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-6 sm:p-10 shadow-md space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-emerald-300 font-bold">
                संस्थागत संरचना (Organizational Framework)
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                दरभंगा डिजिटल नेटवर्क की अधिकृत इकाई
              </h2>
            </div>
          </div>

          <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
            <strong>&quot;हिंदी हेल्थ गाइड&quot;</strong> अपनी मूल संस्था <strong>दरभंगा डिजिटल नेटवर्क</strong> के तत्वावधान में संचालित एक स्वतंत्र व गैर-पक्षपाती जन-स्वास्थ्य साक्षरता पहल है। इसका मुख्य उद्देश्य हिंदी भाषी क्षेत्रों में चिकित्सा विज्ञान, प्रजनन स्वास्थ्य और यौन कल्याण से जुड़े संवेदनशील विषयों पर बिना किसी झिझक के सटीक, तथ्यपरक और उच्च-गुणवत्ता वाली स्वास्थ्य सामग्री उपलब्ध कराना है।
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-700/80">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-xs text-emerald-300 font-semibold">मूल संस्था</p>
              <p className="text-sm font-bold text-white mt-1">दरभंगा डिजिटल नेटवर्क</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-xs text-teal-300 font-semibold">पंजीकृत मुख्य कार्यालय</p>
              <p className="text-sm font-bold text-white mt-1">दरभंगा, बिहार (847121)</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-xs text-amber-300 font-semibold">आधिकारिक संपर्क ईमेल</p>
              <p className="text-sm font-bold text-white mt-1">info@hindihealthguide.org</p>
            </div>
          </div>
        </div>

        {/* Editorial Leadership: Rajesh Kumar Sahu */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-emerald-100 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                  संपादकीय नेतृत्व (Editorial Leadership)
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  प्रधान संपादक का परिचय व मिशन
                </h2>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold px-3 py-1.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>प्रमाणित स्वास्थ्य विश्लेषक</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start gap-6 pt-2">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-teal-700 via-teal-600 to-emerald-500 text-white font-black text-3xl sm:text-4xl flex items-center justify-center shadow-lg shrink-0">
              र
            </div>

            <div className="space-y-3 flex-1">
              <div>
                <h3 className="text-2xl font-black text-slate-900">राजेश कुमार साहू</h3>
                <p className="text-sm font-bold text-teal-700 mt-0.5">
                  प्रधान संपादक (Chief Editor) एवं स्वास्थ्य विश्लेषक
                </p>
                <p className="text-xs text-slate-500">
                  संस्थापक एवं संपादकीय प्रमुख · हिंदी हेल्थ गाइड (दरभंगा डिजिटल नेटवर्क)
                </p>
              </div>

              <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                <strong>राजेश कुमार साहू</strong> के संपादकीय नेतृत्व में हिंदी हेल्थ गाइड भारत का एक विश्वसनीय हिंदी-प्रथम स्वास्थ्य पोर्टल बनकर उभरा है। उनका दृढ़ विश्वास है कि जन-स्वास्थ्य जागरूकता में गोपनीयता, सम्मान और वैज्ञानिक तथ्यों की उपलब्धता सर्वोपरि है। वे विश्व स्वास्थ्य संगठन (WHO), राष्ट्रीय एड्स नियंत्रण संगठन (NACO), तथा केंद्रीय स्वास्थ्य एवं परिवार कल्याण मंत्रालय के क्लिनिकल दिशानिर्देशों के अनुरूप सामग्री की कड़ी समीक्षा व सत्यापन सुनिश्चित करते हैं।
              </p>

              <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-teal-600" />
                  <a href="tel:+919341050287" className="font-semibold text-slate-800 hover:text-teal-700">
                    +91-9341050287
                  </a>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-emerald-600" />
                  <a href="mailto:support@hindihealthguide.org" className="font-semibold text-slate-800 hover:text-emerald-700">
                    support@hindihealthguide.org
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & YMYL Quality Commitments */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-emerald-100 space-y-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">हमारा मिशन एवं क्लिनिकल सिद्धांत</h2>
            <p className="text-slate-600 text-sm mt-1">
              Google YMYL (Your Money or Your Life) और चिकित्सा आचार संहिता के अनुरूप स्वास्थ्य सामग्री का निर्माण।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-teal-700" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">1. वैज्ञानिक एवं प्रमाण-आधारित सामग्री</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                प्रत्येक लेख के तथ्य सहकर्मी-समीक्षित मेडिकल पत्रिकाओं (Peer-reviewed journals), डब्ल्यूएचओ और एनएसीओ के आधिकारिक सांख्यिकी पर आधारित होते हैं।
              </p>
            </div>

            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Users className="w-5 h-5 text-emerald-700" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">2. सामाजिक संवेदनशीलता एवं सम्मान</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                यौन शिक्षा, गर्भनिरोध और मासिक धर्म जैसे संवेदनशील विषयों पर किसी भी प्रकार के पूर्वाग्रह या संकोच के बिना निष्पक्ष और सम्मानजनक भाषा का प्रयोग।
              </p>
            </div>

            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                <Award className="w-5 h-5 text-blue-700" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">3. बहुस्तरीय संपादकीय सत्यापन</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                लेखों के प्रकाशन से पूर्व एआई-फैक्ट चेक व संपादकीय समीक्षा के माध्यम से मिथकों और भ्रामक दावों का खंडन किया जाता है।
              </p>
            </div>

            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-amber-700" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">4. सुलभ और स्पष्ट हिंदी भाषा</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                जटिल चिकित्सीय शब्दावली को आम नागरिक और युवाओं के समझने योग्य सरल, सुगम और सटीक हिंदी में प्रस्तुत करना।
              </p>
            </div>
          </div>
        </div>

        {/* Action Call & Contact Link */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">संपादकीय टीम से संपर्क करें</h3>
            <p className="text-sm text-slate-600 mt-0.5">
              किसी लेख पर सुझाव देने या सुधार का अनुरोध करने के लिए हमारा संपर्क पृष्ठ देखें।
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link
              href="/editorial-policy"
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-5 py-2.5 rounded-xl text-sm transition"
            >
              संपादकीय नीति
            </Link>
            <Link
              href="/contact"
              className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition shadow-sm"
            >
              संपर्क विवरण देखें &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

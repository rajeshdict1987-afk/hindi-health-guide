import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Phone,
  Mail,
  UserCheck,
  ShieldCheck,
  Clock,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { SITE_CONFIG } from '../../src/config/site-config';

export const metadata: Metadata = {
  title: 'संपर्क करें (Contact Us) | मुख्य कार्यालय एवं संपादकीय संपर्क – हिंदी हेल्थ गाइड',
  description:
    'दरभंगा डिजिटल नेटवर्क की इकाई - हिंदी हेल्थ गाइड। मुख्य कार्यालय: दरभंगा, बिहार। प्रधान संपादक: राजेश कुमार साहू। आधिकारिक फोन: +91-9341050287 एवं ईमेल संपर्क।',
  alternates: {
    canonical: `${SITE_CONFIG.productionUrl}/contact`,
  },
  openGraph: {
    type: 'website',
    locale: 'hi_IN',
    url: `${SITE_CONFIG.productionUrl}/contact`,
    siteName: SITE_CONFIG.hindiName,
    title: 'संपर्क करें (Contact Us) | हिंदी हेल्थ गाइड',
    description:
      'दरभंगा डिजिटल नेटवर्क की इकाई - हिंदी हेल्थ गाइड का आधिकारिक संपर्क पृष्ठ। मुख्य कार्यालय एवं प्रधान संपादक संपर्क विवरण।',
  },
};

export default function ContactPage() {
  return (
    <div className="bg-emerald-50/40 min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation & Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-emerald-100/80">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-teal-700 hover:text-teal-800 text-sm font-semibold transition mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
            <span>मुख्य पृष्ठ पर लौटें</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-100/70 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-3">
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>दरभंगा डिजिटल नेटवर्क की अधिकृत इकाई</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                संपर्क करें <span className="text-teal-700">(Contact Us)</span>
              </h1>
              <p className="text-slate-600 text-base sm:text-lg mt-2 max-w-2xl leading-relaxed">
                प्रकाशन, संस्थागत विवरण, संपादकीय मार्गदर्शन अथवा तकनीकी सहायता के लिए हमारे आधिकारिक चैनलों से संपर्क करें।
              </p>
            </div>

            {/* Quick trust metric */}
            <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 sm:p-5 flex items-center gap-3 shrink-0">
              <ShieldCheck className="w-9 h-9 text-teal-700 shrink-0" />
              <div className="text-xs sm:text-sm">
                <p className="font-bold text-slate-900">100% उत्तरदायित्व एवं पारदर्शिता</p>
                <p className="text-slate-600">औसतन 24 से 48 घंटे में प्रतिक्रिया</p>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* ============================================================ */}
          {/* COLUMN 1: मुख्य कार्यालय एवं संस्थागत विवरण (Main Office & Org) */}
          {/* ============================================================ */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-100 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              {/* Column 1 Title Badge */}
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-700">स्तंभ १ (Column 1)</span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    मुख्य कार्यालय एवं संस्थागत विवरण
                  </h2>
                </div>
              </div>

              {/* Organization Card */}
              <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">संस्था का नाम (Parent Organization)</p>
                <p className="text-base sm:text-lg font-bold text-slate-900">
                  दरभंगा डिजिटल नेटवर्क की इकाई - हिंदी हेल्थ गाइड
                </p>
                <p className="text-xs text-slate-600 font-medium">
                  (Unit of Darbhanga Digital Network · Digital Health Literacy Initiative)
                </p>
              </div>

              {/* Physical Address */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5 text-teal-700" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900">भौतिक पता (Physical Address)</h3>
                  <p className="text-sm text-slate-700 leading-relaxed font-normal">
                    वार्ड नंबर 09, विलेज पैगंबरपुर, पोस्ट- दरिमा, थाना- केवटी, जिला- दरभंगा, पिन कोड- 847121, बिहार, भारत।
                  </p>
                  <p className="text-xs text-slate-500">
                    Ward No. 09, Village Paigambarpur, Post- Darima, Thana- Keoti, Dist- Darbhanga, PIN- 847121, Bihar, India.
                  </p>
                </div>
              </div>

              {/* Phone / Helpline */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-teal-50/50 border border-teal-100">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-5 h-5 text-teal-700" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900">फोन / हेल्पलाइन (Phone & Helpline)</h3>
                  <a
                    href="tel:+919341050287"
                    className="text-base sm:text-lg font-bold text-teal-800 hover:text-teal-900 transition block"
                  >
                    +91-9341050287
                  </a>
                  <p className="text-xs text-slate-500">सोमवार से शनिवार (10:00 AM – 06:00 PM IST)</p>
                </div>
              </div>

              {/* Two Official Emails */}
              <div className="space-y-3 pt-1">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide">आधिकारिक संस्थागत ईमेल (Official Emails)</h3>

                {/* Email 1: Darbhanga Digital Network Info */}
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <Mail className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm">
                    <p className="font-semibold text-slate-700">दरभंगा डिजिटल नेटवर्क सामान्य सूचना (Corporate Info):</p>
                    <a
                      href="mailto:info@hindihealthguide.org"
                      className="font-bold text-teal-800 hover:underline break-all"
                    >
                      info@hindihealthguide.org
                    </a>
                  </div>
                </div>

                {/* Email 2: Hindi Health Guide Contact Us */}
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <Mail className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm">
                    <p className="font-semibold text-slate-700">हिंदी हेल्थ गाइड संपर्क डेस्क (General Inquiries):</p>
                    <a
                      href="mailto:contact@hindihealthguide.org"
                      className="font-bold text-emerald-800 hover:underline break-all"
                    >
                      contact@hindihealthguide.org
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-teal-600" /> कार्य दिवस: सोम-शनि
              </span>
              <span className="text-teal-700 font-semibold">पंजीकृत डिजिटल प्रकाशन</span>
            </div>
          </div>

          {/* ============================================================ */}
          {/* COLUMN 2: सहायता केंद्र एवं प्रधान संपादक संपर्क (Support & Editor) */}
          {/* ============================================================ */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-100 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              {/* Column 2 Title Badge */}
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">स्तंभ २ (Column 2)</span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    सहायता केंद्र एवं प्रधान संपादक संपर्क
                  </h2>
                </div>
              </div>

              {/* Purpose Banner */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 sm:p-5 space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                  <MessageSquare className="w-4 h-4 text-emerald-700" />
                  <span>उद्देश्य एवं सीधा संपर्क (Purpose)</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  किसी भी समस्या, चिकित्सकीय तथ्य सत्यापन, कॉपीराइट अथवा संपादकीय सहायता के लिए प्रधान संपादक से सीधा संपर्क करें।
                </p>
              </div>

              {/* Chief Editor Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white shadow-md space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-white font-black text-2xl shadow-inner shrink-0">
                    र
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                      प्रधान संपादक (Chief Editor)
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white">राजेश कुमार साहू</h3>
                    <p className="text-xs text-slate-300 font-medium">
                      प्रधान संपादक एवं स्वास्थ्य विश्लेषक (Chief Editor & Health Analyst)
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed border-t border-slate-700/80 pt-3">
                  वैज्ञानिक और प्रमाण-आधारित यौन एवं प्रजनन स्वास्थ्य जागरूकता के प्रति समर्पित। डब्ल्यूएचओ (WHO) एवं एनएसीओ (NACO) दिशानिर्देशों के अनुरूप स्वास्थ्य सामग्री का क्लिनिकल अनुपालन सुनिश्चित करना।
                </p>
              </div>

              {/* Direct Editor Helpline */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-teal-50/50 border border-teal-100">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-5 h-5 text-teal-700" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900">संपादकीय हेल्पलाइन (Editorial Line)</h3>
                  <a
                    href="tel:+919341050287"
                    className="text-base sm:text-lg font-bold text-teal-800 hover:text-teal-900 transition block"
                  >
                    +91-9341050287
                  </a>
                  <p className="text-xs text-slate-500">संपादकीय परामर्श, प्रेस एवं सुधारात्मक पूछताछ हेतु</p>
                </div>
              </div>

              {/* Dedicated Support Email */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-5 h-5 text-emerald-700" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900">सहायता केंद्र ईमेल (Support Email)</h3>
                  <a
                    href="mailto:support@hindihealthguide.org"
                    className="text-base sm:text-lg font-bold text-emerald-800 hover:text-emerald-900 transition break-all block"
                  >
                    support@hindihealthguide.org
                  </a>
                  <p className="text-xs text-slate-500">उपयोगकर्ता सहायता, सुधार एवं फीडबैक हेतु</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> गोपनीयता की शत-प्रतिशत गारंटी
              </span>
              <Link href="/editorial-policy" className="text-teal-700 font-semibold hover:underline">
                संपादकीय नीति &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Emergency Helplines Notice (Government Helplines) */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                आपातकालीन राष्ट्रीय स्वास्थ्य सेवाएं (National Emergency Helplines)
              </span>
              <h3 className="text-lg sm:text-xl font-bold mt-1">तत्काल चिकित्सा अथवा मनोवैज्ञानिक सहायता</h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                हिंदी हेल्थ गाइड एक शैक्षिक मंच है। आपात स्थिति में तुरंत सरकारी हेल्पलाइन या निकटतम अस्पताल से संपर्क करें।
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="bg-slate-800/90 border border-slate-700 px-4 py-2 rounded-xl text-xs sm:text-sm">
                <span className="text-slate-400 block text-[10px]">राष्ट्रीय स्वास्थ्य हेल्पलाइन</span>
                <span className="font-bold text-emerald-400">1075</span>
              </div>
              <div className="bg-slate-800/90 border border-slate-700 px-4 py-2 rounded-xl text-xs sm:text-sm">
                <span className="text-slate-400 block text-[10px]">एड्स हेल्पलाइन (NACO)</span>
                <span className="font-bold text-teal-400">1097</span>
              </div>
              <div className="bg-slate-800/90 border border-slate-700 px-4 py-2 rounded-xl text-xs sm:text-sm">
                <span className="text-slate-400 block text-[10px]">टेली-मानस (मानसिक स्वास्थ्य)</span>
                <span className="font-bold text-amber-400">14416</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

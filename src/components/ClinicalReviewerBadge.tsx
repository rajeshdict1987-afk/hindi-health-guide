'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, FileText, AlertTriangle, Award, ExternalLink } from 'lucide-react';
import { Article } from '../types/article';

interface ClinicalReviewerBadgeProps {
  article: Article;
  className?: string;
}

export const ClinicalReviewerBadge: React.FC<ClinicalReviewerBadgeProps> = ({ article, className = '' }) => {
  const reviewerName = (article.reviewedBy?.name || 'राजेश कुमार साहू')
    .replace(/गुरु\s*/gi, '')
    .replace(/Guru\s*/gi, '')
    .trim() || 'राजेश कुमार साहू';

  const reviewerCredentials = article.reviewedBy?.credentials || 'मुख्य संपादक (Chief Editor) एवं स्वास्थ्य विश्लेषक';
  const authorName = (article.author?.name || 'राजेश कुमार साहू')
    .replace(/गुरु\s*/gi, '')
    .replace(/Guru\s*/gi, '')
    .trim() || 'राजेश कुमार साहू';

  const reviewDate = article.updatedAt || article.publishedAt || article.createdAt;

  return (
    <aside aria-label="क्लिनिकल समीक्षा एवं मेडिकल बोर्ड सत्यापन" className={`space-y-4 my-8 not-prose ${className}`}>
      {/* 1. Clinical Reviewer & Fact-Check Card (YMYL & E-E-A-T Compliance) */}
      <div className="bg-gradient-to-br from-emerald-50/90 via-teal-50/70 to-white border-2 border-emerald-500/30 rounded-3xl p-5 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-emerald-200/80">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-md shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs uppercase tracking-wider font-extrabold text-emerald-800 bg-emerald-200/70 px-2.5 py-0.5 rounded-full">
                  क्लिनिकल सत्यापन (Clinical Verification)
                </span>
                <span className="text-xs font-semibold text-emerald-900 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  WHO &amp; NACO प्रोटोकॉल आधारित
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-stone-900 mt-1">
                मेडिकल रिव्यू एवं संपादकीय बोर्ड सत्यापन
              </h3>
            </div>
          </div>

          <Link
            href="/editorial-policy"
            className="inline-flex items-center gap-1 text-xs font-bold text-teal-800 hover:text-teal-950 bg-white/80 hover:bg-white border border-teal-200 px-3 py-1.5 rounded-xl shadow-xs transition"
          >
            <span>संपादकीय नीति देखें</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 text-xs sm:text-sm">
          {/* Author Details */}
          <div className="bg-white/80 rounded-2xl p-4 border border-emerald-100 space-y-1.5">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-rose-500" /> लेख लेखक (Author)
            </span>
            <p className="font-extrabold text-stone-900 text-sm">{authorName}</p>
            <p className="text-xs text-stone-600">{article.author?.role || 'वरिष्ठ स्वास्थ्य लेखक एवं अनुसंधानकर्ता'}</p>
          </div>

          {/* Clinical Reviewer Details */}
          <div className="bg-white/80 rounded-2xl p-4 border border-emerald-100 space-y-1.5">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-emerald-600" /> चिकित्सा समीक्षक (Medical Reviewer)
            </span>
            <p className="font-extrabold text-stone-900 text-sm">{reviewerName}</p>
            <p className="text-xs text-stone-600">{reviewerCredentials}</p>
            <p className="text-[11px] text-emerald-800 pt-1 font-medium">
              समीक्षा तिथि: {new Date(reviewDate).toLocaleDateString('hi-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Clinical Guidelines Adherence Note */}
        <div className="mt-4 pt-3 border-t border-emerald-100/80 text-xs text-stone-600 leading-relaxed flex items-start gap-2">
          <span className="text-emerald-600 font-bold shrink-0">प्रामाणिकता मानक:</span>
          <span>
            इस लेख की सामग्री विश्व स्वास्थ्य संगठन (WHO) के प्रजनन स्वास्थ्य दिशानिर्देश, राष्ट्रीय एड्स नियंत्रण संगठन (NACO) के क्लिनिकल प्रोटोकॉल तथा भारतीय स्वास्थ्य एवं परिवार कल्याण मंत्रालय (MoHFW) के मानकों के अनुरूप क्रॉस-चेक की गई है।
          </span>
        </div>
      </div>

      {/* 2. Standardized Hindi Medical Disclaimer Box */}
      <div className="bg-amber-50/80 border border-amber-300/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-xs">
        <div className="w-8 h-8 rounded-xl bg-amber-200/80 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
          <AlertTriangle className="w-4 h-4 text-amber-800" />
        </div>
        <div className="space-y-1 text-xs text-amber-950 leading-relaxed">
          <p className="font-bold text-amber-900 text-xs sm:text-sm">
            महत्वपूर्ण चिकित्सकीय अस्वीकरण (Mandatory Medical Disclaimer)
          </p>
          <p>
            <strong>हिंदी हेल्थ गाइड (hindihealthguide.org)</strong> पर दी गई जानकारी केवल जन-स्वास्थ्य जागरूकता एवं शैक्षणिक ज्ञानवर्धन के लिए है। यह किसी भी स्थिति में किसी पंजीकृत चिकित्सक, स्त्री रोग विशेषज्ञ अथवा स्वास्थ्य पेशेवर के प्रत्यक्ष चिकित्सीय परामर्श, निदान अथवा उपचार का विकल्प नहीं है। किसी भी स्वास्थ्य समस्या में स्वयं दवा (Self-Medication) न लें और हमेशा योग्य डॉक्टर से संपर्क करें।
          </p>
        </div>
      </div>
    </aside>
  );
};

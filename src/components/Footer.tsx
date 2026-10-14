import React from 'react';
import {
  ShieldAlert,
  Heart,
  ExternalLink,
  PhoneCall,
  CheckCircle,
} from 'lucide-react';
import { SITE_CONFIG, FOOTER_LINKS } from '../config/site-config';
import { useRouter } from '../context/RouterContext';

import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Helplines Emergency Callout Grid */}
        <div className="bg-stone-800/80 border border-stone-700 rounded-2xl p-6 mb-12">
          <div className="flex items-center gap-2 mb-4">
            <PhoneCall className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">
              भारत सरकार की निःशुल्क एवं गोपनीय स्वास्थ्य हेल्पलाइन्स
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {SITE_CONFIG.helplines.map((line, idx) => (
              <div
                key={idx}
                className="bg-stone-900/90 rounded-xl p-4 border border-stone-700/60 hover:border-teal-500/50 transition"
              >
                <div className="text-xs text-stone-400 font-medium">{line.name}</div>
                <div className="text-xl font-extrabold text-teal-400 mt-1 flex items-baseline gap-1">
                  <span>{line.number}</span>
                </div>
                <div className="text-[11px] text-stone-400 mt-1 leading-snug">
                  {line.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4-Column Navigation Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="cursor-pointer" onClick={() => navigate('/')}>
              <BrandLogo size="md" light={true} />
            </div>
            <p className="text-sm text-stone-400 leading-relaxed max-w-sm">
              {SITE_CONFIG.tagline}। हमारा उद्देश्य भारत में यौन एवं प्रजनन स्वास्थ्य को लेकर वैज्ञानिक समझ विकसित करना और भ्रांतियों को मिटाना है।
            </p>
            <div className="flex items-center gap-2 text-xs text-stone-400 bg-stone-800/60 p-2.5 rounded-lg border border-stone-700">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>WHO, NACO और ICMR वैज्ञानिक मानकों के अनुरूप संकलित</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              स्वीकृत श्रेणियां
            </h4>
            <ul className="space-y-2.5 text-sm">
              {FOOTER_LINKS.categories.map((c, i) => (
                <li key={i}>
                  <button
                    onClick={() => navigate(c.href)}
                    className="text-stone-400 hover:text-teal-400 transition text-left"
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Institutional Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              संपादकीय एवं नीति
            </h4>
            <ul className="space-y-2.5 text-sm">
              {FOOTER_LINKS.institutional.map((item, i) => (
                <li key={i}>
                  <button
                    onClick={() => navigate(item.href)}
                    className="text-stone-400 hover:text-teal-400 transition text-left"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              कानूनी एवं सुरक्षा
            </h4>
            <ul className="space-y-2.5 text-sm">
              {FOOTER_LINKS.legal.map((item, i) => (
                <li key={i}>
                  <button
                    onClick={() => navigate(item.href)}
                    className="text-stone-400 hover:text-teal-400 transition text-left"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => navigate('/admin')}
                  className="text-teal-400/80 hover:text-teal-300 text-xs font-semibold flex items-center gap-1 mt-4"
                >
                  एडमिन / संपादक पोर्टल <ExternalLink className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Highlighted Medical Disclaimer Banner */}
        <div className="mt-8 bg-amber-950/40 border border-amber-800/70 rounded-xl p-4.5 text-xs text-amber-200/90 leading-relaxed flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-300 block mb-1">
              अनिवार्य चिकित्सीय अस्वीकरण (Medical Disclaimer):
            </span>
            {SITE_CONFIG.medicalDisclaimer}
          </div>
        </div>

        {/* Copyright and Bottom Note */}
        <div className="mt-8 pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} {SITE_CONFIG.name}. सर्वाधिकार सुरक्षित। (All Rights Reserved).</p>
          <p className="text-center sm:text-right">
            यौन शिक्षा को अश्लीलता से पूर्णतः अलग रखकर वैज्ञानिक देवनागरी हिंदी में प्रस्तुत किया गया है।
          </p>
        </div>
      </div>
    </footer>
  );
};

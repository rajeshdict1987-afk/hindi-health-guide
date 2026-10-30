'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
  HeartPulse, 
  BookOpen, 
  ShieldAlert, 
  CheckCircle2, 
  HelpCircle, 
  Smile, 
  MessageSquare, 
  Search, 
  Menu, 
  X, 
  Sparkles,
  PhoneCall,
  AlertTriangle,
  Shield,
  Home
} from 'lucide-react';
import { SITE_CONFIG } from '../config/site-config';
import { AdDisplay } from './AdDisplay';
import { PWAInstallButton } from './PWAInstallButton';
import { OfflineIndicator } from './OfflineIndicator';

import { generateWhoNacoResponse } from '../lib/whoNacoAssistant';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [askAiOpen, setAskAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-3.8-flash');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'model', text: string }>>([
    {
      role: 'model',
      text: 'नमस्ते! मैं आपका एआई स्वास्थ्य मित्र हूँ। आप यौन स्वास्थ्य, प्रजनन स्वास्थ्य, और सामान्य कल्याण से संबंधित कोई भी प्रश्न यहाँ पूछ सकते हैं। मैं डब्ल्यूएचओ और एनएसीओ के मानकों पर आधारित वैज्ञानिक जानकारी प्रदान करता हूँ।'
    }
  ]);

  const router = useRouter();
  const pathname = usePathname();

  // Production Service Worker Registration for 100% PWA Compliance & Offline Capability
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {
          // Graceful fallback for non-supported or restricted environments
        });
      });
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleAskAi = async (e?: React.FormEvent, overridePrompt?: string) => {
    if (e) e.preventDefault();
    const promptToSend = overridePrompt !== undefined ? overridePrompt : aiPrompt;
    if (!promptToSend.trim() || aiLoading) return;

    const userMessage = promptToSend.trim();
    if (overridePrompt === undefined) {
      setAiPrompt('');
    }

    const newMessages = [...messages, { role: 'user' as const, text: userMessage }];
    setMessages(newMessages);
    setAiLoading(true);

    try {
      const historyToSend = messages.map(m => ({ role: m.role, text: m.text }));
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMessage,
          history: historyToSend,
          model: selectedModel
        })
      });
      const data = await res.json();
      const replyText = data.text || generateWhoNacoResponse(userMessage);
      setMessages([...newMessages, { role: 'model' as const, text: replyText }]);
    } catch {
      const fallbackReply = generateWhoNacoResponse(userMessage);
      setMessages([...newMessages, { role: 'model' as const, text: fallbackReply }]);
    } finally {
      setAiLoading(false);
    }
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'HeartPulse': return <HeartPulse className="w-5 h-5 text-rose-600" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5 text-emerald-600" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5 text-amber-600" />;
      case 'CheckCircle2': return <CheckCircle2 className="w-5 h-5 text-blue-600" />;
      case 'HelpCircle': return <HelpCircle className="w-5 h-5 text-purple-600" />;
      case 'Smile': return <Smile className="w-5 h-5 text-indigo-600" />;
      default: return <MessageSquare className="w-5 h-5 text-teal-600" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans pb-16 md:pb-0">
      {/* Top Emergency / Helpline Banner */}
      <div className="bg-slate-900 border-b border-teal-900/60 text-slate-200 text-xs sm:text-sm py-2 px-3 sm:px-4 text-center font-medium flex items-center justify-center gap-2 shadow-inner">
        <AlertTriangle className="w-4 h-4 shrink-0 text-emerald-400 animate-pulse" />
        <span>आपातकालीन सहायता: <strong className="text-emerald-300">108 / 102</strong> | एड्स हेल्पलाइन (NACO): <strong className="text-teal-300">1097</strong> | टेली-मानस: <strong className="text-amber-300">14416</strong></span>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-emerald-100 shadow-xs w-full">
        <div className="w-full max-w-full px-3 sm:px-6 h-20 sm:h-26 md:h-32 flex items-center justify-between gap-2">
          {/* Left spacer / mobile hamburger */}
          <div className="flex items-center gap-2 md:hidden shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-emerald-50 focus:outline-none transition"
              aria-label="मेनू खोलें"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          <div className="hidden md:block w-44 lg:w-48 shrink-0">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-teal-800 bg-emerald-50/80 hover:bg-emerald-100/80 border border-emerald-200/60 px-3 py-2 rounded-xl transition"
            >
              <Shield className="w-4 h-4 text-teal-700" />
              <span>एडमिन पैनल</span>
            </Link>
          </div>

          {/* Official Logo Image - Exact tight-fit white background matching logo size */}
          <Link
            href="/"
            className="flex items-center group min-w-0 md:mx-0 md:absolute md:left-1/2 md:-translate-x-1/2 py-1"
          >
            <div className="inline-flex items-center bg-white rounded-xl shadow-xs border border-emerald-100/80 overflow-hidden">
              <Image
                src="/logo.png"
                alt="हिंदी हेल्थ गाइड (Hindi Health Guide)"
                width={1100}
                height={230}
                className="h-14 sm:h-20 md:h-26 w-auto object-contain object-left md:object-center group-hover:scale-105 transition duration-300 p-0.5"
                referrerPolicy="no-referrer"
                priority
              />
            </div>
          </Link>

          {/* Right Action Buttons & Search */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <form onSubmit={handleSearch} className="hidden lg:flex items-center relative w-60 xl:w-64">
              <input
                type="text"
                placeholder="स्वास्थ्य विषय खोजें..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3" />
            </form>

            <PWAInstallButton className="hidden sm:inline-flex" />

            <button
              onClick={() => setAskAiOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-teal-700 to-emerald-600 text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold shadow hover:opacity-95 transition shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-200" />
              <span className="hidden sm:inline">एआई स्वास्थ्य मित्र</span>
              <span className="sm:hidden text-xs">एआई</span>
            </button>

          </div>
        </div>

        {/* Categories Bar (Desktop & Desktop Mode) with Home as first item */}
        <nav className="hidden md:flex items-center justify-start xl:justify-center gap-1.5 lg:gap-2 bg-emerald-50/50 border-t border-emerald-100 px-3 sm:px-6 py-2 overflow-x-auto text-xs lg:text-sm w-full max-w-full scroll-smooth">
          <Link
            href="/"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap shrink-0 ${
              pathname === '/' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-700 hover:bg-emerald-100/70'
            }`}
          >
            <Home className="w-4 h-4 shrink-0" />
            <span>होम</span>
          </Link>
          {SITE_CONFIG.categories.map((cat) => {
            const isActive = pathname === `/category/${cat.slug}`;
            return (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap shrink-0 ${
                  isActive ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-700 hover:bg-emerald-100/70'
                }`}
              >
                <span className="shrink-0">{getCategoryIcon(cat.icon)}</span>
                <span className="shrink-0">{cat.hindiName}</span>
              </Link>
            );
          })}
        </nav>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end">
          <div className="w-80 bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <span className="font-bold text-lg text-stone-900">श्रेणियां और मेनू</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 rounded-lg text-stone-500 hover:bg-stone-100">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mt-4 relative">
                <input
                  type="text"
                  placeholder="स्वास्थ्य विषय खोजें..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </form>

              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-lg font-semibold text-sm shadow hover:bg-slate-800 transition"
              >
                <Shield className="w-4 h-4 text-teal-400" />
                <span>एडमिन पैनल (आर्टिकल्स और विज्ञापन)</span>
              </Link>

              <button
                onClick={() => { setMobileMenuOpen(false); setAskAiOpen(true); }}
                className="w-full mt-3 flex items-center justify-center gap-2 bg-gradient-to-r from-teal-700 to-emerald-600 text-white py-2.5 rounded-lg font-semibold text-sm shadow"
              >
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>एआई स्वास्थ्य मित्र से पूछें</span>
              </button>

              <div className="mt-3">
                <PWAInstallButton className="w-full justify-center py-2.5" />
              </div>


              <div className="mt-6 space-y-1">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition ${
                    pathname === '/' ? 'bg-teal-700 text-white font-bold' : 'text-slate-800 hover:bg-emerald-50'
                  }`}
                >
                  <Home className={`w-5 h-5 ${pathname === '/' ? 'text-white' : 'text-teal-700'}`} />
                  <span>होम</span>
                </Link>
                {SITE_CONFIG.categories.map((cat) => {
                  const isActive = pathname === `/category/${cat.slug}`;
                  return (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition ${
                        isActive ? 'bg-teal-700 text-white font-bold' : 'text-slate-800 hover:bg-emerald-50'
                      }`}
                    >
                      {getCategoryIcon(cat.icon)}
                      <span>{cat.hindiName}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 text-xs text-slate-500 text-center">
              &copy; {new Date().getFullYear()} हिंदी हेल्थ गाइड (दरभंगा डिजिटल नेटवर्क की इकाई). सर्वाधिकार सुरक्षित।
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-300 mt-16 pt-12 pb-8 border-t border-slate-800 w-full">
        <div className="w-full max-w-full px-3 sm:px-6">

          {/* Footer Ad Banner */}
          <div className="mb-10">
            <AdDisplay position="footer" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="mb-4">
                <div className="inline-flex items-center bg-white rounded-xl shadow-xs border border-emerald-100/80 overflow-hidden">
                  <Image
                    src="/logo.png"
                    alt="हिंदी हेल्थ गाइड (Hindi Health Guide)"
                    width={400}
                    height={90}
                    className="h-10 w-auto object-contain object-left p-0.5"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                दरभंगा डिजिटल नेटवर्क की इकाई – भारत का अग्रणी और विश्वसनीय डिजिटल स्वास्थ्य मंच, जो विश्व स्वास्थ्य संगठन (WHO) तथा राष्ट्रीय एड्स नियंत्रण संगठन (NACO) के क्लिनिकल मानकों पर आधारित यौन एवं प्रजनन स्वास्थ्य साक्षरता प्रदान करता है।
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white text-base mb-4">त्वरित लिंक</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/about" className="hover:text-emerald-400 transition">हमारे बारे में (About Us)</Link></li>
                <li><Link href="/editorial-policy" className="hover:text-emerald-400 transition">संपादकीय नीति (Editorial Policy)</Link></li>
                <li><Link href="/medical-disclaimer" className="hover:text-emerald-400 transition">चिकित्सा अस्वीकरण (Disclaimer)</Link></li>
                <li><Link href="/contact" className="hover:text-emerald-400 transition">संपर्क करें (Contact Us)</Link></li>
                <li><Link href="/admin" className="text-teal-400 font-semibold hover:underline">एडमिन पैनल (Admin Panel)</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white text-base mb-4">कानूनी और गोपनीयता</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/privacy-policy" className="hover:text-emerald-400 transition">गोपनीयता नीति (Privacy Policy)</Link></li>
                <li><Link href="/terms" className="hover:text-emerald-400 transition">नियम एवं शर्तें (Terms)</Link></li>
                <li><Link href="/sitemap.xml" className="hover:text-emerald-400 transition">साइटमैप (Sitemap)</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white text-base mb-4">महत्वपूर्ण हेल्पलाइन</h4>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3 text-sm">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <PhoneCall className="w-4 h-4" />
                  <span>राष्ट्रीय स्वास्थ्य हेल्पलाइन: 1075</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  यह पोर्टल केवल शैक्षिक उद्देश्यों के लिए है। किसी भी चिकित्सीय आपात स्थिति में तुरंत डॉक्टर से परामर्श लें।
                </p>
              </div>
            </div>
          </div>

          {/* Standardized Doctor-Grade Clinical & Public Health Disclaimer (WHO/NACO Compliance) */}
          <div className="w-full max-w-full mt-8 p-5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 space-y-2 leading-relaxed">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>महत्वपूर्ण चिकित्सकीय एवं जन-स्वास्थ्य अस्वीकरण (Standard Medical Disclaimer)</span>
            </div>
            <p>
              <strong>हिंदी हेल्थ गाइड (hindihealthguide.org)</strong> पर प्रकाशित सभी लेख, गाइड एवं सामग्रियां केवल जन-स्वास्थ्य जागरूकता, स्वास्थ्य साक्षरता तथा सामान्य ज्ञानवर्धन के उद्देश्य से प्रदान की जाती हैं। यह सामग्री किसी भी रूप में किसी योग्य एवं पंजीकृत चिकित्सक (Registered Medical Practitioner/Doctor) के व्यक्तिगत चिकित्सीय परामर्श, क्लिनिकल निदान अथवा उपचार का विकल्प नहीं है। किसी भी शारीरिक या मानसिक स्वास्थ्य समस्या, लक्षण अथवा दवा सेवन से पहले अपने निकटतम चिकित्सक से प्रत्यक्ष सलाह अवश्य लें। हमारा संपादकीय बोर्ड विश्व स्वास्थ्य संगठन (WHO), राष्ट्रीय एड्स नियंत्रण संगठन (NACO) तथा भारतीय स्वास्थ्य मंत्रालय (MoHFW) के क्लिनिकल दिशानिर्देशों का कड़ाई से पालन करता है।
            </p>
          </div>

          <div className="w-full max-w-full mt-6 pt-6 border-t border-slate-800 text-center text-xs text-slate-400">
            &copy; {new Date().getFullYear()} हिंदी हेल्थ गाइड (दरभंगा डिजिटल नेटवर्क) — आधिकारिक ईमेल: <a href="mailto:info@hindihealthguide.org" className="text-emerald-400 hover:underline">info@hindihealthguide.org</a> — सर्वाधिकार सुरक्षित।
          </div>

        </div>
      </footer>

      {/* AI Health Assistant Modal */}
      {askAiOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh]">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg">एआई स्वास्थ्य मित्र (AI Health Assistant)</h3>
                  <p className="text-xs text-teal-100">डब्ल्यूएचओ और एनएसीओ मानकों पर आधारित वैज्ञानिक और सुरक्षित मार्गदर्शन</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMessages([{ role: 'model', text: 'नमस्ते! मैं आपका एआई स्वास्थ्य मित्र हूँ। आप यौन स्वास्थ्य, प्रजनन स्वास्थ्य, और सामान्य कल्याण से संबंधित कोई भी प्रश्न यहाँ पूछ सकते हैं।' }])}
                  className="text-xs bg-white/20 hover:bg-white/30 text-white px-2.5 py-1.5 rounded-lg transition"
                  title="बातचीत साफ़ करें"
                >
                  रीसेट
                </button>
                <button onClick={() => setAskAiOpen(false)} className="text-white/80 hover:text-white p-1">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Sub-bar for model & disclaimer notice */}
            <div className="bg-teal-50 px-4 py-2.5 border-b border-teal-100 flex flex-wrap items-center justify-between gap-2 text-xs text-teal-900 shrink-0">
              <span className="font-medium">आपातकालीन स्थिति में तुरंत डॉक्टर से संपर्क करें।</span>
              <div className="flex items-center gap-2">
                <span className="text-teal-700 font-semibold">मॉडल:</span>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="bg-white border border-teal-200 rounded px-2 py-1 text-xs font-semibold text-teal-800 focus:outline-none"
                >
                  <option value="gemini-3.8-flash">Gemini 3.8 Flash (Standard)</option>
                  <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash Lite (Fast)</option>
                  <option value="gemini-4-argon">Gemini 4 Argon (Advanced)</option>
                </select>
              </div>
            </div>

            {/* Scrollable Message Thread */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 bg-stone-50">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'model' && (
                    <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0 shadow">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-rose-600 text-white rounded-br-none'
                        : 'bg-white text-stone-800 border border-stone-200 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0 shadow font-bold text-xs">
                      आप
                    </div>
                  )}
                </div>
              ))}

              {aiLoading && (
                <div className="flex gap-3 justify-start items-center">
                  <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0 shadow animate-pulse">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="bg-white border border-stone-200 p-3 rounded-2xl rounded-bl-none text-xs text-stone-500 shadow-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce delay-100"></span>
                    <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce delay-200"></span>
                    <span>एआई स्वास्थ्य मित्र उत्तर तैयार कर रहा है...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Suggestion Pills */}
            <div className="px-4 py-2 bg-white border-t border-stone-200 flex items-center gap-2 overflow-x-auto shrink-0">
              <span className="text-xs font-bold text-stone-500 whitespace-nowrap">त्वरित प्रश्न:</span>
              {[
                "कंडोम के उपयोग और लाभ",
                "पीरियड्स में अनियमितता",
                "एड्स (HIV) लक्षण व बचाव",
                "गुप्त रोग (STIs) सावधानियां"
              ].map((suggestion, sIdx) => (
                <button
                  key={sIdx}
                  onClick={() => handleAskAi(undefined, suggestion)}
                  className="bg-stone-100 hover:bg-teal-50 hover:text-teal-700 text-stone-700 text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition border border-stone-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {/* Chat Input Form */}
            <form onSubmit={handleAskAi} className="p-4 bg-white border-t border-stone-200 flex items-center gap-3 shrink-0">
              <input
                type="text"
                placeholder="यहाँ अपना स्वास्थ्य प्रश्न हिंदी में टाइप करें..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="flex-1 px-4 py-3 bg-stone-100 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
              />
              <button
                type="submit"
                disabled={aiLoading || !aiPrompt.trim()}
                className="bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-teal-700 transition flex items-center gap-2 shadow disabled:opacity-50 shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                <span>भेजें</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Real-time Network Connectivity & Offline Indicator */}
      <OfflineIndicator />
    </div>
  );
}


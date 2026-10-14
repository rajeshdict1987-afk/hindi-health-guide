import React, { useState } from 'react';
import { Mail, Send, PhoneCall, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { SITE_CONFIG } from '../config/site-config';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState(SITE_CONFIG.categories[0].name);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <>
      <SEOHead
        title="संपर्क करें (Contact Us)"
        description="हिंदी हेल्थ गाइड की संपादकीय टीम और चिकित्सा सलाहकारों से संपर्क करें या अपना गोपनीय स्वास्थ्य प्रश्न भेजें।"
      />

      <div className="bg-stone-50 min-h-screen py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              संवाद एवं सहयोग
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight mt-4">
              संपर्क करें (Contact Hindi Health Guide)
            </h1>
            <p className="mt-3 text-stone-600 text-sm sm:text-base max-w-xl mx-auto">
              स्वास्थ्य संबंधी प्रश्न, संपादकीय सुधार सुझाव या विशेषज्ञ समीक्षा के लिए हमारी टीम से संपर्क करें। आपकी पहचान पूर्णतः गोपनीय रखी जाती है।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Contact Form */}
            <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs">
              {submitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-stone-900">
                    आपका संदेश सफलतापूर्वक प्राप्त हुआ!
                  </h3>
                  <p className="text-stone-600 text-sm max-w-sm mx-auto">
                    हमारी संपादकीय एवं मेडिकल टीम आपके प्रश्न का अध्ययन कर शीघ्र ही गोपनीय रूप से उत्तर देगी।
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setMessage('');
                    }}
                    className="text-xs font-bold text-teal-700 underline"
                  >
                    दूसरा संदेश भेजें
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="text-lg font-bold text-stone-900 mb-2">
                    गोपनीय प्रश्न या संदेश भेजें
                  </h2>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      आपका नाम या उपनाम (वैकल्पिक)
                    </label>
                    <input
                      type="text"
                      placeholder="उदा. राहुल या अनाम"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-hidden focus:bg-white focus:border-teal-600 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      ईमेल पता (जवाब पाने के लिए) *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-hidden focus:bg-white focus:border-teal-600 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      संबंधित श्रेणी चुनें
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-hidden focus:bg-white focus:border-teal-600 text-sm"
                    >
                      {SITE_CONFIG.categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      आपका प्रश्न या संदेश *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="कृपया अपना प्रश्न या सुझाव स्पष्ट रूप से लिखें..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-hidden focus:bg-white focus:border-teal-600 text-sm"
                    />
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>आपकी जानकारी किसी तीसरे पक्ष के साथ कभी साझा नहीं की जाएगी।</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-sm text-sm"
                  >
                    <Send className="w-4 h-4" />
                    <span>गोपनीय संदेश भेजें</span>
                  </button>
                </form>
              )}
            </div>

            {/* Direct Info & Helplines Sidebar */}
            <div className="md:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
                <div className="flex items-center gap-2 text-teal-800 font-bold mb-3">
                  <Mail className="w-5 h-5" />
                  <span>सीधा संपादकीय ईमेल</span>
                </div>
                <p className="text-xs text-stone-500 mb-2">
                  पत्रकारिता, विशेषज्ञ समीक्षा या साझेदारी के लिए:
                </p>
                <a
                  href={`mailto:${SITE_CONFIG.contactEmail}`}
                  className="text-sm font-bold text-teal-700 hover:underline break-all"
                >
                  {SITE_CONFIG.contactEmail}
                </a>
              </div>

              <div className="bg-gradient-to-br from-teal-900 to-stone-900 text-white rounded-3xl p-6 shadow-md">
                <div className="flex items-center gap-2 font-bold mb-2 text-teal-300">
                  <PhoneCall className="w-4 h-4" />
                  <span>आपातकालीन सहायता</span>
                </div>
                <p className="text-xs text-teal-100 leading-relaxed mb-4">
                  यदि आपको तत्काल चिकित्सीय या मानसिक परामर्श की आवश्यकता है, तो राष्ट्रीय हेल्पलाइन पर तुरंत संपर्क करें:
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center bg-white/10 p-2 rounded-lg">
                    <span>NACO एड्स/STI:</span>
                    <strong className="text-emerald-300 text-sm">1097</strong>
                  </div>
                  <div className="flex justify-between items-center bg-white/10 p-2 rounded-lg">
                    <span>राष्ट्रीय स्वास्थ्य (NHP):</span>
                    <strong className="text-emerald-300 text-sm">1800-180-1104</strong>
                  </div>
                  <div className="flex justify-between items-center bg-white/10 p-2 rounded-lg">
                    <span>Tele-MANAS (मानसिक):</span>
                    <strong className="text-emerald-300 text-sm">14416</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

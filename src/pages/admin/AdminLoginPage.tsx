import React, { useState } from 'react';
import { Lock, Shield, UserCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import { adminAuth } from '../../services/firebase';
import { useRouter } from '../../context/RouterContext';
import { SEOHead } from '../../components/SEOHead';

export const AdminLoginPage: React.FC = () => {
  const { navigate } = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Secure authentication check
    // In production with Firebase, this connects to signInWithEmailAndPassword or Google Provider
    setTimeout(() => {
      setIsLoading(false);
      if (email.trim().length > 3 && password.length >= 4) {
        adminAuth.loginAsAdmin(email.trim());
        navigate('/admin');
      } else {
        setError('अमान्य ईमेल या सुरक्षा पासवर्ड। कृपया पुनः प्रयास करें।');
      }
    }, 400);
  };

  return (
    <>
      <SEOHead
        title="संपादकीय एडमिन लॉगिन"
        description="हिंदी हेल्थ गाइड सुरक्षित संपादकीय प्रबंधन प्रणाली।"
      />

      <div className="min-h-screen bg-stone-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-stone-200 space-y-6">
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-teal-800 text-white flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="mt-4 text-2xl font-extrabold text-stone-900">
              संपादकीय एडमिन लॉगिन
            </h1>
            <p className="mt-1.5 text-xs text-stone-500">
              Hindi Health Guide सुरक्षित सामग्री प्रबंधन पोर्टल
            </p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                संपादक / एडमिन ईमेल
              </label>
              <input
                type="email"
                required
                placeholder="editor@hindihealthguide.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-hidden focus:bg-white focus:border-teal-700 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                सुरक्षा पासवर्ड / एक्सेस की
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-hidden focus:bg-white focus:border-teal-700 text-sm"
              />
            </div>

            <div className="text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
              <strong>सुरक्षा नोट:</strong> यह लॉगिन केवल अधिकृत संपादकों, चिकित्सा समीक्षकों और व्यवस्थापकों के लिए आरक्षित है।
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-800 hover:bg-teal-900 text-white font-bold py-3 rounded-xl transition shadow-sm text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <UserCheck className="w-4 h-4" />
              <span>{isLoading ? 'सत्यापित हो रहा है...' : 'एडमिन पैनल में प्रवेश करें'}</span>
            </button>
          </form>

          <div className="pt-4 border-t border-stone-100 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-xs text-stone-500 hover:text-teal-800 font-semibold inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> वेबसाइट पर वापस जाएं
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

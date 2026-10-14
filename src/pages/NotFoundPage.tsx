import React from 'react';
import { HelpCircle, Home, Search, ArrowLeft } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { useRouter } from '../context/RouterContext';

export const NotFoundPage: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <>
      <SEOHead
        title="404 – पृष्ठ नहीं मिला"
        description="अनुरोधित पृष्ठ उपलब्ध नहीं है या हटा दिया गया है।"
      />

      <div className="bg-stone-50 min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 text-center shadow-md space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
            <span className="text-3xl font-extrabold">404</span>
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-stone-900">
              पृष्ठ नहीं मिला (Page Not Found)
            </h1>
            <p className="mt-2 text-stone-600 text-sm leading-relaxed">
              क्षमा करें, जिस पृष्ठ की आप तलाश कर रहे हैं वह मौजूद नहीं है, हटा दिया गया है या उसका पता बदल गया है।
            </p>
          </div>

          <div className="pt-4 flex flex-col gap-2.5">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-sm"
            >
              <Home className="w-4 h-4" />
              <span>मुख्य पृष्ठ (Homepage) पर जाएं</span>
            </button>

            <button
              onClick={() => navigate('/search')}
              className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 text-sm border border-stone-200"
            >
              <Search className="w-4 h-4" />
              <span>स्वास्थ्य लेख खोजें</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

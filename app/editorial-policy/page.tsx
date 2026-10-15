import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SITE_CONFIG } from '../../src/config/site-config';

export const metadata = {
  title: 'संपादकीय नीति (Editorial Policy)',
  description: 'हिंदी हेल्थ गाइड की संपादकीय और चिकित्सा समीक्षा नीति।',
};

export default function EditorialPolicyPage() {
  return (
    <div className="bg-stone-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-stone-200">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 text-sm font-semibold mb-6">
            <ArrowLeft className="w-4 h-4" /> मुख्य पृष्ठ पर लौटें
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900">संपादकीय नीति (Editorial Policy)</h1>
          <p className="text-stone-600 text-lg mt-2">हमारी प्रतिबद्धता: सटीकता, पारदर्शिता और वैज्ञानिक प्रमाण।</p>
        </div>

        <div className="prose prose-stone max-w-none space-y-6 text-stone-800 leading-relaxed">
          <h2>1. प्रमाण-आधारित सामग्री</h2>
          <p>
            {SITE_CONFIG.hindiName} पर प्रकाशित सभी लेख और मार्गदर्शिकाएं विश्व स्वास्थ्य संगठन (WHO), भारतीय आयुर्विज्ञान अनुसंधान परिषद (ICMR) और राष्ट्रीय स्वास्थ्य मिशन के वैज्ञानिक प्रमाणों पर आधारित हैं।
          </p>

          <h2>2. चिकित्सा समीक्षा (Medical Review)</h2>
          <p>
            प्रत्येक स्वास्थ्य लेख को प्रकाशित करने से पूर्व स्त्री रोग विशेषज्ञों, संक्रामक रोग विशेषज्ञों और लोक स्वास्थ्य विशेषज्ञों द्वारा बारीकी से जांचा और समीक्षित किया जाता है।
          </p>

          <h2>3. स्वतंत्रता और निष्पक्षता</h2>
          <p>
            हमारी सामग्री किसी भी व्यावसायिक दबाव या विज्ञापनदाता के प्रभाव से मुक्त है। हमारा एकमात्र उद्देश्य नागरिकों को सटीक और सुरक्षित स्वास्थ्य शिक्षा प्रदान करना है।
          </p>
        </div>
      </div>
    </div>
  );
}

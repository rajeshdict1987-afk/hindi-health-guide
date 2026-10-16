import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SITE_CONFIG } from '../../src/config/site-config';

export const metadata = {
  title: 'चिकित्सा अस्वीकरण (Medical Disclaimer) | हिंदी हेल्थ गाइड',
  description: 'हिंदी हेल्थ गाइड का आधिकारिक चिकित्सा अस्वीकरण।',
  alternates: {
    canonical: `${SITE_CONFIG.productionUrl}/medical-disclaimer`,
  },
};

export default function MedicalDisclaimerPage() {
  return (
    <div className="bg-stone-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-stone-200">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 text-sm font-semibold mb-6">
            <ArrowLeft className="w-4 h-4" /> मुख्य पृष्ठ पर लौटें
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900">चिकित्सा अस्वीकरण (Medical Disclaimer)</h1>
        </div>

        <div className="prose prose-stone max-w-none space-y-6 text-stone-800 leading-relaxed">
          <p>
            {SITE_CONFIG.hindiName} पर प्रदान की जाने वाली सभी जानकारी, सामग्रियां और एआई सहायक के उत्तर केवल सामान्य शैक्षिक और जागरूकता उद्देश्यों के लिए हैं।
          </p>
          <p>
            यह वेबसाइट पेशेवर चिकित्सीय निदान, उपचार या चिकित्सक की सलाह का विकल्प नहीं है। किसी भी स्वास्थ्य स्थिति या लक्षण के संबंध में अपने योग्य चिकित्सक से परामर्श अवश्य लें।
          </p>
          <p>
            आपातकालीन स्थिति में तुरंत निकटतम अस्पताल या राष्ट्रीय आपातकालीन नंबर (108/102) पर संपर्क करें।
          </p>
        </div>
      </div>
    </div>
  );
}

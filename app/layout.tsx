import type { Metadata } from 'next';
import React from 'react';
import './globals.css';
import { SITE_CONFIG } from '../src/config/site-config';
import { ClientLayout } from '../src/components/ClientLayout';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.productionUrl),
  title: {
    default: `${SITE_CONFIG.hindiName} – यौन एवं प्रजनन स्वास्थ्य की प्रामाणिक जानकारी`,
    template: `%s | ${SITE_CONFIG.hindiName}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    'यौन स्वास्थ्य',
    'प्रजनन स्वास्थ्य',
    'यौन शिक्षा',
    'safe sex hindi',
    'STI information hindi',
    'reproductive health in hindi',
    'मिथक और तथ्य',
    'हिंदी हेल्थ गाइड',
  ],
  authors: [{ name: 'Hindi Health Guide Medical Editorial Team' }],
  creator: 'Hindi Health Guide',
  publisher: 'Hindi Health Guide',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'hi_IN',
    url: SITE_CONFIG.productionUrl,
    siteName: SITE_CONFIG.hindiName,
    title: `${SITE_CONFIG.hindiName} – यौन एवं प्रजनन स्वास्थ्य की प्रामाणिक जानकारी`,
    description: SITE_CONFIG.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_CONFIG.hindiName} – यौन एवं प्रजनन स्वास्थ्य`,
    description: 'वैज्ञानिक तथ्यों और चिकित्सा दिशानिर्देशों (WHO/NACO/MoHFW) पर आधारित हिंदी स्वास्थ्य जानकारी।',
  },
};

const structuredSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_CONFIG.productionUrl}#organization`,
      name: 'Hindi Health Guide',
      alternateName: 'हिंदी हेल्थ गाइड',
      url: SITE_CONFIG.productionUrl,
      description: 'भारत में वैज्ञानिक, प्रमाण-आधारित यौन एवं प्रजनन स्वास्थ्य शिक्षा प्रदान करने वाला समर्पित हिंदी मंच।',
      publishingPrinciples: `${SITE_CONFIG.productionUrl}/editorial-policy`,
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_CONFIG.productionUrl}#website`,
      url: SITE_CONFIG.productionUrl,
      name: 'Hindi Health Guide',
      publisher: {
        '@id': `${SITE_CONFIG.productionUrl}#organization`,
      },
      inLanguage: 'hi-IN',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_CONFIG.productionUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi" dir="ltr">
      <body className="bg-stone-50 text-stone-900 antialiased font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredSchema) }}
        />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

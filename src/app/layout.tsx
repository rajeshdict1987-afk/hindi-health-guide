import type { Metadata } from 'next';
import React from 'react';
import '../index.css';
import { SITE_CONFIG } from '../config/site-config';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { RouterProvider } from '../context/RouterContext';

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
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Mukta:wght@300;400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': `${SITE_CONFIG.productionUrl}/#organization`,
                  name: SITE_CONFIG.name,
                  alternateName: SITE_CONFIG.hindiName,
                  url: SITE_CONFIG.productionUrl,
                  description: SITE_CONFIG.description,
                  publishingPrinciples: `${SITE_CONFIG.productionUrl}/editorial-policy`,
                },
                {
                  '@type': 'WebSite',
                  '@id': `${SITE_CONFIG.productionUrl}/#website`,
                  url: SITE_CONFIG.productionUrl,
                  name: SITE_CONFIG.name,
                  publisher: {
                    '@id': `${SITE_CONFIG.productionUrl}/#organization`,
                  },
                  inLanguage: 'hi-IN',
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: `${SITE_CONFIG.productionUrl}/search?q={search_term_string}`,
                    'query-input': 'required name=search_term_string',
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className="bg-stone-50 text-stone-900 antialiased font-['Mukta',sans-serif]">
        <RouterProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </RouterProvider>
      </body>
    </html>
  );
}

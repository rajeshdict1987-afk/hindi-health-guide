import type { Metadata, Viewport } from 'next';
import React from 'react';
import Script from 'next/script';
import './globals.css';
import { SITE_CONFIG } from '../src/config/site-config';
import { ClientLayout } from '../src/components/ClientLayout';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0f766e',
};

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
  authors: [{ name: 'राजेश कुमार साहू – मुख्य संपादक (Chief Editor)' }],
  creator: 'राजेश कुमार साहू',
  publisher: 'हिंदी हेल्थ गाइड (Hindi Health Guide)',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'hi_IN',
    url: 'https://www.hindihealthguide.org',
    siteName: 'हिंदी हेल्थ गाइड',
    title: `${SITE_CONFIG.hindiName} – यौन एवं प्रजनन स्वास्थ्य की प्रामाणिक जानकारी`,
    description: SITE_CONFIG.description,
    images: [
      {
        url: 'https://www.hindihealthguide.org/logo.png',
        width: 1200,
        height: 630,
        alt: 'हिंदी हेल्थ गाइड',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_CONFIG.hindiName} – यौन एवं प्रजनन स्वास्थ्य`,
    description: 'वैज्ञानिक तथ्यों और चिकित्सा दिशानिर्देशों (WHO/NACO/MoHFW) पर आधारित हिंदी स्वास्थ्य जानकारी।',
    images: ['https://www.hindihealthguide.org/logo.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon.png', sizes: '48x48', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'हिंदी हेल्थ गाइड',
  },
};

const structuredSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'MedicalOrganization',
      '@id': `${SITE_CONFIG.productionUrl}#organization`,
      name: 'Hindi Health Guide',
      alternateName: 'हिंदी हेल्थ गाइड',
      url: SITE_CONFIG.productionUrl,
      logo: `${SITE_CONFIG.productionUrl}/icon-512.png`,
      description: 'भारत में वैज्ञानिक, प्रमाण-आधारित यौन एवं प्रजनन स्वास्थ्य शिक्षा प्रदान करने वाला समर्पित हिंदी मंच। डब्ल्यूएचओ (WHO) और राष्ट्रीय एड्स नियंत्रण संगठन (NACO) के क्लिनिकल मानकों पर आधारित।',
      publishingPrinciples: `${SITE_CONFIG.productionUrl}/editorial-policy`,
      medicalSpecialty: [
        'Reproductive Health',
        'Sexual Health',
        'Public Health',
        'Infectious Disease Prevention'
      ],
      knowsAbout: [
        'यौन स्वास्थ्य (Sexual Health)',
        'प्रजनन स्वास्थ्य (Reproductive Health)',
        'एचआईवी एवं एसटीआई रोकथाम (HIV & STI Prevention)',
        'गर्भनिरोधक एवं परिवार नियोजन (Contraception & Family Planning)',
        'यौन शिक्षा एवं स्वास्थ्य मिथक (Sex Education & Health Myths)'
      ],
      founder: {
        '@type': 'Person',
        name: 'राजेश कुमार साहू',
        jobTitle: 'मुख्य संपादक (Chief Editor) एवं स्वास्थ्य विश्लेषक'
      }
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_CONFIG.productionUrl}#website`,
      url: SITE_CONFIG.productionUrl,
      name: 'हिंदी हेल्थ गाइड',
      alternateName: 'Hindi Health Guide',
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
      <head>
        <link rel="manifest" href="/manifest.json" />
        {/* Google Analytics Script (GA4) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-3BN6L8697T"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-3BN6L8697T');
          `}
        </Script>
        {/* Adsterra Social Bar (Unlimited Floating Ad) */}
        <Script
          src="https://bicea.org/14/e859f22ed91ad735ece6a60fc6c81e37"
          data-cfasync="false"
          strategy="lazyOnload"
        />
      </head>
      <body className="bg-stone-50 text-stone-900 antialiased font-sans">
        {/* Google Search Brand Display Name Schema (WebSite) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'हिंदी हेल्थ गाइड',
              alternateName: 'Hindi Health Guide',
              url: 'https://www.hindihealthguide.org',
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredSchema) }}
        />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

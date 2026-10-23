import type { Metadata, Viewport } from 'next';
import React from 'react';
import Script from 'next/script';
import { Noto_Sans_Devanagari } from 'next/font/google';
import './globals.css';
import { SITE_CONFIG } from '../src/config/site-config';
import { ClientLayout } from '../src/components/ClientLayout';

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari', 'latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-hindi',
});


export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0f766e',
};

function getSafeMetadataBase(): URL {
  try {
    const raw = SITE_CONFIG.productionUrl;
    if (raw && typeof raw === 'string') {
      const clean = raw.trim().replace(/^[\["'`]+|[\]"'`]+$/g, '');
      return new URL(clean.startsWith('http') ? clean : `https://${clean}`);
    }
  } catch {}
  return new URL('https://hindihealthguide.org');
}

export const metadata: Metadata = {
  metadataBase: getSafeMetadataBase(),

  title: {
    default: `${SITE_CONFIG.hindiName} – यौन एवं प्रजनन स्वास्थ्य की प्रामाणिक जानकारी`,
    template: `%s | ${SITE_CONFIG.hindiName}`,
  },
  description: SITE_CONFIG.description,
  applicationName: 'हिंदी हेल्थ गाइड',
  keywords: [
    'हिंदी',
    'हेल्थ',
    'गाइड',
    'हिंदी हेल्थ',
    'हेल्थ गाइड',
    'हिंदी हेल्थ गाइड',
    'Hindi',
    'Health',
    'Guide',
    'Hindi Health',
    'Health Guide',
    'Hindi Health Guide',
    'यौन स्वास्थ्य',
    'प्रजनन स्वास्थ्य',
    'यौन शिक्षा',
    'safe sex hindi',
    'STI information hindi',
    'reproductive health in hindi',
    'मिथक और तथ्य',
    'दरभंगा डिजिटल नेटवर्क',
    'राजेश कुमार साहू',
    'hindihealthguide',
    'hindihealthguide.org',
    'www.hindihealthguide.org',
  ],
  authors: [{ name: 'राजेश कुमार साहू – मुख्य संपादक (Chief Editor)' }],
  creator: 'राजेश कुमार साहू',
  publisher: 'हिंदी हेल्थ गाइड (Hindi Health Guide)',
  alternates: {
    canonical: 'https://www.hindihealthguide.org',
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
        alt: 'हिंदी हेल्थ गाइड - Hindi Health Guide',
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

// Google Search Central: WebSite structured data for Site Name
const googleWebSiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://www.hindihealthguide.org/#website',
  name: 'हिंदी हेल्थ गाइड',
  alternateName: [
    'Hindi Health Guide',
    'हिंदी हेल्थ गाइड - Hindi Health Guide',
    'हिंदी हेल्थ',
    'हेल्थ गाइड',
    'हिंदी',
    'हेल्थ',
    'गाइड',
    'HindiHealthGuide',
    'hindihealthguide.org',
    'www.hindihealthguide.org',
  ],
  url: 'https://www.hindihealthguide.org/',
  inLanguage: 'hi-IN',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://www.hindihealthguide.org/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

// Medical Organization & Publisher Schema
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'MedicalOrganization',
  '@id': 'https://www.hindihealthguide.org/#organization',
  name: 'हिंदी हेल्थ गाइड',
  alternateName: 'Hindi Health Guide',
  url: 'https://www.hindihealthguide.org/',
  logo: {
    '@type': 'ImageObject',
    url: 'https://www.hindihealthguide.org/brand-icon.png',
    width: 512,
    height: 512,
  },
  image: 'https://www.hindihealthguide.org/logo.png',
  description: 'भारत में वैज्ञानिक, प्रमाण-आधारित यौन एवं प्रजनन स्वास्थ्य शिक्षा प्रदान करने वाला समर्पित हिंदी मंच। डब्ल्यूएचओ (WHO) और राष्ट्रीय एड्स नियंत्रण संगठन (NACO) के क्लिनिकल मानकों पर आधारित।',
  publishingPrinciples: 'https://www.hindihealthguide.org/editorial-policy',
  medicalSpecialty: [
    'Reproductive Health',
    'Sexual Health',
    'Public Health',
    'Infectious Disease Prevention',
  ],
  knowsAbout: [
    'हिंदी हेल्थ गाइड (Hindi Health Guide)',
    'यौन स्वास्थ्य (Sexual Health)',
    'प्रजनन स्वास्थ्य (Reproductive Health)',
    'एचआईवी एवं एसटीआई रोकथाम (HIV & STI Prevention)',
    'गर्भनिरोधक एवं परिवार नियोजन (Contraception & Family Planning)',
    'यौन शिक्षा एवं स्वास्थ्य मिथक (Sex Education & Health Myths)',
  ],
  founder: {
    '@type': 'Person',
    name: 'राजेश कुमार साहू',
    jobTitle: 'मुख्य संपादक (Chief Editor) एवं स्वास्थ्य विश्लेषक',
  },
  parentOrganization: {
    '@type': 'Organization',
    name: 'दरभंगा डिजिटल नेटवर्क (Darbhanga Digital Network)',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi" dir="ltr" suppressHydrationWarning>

      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
        <link rel="shortcut icon" href="/favicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="application-name" content="हिंदी हेल्थ गाइड" />
        <meta name="apple-mobile-web-app-title" content="हिंदी हेल्थ गाइड" />
        <meta property="og:site_name" content="हिंदी हेल्थ गाइड" />
        <meta name="theme-color" content="#0f766e" />
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
      <body className={`${notoSansDevanagari.className} bg-stone-50 text-stone-900 antialiased font-sans`}>

        {/* Google Search Central WebSite Schema for Site Name */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(googleWebSiteSchema) }}
        />
        {/* Medical Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

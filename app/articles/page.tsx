import type { Metadata } from 'next';
import React from 'react';
import { HomePage } from '../../src/views/HomePage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'स्वास्थ्य आलेख सूची | हिंदी हेल्थ गाइड',
  description: 'यौन एवं प्रजनन स्वास्थ्य संबंधी सभी नवीनतम और प्रामाणिक आलेख।',
  alternates: {
    canonical: 'https://www.hindihealthguide.org/articles',
  },
  openGraph: {
    title: 'स्वास्थ्य आलेख सूची | हिंदी हेल्थ गाइड',
    description: 'यौन एवं प्रजनन स्वास्थ्य संबंधी सभी नवीनतम और प्रामाणिक आलेख।',
    url: 'https://www.hindihealthguide.org/articles',
    siteName: 'हिंदी हेल्थ गाइड',
    images: [
      {
        url: 'https://www.hindihealthguide.org/logo.png',
        width: 1200,
        height: 630,
        alt: 'हिंदी हेल्थ गाइड',
      },
    ],
    locale: 'hi_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'स्वास्थ्य आलेख सूची | हिंदी हेल्थ गाइड',
    description: 'यौन एवं प्रजनन स्वास्थ्य संबंधी सभी नवीनतम और प्रामाणिक आलेख।',
    images: ['https://www.hindihealthguide.org/logo.png'],
  },
};

export default function ArticlesPage() {
  return <HomePage />;
}

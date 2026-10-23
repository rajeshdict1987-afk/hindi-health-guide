import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'हिंदी हेल्थ गाइड',
    short_name: 'हिंदी हेल्थ',
    description: 'भारत में वैज्ञानिक, प्रमाण-आधारित योग एवं प्रजनन स्वास्थ्य शिक्षा प्रदान करने वाली समर्पित हिंदी मंश.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0F172A',
    orientation: 'portrait-primary',
    dir: 'ltr',
    lang: 'hi',
    scope: '/',
    categories: ['health', 'education', 'news'],
    icons: [
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable' as any,
      },
    ],
    shortcuts: [
      {
        name: 'होम पेज',
        url: '/',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
        ],
      },
    ],
    prefer_related_applications: false,
  };
}

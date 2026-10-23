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
    screenshots: [
      {
        src: '/icons/screenshot-1.png',
        sizes: '1080x1920',
        type: 'image/png',
        form_factor: 'narrow' as any,
        label: 'Home Screen of Hindi Health Guide',
      },
    ],
    shortcuts: [
      {
        name: 'होम पेज',
        url: '/',
        icons: [{ src: '/icons/icon-192x192.png', sizes: '192x192' }],
      },
    ],
    launch_handler: {
      client_mode: 'navigate-existing',
    },
    edge_side_panel: {
      preferred_width: 400,
    },
    prefer_related_applications: false,
    related_applications: [],
    iarc_rating_id: 'urn:content-rating:deriva.org:rating-system:1.0',
    file_handlers: [],
    protocol_handlers: [],
    widgets: [],
    note_taking: {
      new_note_url: '/',
    },
    scope_extensions: [
      {
        origin: 'https://hindilhealthguide.org',
      },
    ],
  } as MetadataRoute.Manifest;
}

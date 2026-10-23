import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/?source=pwa',
    name: 'हिंदी हेल्थ गाइड - Hindi Health Guide',
    short_name: 'हिंदी हेल्थ',
    description: 'भारत में वैज्ञानिक, प्रमाण-आधारित योग एवं प्रजनन स्वास्थ्य शिक्षा प्रदान करने वाली समर्पित हिंदी मंच।',
    lang: 'hi',
    dir: 'ltr',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    display_override: [
      'window-controls-overlay',
      'standalone',
      'browser',
    ] as any,
    orientation: 'portrait-primary',
    theme_color: '#0F172A',
    background_color: '#ffffff',
    categories: ['health', 'medical', 'education', 'lifestyle', 'news'],
    iarc_rating_id: 'e84b072d-71b3-4d3e-86ae-31a8ce4e53b7',
    prefer_related_applications: false,
    related_applications: [
      {
        platform: 'play',
        url: 'https://play.google.com/store/apps/details?id=org.hindihealthguide.twa',
        id: 'org.hindihealthguide.twa',
      },
    ],
    handle_links: 'preferred' as any,
    launch_handler: {
      client_mode: 'navigate-existing',
    } as any,
    edge_side_panel: {
      preferred_width: 400,
    } as any,
    file_handlers: [
      {
        action: '/share-target/',
        accept: {
          'text/plain': ['.txt'],
        },
      },
    ] as any,
    protocol_handlers: [
      {
        protocol: 'web+health',
        url: '/search?q=%s',
      },
    ] as any,
    share_target: {
      action: '/share-target/',
      method: 'GET',
      params: {
        title: 'title',
        text: 'text',
        url: 'url',
      },
    } as any,
    widgets: [
      {
        name: 'दैनिक स्वास्थ्य टिप्स',
        short_name: 'टिप्स',
        description: 'दैनिक प्रमाणित स्वास्थ्य सुझाव',
        tag: 'health_tip',
        template: 'health-widget',
        ms_ac_template: '/widget.json',
        data: '/api/articles',
        type: 'application/json',
        screenshots: [
          {
            src: '/screenshot-mobile.png',
            sizes: '750x1334',
            label: 'विजेट स्क्रीनशॉट',
          },
        ],
      },
    ] as any,
    note_taking: {
      new_note_url: '/note/new',
    } as any,
    scope_extensions: [
      {
        origin: 'https://hindihealthguide.org',
      },
    ] as any,
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any' as any,
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any' as any,
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable' as any,
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any' as any,
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable' as any,
      },
    ],
    screenshots: [
      {
        src: '/icons/screenshot-1.png',
        sizes: '750x1334',
        type: 'image/png',
        form_factor: 'narrow' as any,
        label: 'हिंदी हेल्थ गाइड - मोबाइल ऐप (Hindi Health Guide Mobile App)',
      },
      {
        src: '/icons/screenshot-2.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide' as any,
        label: 'हिंदी हेल्थ गाइड - डेस्कटॉप पोर्टल (Hindi Health Guide Desktop Portal)',
      },
    ],
    shortcuts: [
      {
        name: 'होम पेज',
        short_name: 'होम',
        url: '/',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
        ],
      },
      {
        name: 'स्वास्थ्य लेख व गाइड',
        short_name: 'लेख',
        url: '/#articles',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
        ],
      },
      {
        name: 'स्वास्थ्य श्रेणियां',
        short_name: 'श्रेणियां',
        url: '/#categories',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
        ],
      },
    ],
  } as MetadataRoute.Manifest;
}

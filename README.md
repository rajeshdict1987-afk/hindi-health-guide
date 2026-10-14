# Hindi Health Guide (हिंदी हेल्थ गाइड)

भारत का विश्वसनीय और आधुनिक हिंदी-प्रथम यौन स्वास्थ्य, प्रजनन स्वास्थ्य एवं यौन शिक्षा मंच (Sexual & Reproductive Health Education in Hindi).

## टेक स्टैक (Tech Stack)

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Motion

## प्रोजेक्ट संरचना (Project Structure)

```text
├── app/                      # Next.js App Router (Routes & Layouts)
│   ├── layout.tsx            # Global Root Layout
│   ├── page.tsx              # Home Page (/)
│   ├── globals.css           # Global Styles & Tailwind CSS
│   ├── about/                # हमारे बारे में (/about)
│   ├── articles/[slug]/      # Article Detail Pages (SSG)
│   ├── category/[slug]/      # Category Detail Pages (SSG)
│   ├── search/               # Search Page (/search)
│   ├── contact/              # Contact Us (/contact)
│   ├── editorial-policy/     # Editorial Policy (/editorial-policy)
│   ├── medical-disclaimer/   # Medical Disclaimer (/medical-disclaimer)
│   ├── privacy-policy/       # Privacy Policy (/privacy-policy)
│   ├── terms/                # Terms of Service (/terms)
│   ├── admin/                # Admin Portal (/admin, login, editor, media)
│   ├── robots.ts             # SEO robots.txt
│   ├── sitemap.ts            # XML Sitemap generator
│   └── not-found.tsx         # Custom 404 Handler
├── components/               # Reusable UI Components
├── config/                   # Site configuration & navigation
├── context/                  # Router & App contexts
├── data/                     # Verified health & medical articles data
├── services/                 # Article Service & Firebase integration
├── types/                    # TypeScript interfaces & types
└── views/                    # View presentation components
```

## Vercel पर डिप्लॉयमेंट (Vercel Deployment)

1. **Framework Preset**: Next.js (स्वचालित रूप से डिटेक्ट होता है)
2. **Build Command**: `npm run build`
3. **Output Directory**: `.next` (Next.js डिफ़ॉल्ट)
4. **Install Command**: `npm install`

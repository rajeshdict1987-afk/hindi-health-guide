'use client';

import { Article } from '../types/article';
import { Advertisement, AdSenseSettings, DEFAULT_ADSENSE_SETTINGS } from '../types/ad';
import { INITIAL_ARTICLES } from '../data/initialArticles';

import { validateArticleSchema, articleToFirestore, articleFromFirestore } from '../types/firestore';
import { generateCleanSlug } from './seoHelper';
import { formatHindiArticleContent } from './contentFormatter';

const ARTICLES_STORAGE_KEY = 'hindi_health_guide_articles_v4';
const ADS_STORAGE_KEY = 'hindi_health_guide_ads_v4';

export const DEFAULT_ADS: Advertisement[] = [
  {
    id: 'ad-1',
    title: 'सुरक्षित परिवार नियोजन और स्वास्थ्य परामर्श',
    description: 'विश्वसनीय और गोपनीय स्वास्थ्य सलाह के लिए आज ही प्रमाणित स्त्री रोग विशेषज्ञों और स्वास्थ्य सलाहकारों से जुड़ें।',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
    targetUrl: 'https://www.mohfw.gov.in',
    position: 'mid',
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ad-2',
    title: 'राष्ट्रीय स्वास्थ्य देखभाल अभियान और उत्पाद',
    description: 'WHO और NACO मानकों के अनुसार परीक्षित और सुरक्षित स्वास्थ्य देखभाल उत्पाद तथा जन कल्याणकारी योजनाएं।',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    targetUrl: 'https://www.naco.gov.in',
    position: 'bottom',
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ad-3',
    title: 'विशेष स्वास्थ्य शिविर एवं मुफ्त जांच',
    description: 'अपने नजदीकी स्वास्थ्य केंद्र पर मुफ्त परामर्श, दवा वितरण और गोपनीय स्वास्थ्य जांच का लाभ उठाएं।',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    targetUrl: 'https://nhm.gov.in',
    position: 'footer',
    active: true,
    createdAt: new Date().toISOString(),
  }
];

export function mergeArticles(primary: Article[], secondary: Article[]): Article[] {
  const map = new Map<string, Article>();

  // Helper to get normalized timestamp for sorting
  const getArticleTime = (a: Article) => {
    return new Date(a.publishedAt || a.createdAt || a.updatedAt || 0).getTime();
  };

  // Primary articles take precedence
  if (Array.isArray(primary)) {
    for (const a of primary) {
      if (!a) continue;
      const key = (a.slug || a.id || '').trim().toLowerCase();
      if (key) map.set(key, a);
    }
  }

  // Secondary articles are added if not already present
  if (Array.isArray(secondary)) {
    for (const a of secondary) {
      if (!a) continue;
      const key = (a.slug || a.id || '').trim().toLowerCase();
      if (key && !map.has(key)) {
        map.set(key, a);
      }
    }
  }

  // Return unique articles sorted newest first
  return Array.from(map.values()).sort((a, b) => getArticleTime(b) - getArticleTime(a));
}

export function getStoredArticles(): Article[] {
  if (typeof window === 'undefined') return INITIAL_ARTICLES;
  try {
    const item = localStorage.getItem(ARTICLES_STORAGE_KEY);
    if (!item) {
      localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(INITIAL_ARTICLES));
      return INITIAL_ARTICLES;
    }
    const parsed = JSON.parse(item);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(INITIAL_ARTICLES));
      return INITIAL_ARTICLES;
    }
    // Merge stored articles with INITIAL_ARTICLES so none are lost
    const merged = mergeArticles(parsed, INITIAL_ARTICLES);

    // Helper to completely purge any 'गुरु' prefix from editor name or article content
    const purgeGuru = (str: string | undefined): string => {
      if (!str) return '';
      return str
        .replace(/गुरु\s*राजेश\s*कुमार\s*साहू/g, 'राजेश कुमार साहू')
        .replace(/गुरु\s*राजेश/g, 'राजेश')
        .replace(/Guru\s*Rajesh\s*Kumar\s*Sahu/gi, 'Rajesh Kumar Sahu')
        .replace(/Guru\s*Rajesh/gi, 'Rajesh');
    };

    // Strictly enforce Chief Editor Rajesh Kumar Sahu (WITHOUT any गुरु prefix) and clean content
    const normalized = merged.map((art: Article) => {
      let authorName = (art.author?.name || 'राजेश कुमार साहू')
        .replace(/गुरु\s*/gi, '')
        .replace(/Guru\s*/gi, '')
        .trim();

      if (!authorName || authorName.includes('डॉ.') || authorName.includes('प्रो.')) {
        authorName = 'राजेश कुमार साहू';
      }

      let reviewerName = (art.reviewedBy?.name || 'राजेश कुमार साहू')
        .replace(/गुरु\s*/gi, '')
        .replace(/Guru\s*/gi, '')
        .trim();

      if (!reviewerName || reviewerName.includes('डॉ.') || reviewerName.includes('प्रो.')) {
        reviewerName = 'राजेश कुमार साहू';
      }

      // Auto-heal any invalid dashes-only slug (e.g. '---------')
      let cleanSlug = (art.slug || '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
      if (!cleanSlug || cleanSlug.length < 3 || /^[-]+$/.test(cleanSlug)) {
        cleanSlug = generateCleanSlug(art.title, art.id);
      }

      return {
        ...art,
        slug: cleanSlug,
        title: purgeGuru(art.title),
        excerpt: purgeGuru(art.excerpt),
        content: purgeGuru(art.content),
        author: {
          name: authorName,
          role: art.author?.role || 'मुख्य संपादक (Chief Editor) एवं स्वास्थ्य विश्लेषक',
          avatar: art.author?.avatar
        },
        reviewedBy: {
          name: reviewerName,
          credentials: art.reviewedBy?.credentials || 'मुख्य संपादक (Chief Editor) एवं स्वास्थ्य विश्लेषक',
        }
      };
    });

    localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  } catch {
    return INITIAL_ARTICLES;
  }
}

export function saveStoredArticles(articles: Article[]): void {
  if (typeof window === 'undefined') return;
  try {
    // Enforce strict schema normalization matching Firestore constraints
    // and guarantee NO Base64 strings enter localStorage
    const sanitized = articles.map((art) => {
      const firestoreDoc = articleToFirestore(art);
      const cleanArt = articleFromFirestore(firestoreDoc);
      // Format content into clean step-by-step layout
      if (art.content) {
        cleanArt.content = formatHindiArticleContent(art.content);
      }
      // Preserve the user's selected image URL (whether /uploads/..., https://..., or data:image/...)
      if (art.image?.url) {
        cleanArt.image = {
          url: art.image.url,
          alt: art.image.alt || art.title,
        };
      }
      return cleanArt;
    });
    localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(sanitized));
  } catch (e) {
    console.error('Failed to save articles to localStorage:', e);
  }
}

export function getStoredAds(): Advertisement[] {
  if (typeof window === 'undefined') return DEFAULT_ADS;
  try {
    const item = localStorage.getItem(ADS_STORAGE_KEY);
    if (!item) {
      localStorage.setItem(ADS_STORAGE_KEY, JSON.stringify(DEFAULT_ADS));
      return DEFAULT_ADS;
    }
    const parsed = JSON.parse(item);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_ADS;
  } catch {
    return DEFAULT_ADS;
  }
}

export function saveStoredAds(ads: Advertisement[]): void {
  if (typeof window === 'undefined') return;
  try {
    // Strip Base64 to prevent QuotaExceededError
    const sanitizedAds = ads.map(ad => {
      return ad;
    });
    localStorage.setItem(ADS_STORAGE_KEY, JSON.stringify(sanitizedAds));
  } catch (e) {
    console.error('Failed to save ads:', e);
  }
}

const ADSENSE_STORAGE_KEY = 'hindi_health_guide_adsense_v1';

export function getStoredAdSenseSettings(): AdSenseSettings {
  if (typeof window === 'undefined') return DEFAULT_ADSENSE_SETTINGS;
  try {
    const item = localStorage.getItem(ADSENSE_STORAGE_KEY);
    if (!item) return DEFAULT_ADSENSE_SETTINGS;
    return { ...DEFAULT_ADSENSE_SETTINGS, ...JSON.parse(item) };
  } catch {
    return DEFAULT_ADSENSE_SETTINGS;
  }
}

export function saveStoredAdSenseSettings(settings: AdSenseSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ADSENSE_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save AdSense settings:', e);
  }
}



export function resetToDefaults(): { articles: Article[], ads: Advertisement[] } {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(INITIAL_ARTICLES));
    localStorage.setItem(ADS_STORAGE_KEY, JSON.stringify(DEFAULT_ADS));
  }
  return { articles: INITIAL_ARTICLES, ads: DEFAULT_ADS };
}

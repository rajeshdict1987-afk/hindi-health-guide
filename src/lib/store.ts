'use client';

import { Article } from '../types/article';
import { Advertisement } from '../types/ad';
import { INITIAL_ARTICLES } from '../data/initialArticles';

const ARTICLES_STORAGE_KEY = 'hindi_health_guide_articles_v2';
const ADS_STORAGE_KEY = 'hindi_health_guide_ads_v2';

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

export function getStoredArticles(): Article[] {
  if (typeof window === 'undefined') return INITIAL_ARTICLES;
  try {
    const item = localStorage.getItem(ARTICLES_STORAGE_KEY);
    if (!item) {
      localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(INITIAL_ARTICLES));
      return INITIAL_ARTICLES;
    }
    const parsed = JSON.parse(item);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_ARTICLES;
  } catch {
    return INITIAL_ARTICLES;
  }
}

export function saveStoredArticles(articles: Article[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(articles));
  } catch (e) {
    console.error('Failed to save articles:', e);
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
    localStorage.setItem(ADS_STORAGE_KEY, JSON.stringify(ads));
  } catch (e) {
    console.error('Failed to save ads:', e);
  }
}

export function resetToDefaults(): { articles: Article[], ads: Advertisement[] } {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(INITIAL_ARTICLES));
    localStorage.setItem(ADS_STORAGE_KEY, JSON.stringify(DEFAULT_ADS));
  }
  return { articles: INITIAL_ARTICLES, ads: DEFAULT_ADS };
}

import { useEffect } from 'react';
import { SITE_CONFIG } from '../config/site-config';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article';
  publishedTime?: string;
  authorName?: string;
  imageUrl?: string;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonicalUrl,
  ogType = 'website',
  publishedTime,
  authorName,
  imageUrl,
  jsonLd,
}) => {
  useEffect(() => {
    // 1. Update Title
    const formattedTitle = title
      ? `${title} | ${SITE_CONFIG.hindiName}`
      : `${SITE_CONFIG.hindiName} – यौन एवं प्रजनन स्वास्थ्य की प्रामाणिक जानकारी`;
    document.title = formattedTitle;

    // 2. Update Meta Description
    const metaDesc = description || SITE_CONFIG.description;
    let descTag = document.querySelector('meta[name="description"]');
    if (!descTag) {
      descTag = document.createElement('meta');
      descTag.setAttribute('name', 'description');
      document.head.appendChild(descTag);
    }
    descTag.setAttribute('content', metaDesc);

    // 3. Update Canonical Link
    const fullCanonical = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : SITE_CONFIG.productionUrl);
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', fullCanonical);

    // 4. Update OpenGraph Tags
    const setMeta = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('og:title', formattedTitle);
    setMeta('og:description', metaDesc);
    setMeta('og:type', ogType);
    setMeta('og:url', fullCanonical);
    if (imageUrl) {
      setMeta('og:image', imageUrl);
    }
    if (ogType === 'article') {
      if (publishedTime) setMeta('article:published_time', publishedTime);
      if (authorName) setMeta('article:author', authorName);
    }

    // 5. Update JSON-LD structured data
    let dynamicJsonLd = document.getElementById('dynamic-jsonld');
    if (jsonLd) {
      if (!dynamicJsonLd) {
        dynamicJsonLd = document.createElement('script');
        dynamicJsonLd.id = 'dynamic-jsonld';
        dynamicJsonLd.setAttribute('type', 'application/ld+json');
        document.head.appendChild(dynamicJsonLd);
      }
      dynamicJsonLd.textContent = JSON.stringify(jsonLd);
    } else if (dynamicJsonLd) {
      dynamicJsonLd.remove();
    }
  }, [title, description, canonicalUrl, ogType, publishedTime, authorName, imageUrl, jsonLd]);

  return null;
};

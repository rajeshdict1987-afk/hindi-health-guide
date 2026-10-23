import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '../src/config/site-config';
import { getAllServerArticles } from '../src/lib/serverArticles';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.productionUrl;

  // 1. Static High-Priority Informational Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/editorial-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/medical-disclaimer`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // 2. The 7 Approved Health Categories
  const categoryRoutes: MetadataRoute.Sitemap = SITE_CONFIG.categories.map((c) => ({
    url: `${baseUrl}/category/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  // 3. Dynamic Slugs from Server Store & Firestore
  const articleMap = new Map<string, { slug: string; updatedAt: Date }>();

  // Add from persistent server store
  const serverArticles = getAllServerArticles();
  for (const art of serverArticles) {
    if (art.status === 'published' && art.slug) {
      articleMap.set(art.slug, {
        slug: art.slug,
        updatedAt: new Date(art.updatedAt || art.createdAt || Date.now()),
      });
    }
  }

  // Fetch dynamic slugs from Firestore
  try {
    const articlesCol = collection(db, 'articles');
    const q = query(articlesCol, limit(200));
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
      const data = doc.data();
      const slug = data.slug || doc.id;
      if (slug && data.status !== 'draft' && data.status !== 'archived') {
        const lastMod = data.updatedAt ? new Date(data.updatedAt) : new Date();
        articleMap.set(slug, {
          slug,
          updatedAt: isNaN(lastMod.getTime()) ? new Date() : lastMod,
        });
      }
    });
  } catch (err) {
    console.warn('Sitemap Firestore query note:', err);
  }

  const dynamicArticleRoutes: MetadataRoute.Sitemap = Array.from(articleMap.values()).map((item) => ({
    url: `${baseUrl}/articles/${item.slug}`,
    lastModified: item.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  return [...staticRoutes, ...categoryRoutes, ...dynamicArticleRoutes];
}

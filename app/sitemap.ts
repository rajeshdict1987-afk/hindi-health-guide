import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '../src/config/site-config';
import { getAllServerArticles } from '../src/lib/serverArticles';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.productionUrl;

  // 1. Static Pages
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

  // 2. The 7 Approved Categories
  const categoryRoutes: MetadataRoute.Sitemap = SITE_CONFIG.categories.map((c) => ({
    url: `${baseUrl}/category/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  // 3. Published Articles from Server Store & Initial Articles
  const allArticles = getAllServerArticles();
  const articleRoutes: MetadataRoute.Sitemap = allArticles.filter(
    (a) => a.status === 'published'
  ).map((a) => ({
    url: `${baseUrl}/articles/${a.slug}`,
    lastModified: new Date(a.updatedAt || a.createdAt || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  return [...staticRoutes, ...categoryRoutes, ...articleRoutes];
}

import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '../src/config/site-config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/admin/'],
      },
    ],
    sitemap: `${SITE_CONFIG.productionUrl}/sitemap.xml`,
    host: SITE_CONFIG.productionUrl,
  };
}

import { Article } from '../types/article';
import { SITE_CONFIG } from '../config/site-config';

export function extractFaqsFromContent(content: string): Array<{ question: string; answer: string }> {
  const faqs: Array<{ question: string; answer: string }> = [];
  if (!content) return faqs;

  // Detect FAQ-style content blocks in HTML content (e.g. h2/h3 followed by p)
  const headingRegex = /<h[234][^>]*>(.*?)<\/h[234]>\s*<p[^>]*>(.*?)<\/p>/gis;
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const qText = match[1].replace(/<[^>]*>/g, '').trim();
    const aText = match[2].replace(/<[^>]*>/g, '').trim();
    if (qText && aText && (qText.endsWith('?') || qText.includes('क्या') || qText.includes('कैसे') || qText.includes('क्यों') || qText.includes('कहाँ') || qText.includes('कब') || qText.includes('तथ्य') || qText.includes('मिथक'))) {
      faqs.push({ question: qText, answer: aText });
    }
  }

  return faqs;
}

export function generateFAQSchema(article: Article) {
  const faqsToUse = (article.faqs && article.faqs.length > 0)
    ? article.faqs
    : extractFaqsFromContent(article.content);

  if (!faqsToUse || faqsToUse.length === 0) return null;

  const articleUrl = `${SITE_CONFIG.productionUrl}/articles/${article.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${articleUrl}#faq`,
    'mainEntity': faqsToUse.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  };
}

export function generateArticleSchema(article: Article) {
  const articleUrl = `${SITE_CONFIG.productionUrl}/articles/${article.slug}`;
  
  const graph: any[] = [
    {
      '@type': 'Article',
      '@id': `${articleUrl}#article`,
      'headline': article.title,
      'description': article.excerpt,
      'image': article.image?.url || `${SITE_CONFIG.productionUrl}/icon.png`,
      'author': {
        '@type': 'Person',
        'name': article.author?.name || 'विशेषज्ञ',
      },
      'publisher': {
        '@type': 'Organization',
        'name': SITE_CONFIG.hindiName,
        'logo': {
          '@type': 'ImageObject',
          'url': `${SITE_CONFIG.productionUrl}/icon.png`
        }
      },
      'datePublished': article.publishedAt || article.createdAt,
      'dateModified': article.updatedAt || article.publishedAt || article.createdAt,
      'mainEntityOfPage': articleUrl
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${articleUrl}#breadcrumb`,
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'होम',
          'item': SITE_CONFIG.productionUrl
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': article.categoryHindi || article.category || 'स्वास्थ्य',
          'item': `${SITE_CONFIG.productionUrl}/category/${encodeURIComponent(article.category || '')}`
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': article.title,
          'item': articleUrl
        }
      ]
    }
  ];

  const faqSchema = generateFAQSchema(article);
  if (faqSchema) {
    graph.push(faqSchema);
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph
  };
}

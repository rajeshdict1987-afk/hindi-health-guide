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
      '@type': ['MedicalWebPage', 'Article'],
      '@id': `${articleUrl}#article`,
      'headline': article.title,
      'description': article.excerpt,
      'inLanguage': 'hi-IN',
      'image': article.image?.url || `${SITE_CONFIG.productionUrl}/icon.png`,
      'author': {
        '@type': 'Person',
        'name': article.author?.name || 'राजेश कुमार साहू',
        'jobTitle': 'मुख्य संपादक (Chief Editor)',
        'url': `${SITE_CONFIG.productionUrl}/about`
      },
      'editor': {
        '@type': 'Person',
        'name': 'राजेश कुमार साहू',
        'jobTitle': 'मुख्य संपादक (Chief Editor) एवं स्वास्थ्य विश्लेषक',
        'url': `${SITE_CONFIG.productionUrl}/about`
      },
      'reviewedBy': {
        '@type': 'Person',
        'name': article.reviewedBy?.name || 'राजेश कुमार साहू',
        'jobTitle': article.reviewedBy?.credentials || 'मुख्य संपादक एवं स्वास्थ्य विश्लेषक',
        'url': `${SITE_CONFIG.productionUrl}/about`
      },
      'medicalAudience': {
        '@type': 'MedicalAudience',
        'audienceType': 'Patient',
        'name': 'सामान्य जन एवं स्वास्थ्य पाठक'
      },
      'citation': [
        'World Health Organization (WHO) Reproductive & Sexual Health Guidelines',
        'National AIDS Control Organisation (NACO) Clinical Protocols India',
        'Ministry of Health and Family Welfare (MoHFW) Government of India'
      ],
      'disclaimer': 'यह सामग्री केवल शैक्षिक एवं जन-स्वास्थ्य जागरूकता उद्देश्यों हेतु है। किसी भी व्यक्तिगत चिकित्सा परामर्श के लिए पंजीकृत डॉक्टर से मिलें।',
      'publisher': {
        '@type': 'Organization',
        'name': SITE_CONFIG.hindiName,
        'url': SITE_CONFIG.productionUrl,
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

export function generateSeoSuggestions(title: string, content: string) {
  const plainText = (content || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const cleanTitle = (title || '').trim();

  // Generate meta description
  let metaDescription = plainText.slice(0, 150);
  if (plainText.length > 150) {
    metaDescription += '...';
  }
  if (!metaDescription && cleanTitle) {
    metaDescription = `${cleanTitle} की विस्तृत जानकारी, लक्षण, कारण और वैज्ञानिक उपाय हिंदी हेल्थ गाइड पर।`;
  }

  // Generate suggested tags/keywords based on title & common health keywords
  const defaultKeywords = ['स्वास्थ्य', 'चिकित्सा', 'प्रजनन स्वास्थ्य', 'यौन स्वास्थ्य', 'हिंदी हेल्थ गाइड'];
  const words = cleanTitle.split(/\s+/).filter(w => w.length > 3);
  const combined = Array.from(new Set([...words, ...defaultKeywords]));
  const tags = combined.slice(0, 6).join(', ');

  const slug = cleanTitle
    .toLowerCase()
    .replace(/[\s\t]+/g, '-')
    .replace(/[^\w-]/g, '');

  return {
    metaDescription,
    tags,
    slug
  };
}


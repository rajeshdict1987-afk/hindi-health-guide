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
        'name': (article.author?.name || 'राजेश कुमार साहू').replace(/गुरु\s*/gi, '').replace(/Guru\s*/gi, '').trim() || 'राजेश कुमार साहू',
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
        'name': (article.reviewedBy?.name || 'राजेश कुमार साहू').replace(/गुरु\s*/gi, '').replace(/Guru\s*/gi, '').trim() || 'राजेश कुमार साहू',
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

  // Generate clean URL slug without invalid dashes (e.g. preventing '---------')
  const slug = generateCleanSlug(cleanTitle);

  return {
    metaDescription,
    tags,
    slug
  };
}

/**
 * Robust slug generator for Hindi and English titles.
 * Maps Hindi health keywords to clean latin words or generates clean semantic article URLs.
 * Never outputs dashes only (e.g. '---------').
 */
export function generateCleanSlug(title: string, id?: string): string {
  if (!title) {
    const fallbackId = id ? String(id).slice(-6) : Date.now().toString().slice(-6);
    return `article-${fallbackId}`;
  }

  // 1. If title contains English/alphanumeric words, prioritize them
  const latinClean = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (latinClean.length >= 3 && /[a-z0-9]/.test(latinClean)) {
    return id ? `${latinClean}-${String(id).slice(-4)}` : latinClean;
  }

  // 2. Hindi health keywords dictionary for semantic SEO slugs
  const hindiToEnglishMap: Record<string, string> = {
    'स्वास्थ्य': 'health',
    'यौन': 'sexual',
    'प्रजनन': 'reproductive',
    'महिला': 'women',
    'महिलाएं': 'women',
    'पुरुष': 'men',
    'पुरुषों': 'men',
    'गर्भनिरोधक': 'contraception',
    'गर्भधारण': 'pregnancy',
    'पीरियड्स': 'periods',
    'मासिक': 'menstrual',
    'धर्म': 'cycle',
    'हार्मोन': 'hormone',
    'एचआईवी': 'hiv',
    'एड्स': 'aids',
    'संक्रमण': 'infection',
    'एसटीआई': 'sti',
    'लक्षण': 'symptoms',
    'उपाय': 'tips',
    'कारण': 'causes',
    'इलाज': 'treatment',
    'मिथक': 'myths',
    'तथ्य': 'facts',
    'स्पर्म': 'sperm',
    'क्वालिटी': 'quality',
    'फर्टिलिटी': 'fertility',
    'तनाव': 'stress',
    'सलाह': 'advice',
    'गाइड': 'guide',
    'सवाल': 'faq',
    'जवाब': 'qa',
  };

  const words = title.split(/[\s,।!?|_\-–—]+/).filter(Boolean);
  const matchedTokens: string[] = [];

  for (const w of words) {
    const trimmed = w.trim();
    if (hindiToEnglishMap[trimmed]) {
      matchedTokens.push(hindiToEnglishMap[trimmed]);
    } else {
      const engOnly = trimmed.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (engOnly) matchedTokens.push(engOnly);
    }
  }

  const uniqueSuffix = id ? String(id).slice(-6) : Date.now().toString().slice(-6);
  const baseSlug = matchedTokens.slice(0, 5).join('-');

  if (baseSlug && baseSlug.length >= 3) {
    return `${baseSlug}-${uniqueSuffix}`;
  }

  return `article-${uniqueSuffix}`;
}



import { Article } from './article';

/**
 * ==============================================================================
 * FIRESTORE SCHEMA INTERFACES
 * Strictly mirroring firestore.rules and firebase-blueprint.json constraints.
 * ==============================================================================
 */

export type ArticleStatus = 'draft' | 'published' | 'archived';
export type UserRole = 'reader' | 'editor' | 'admin';

export interface FirestoreArticleDoc {
  id: string;
  title: string;
  slug: string;
  quickAnswer?: string;
  excerpt: string;
  content: string;
  categorySlug: string;
  categoryHindi?: string;
  status: ArticleStatus;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  authorId?: string;
  readingTimeMinutes?: number;
  readTime?: string;
  featured?: boolean;
  viewsCount?: number;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  image?: {
    url: string;
    alt: string;
  };
  seo?: {
    title: string;
    metaDescription: string;
    keywords: string[];
  };
  tags?: string[];
  reviewedBy?: {
    name: string;
    credentials: string;
  };
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
}

export interface FirestoreCategoryDoc {
  id: string;
  name: string;
  slug: string;
  description: string;
  featuredOrder?: number;
  hindiName?: string;
}

export interface FirestoreEditorialReviewDoc {
  articleId: string;
  isReviewed: boolean;
  reviewerName: string;
  reviewerRole: string;
  reviewerRegistration?: string;
  reviewedDate: string;
  reviewNotes?: string;
}

export interface FirestoreUserDoc {
  uid: string;
  email: string;
  role: UserRole;
  displayName?: string;
  createdAt?: string;
}

export interface FirestoreSiteSettingDoc {
  key: string;
  value: string;
  updatedAt?: string;
}

/**
 * Type Guard: Validates that a raw object conforms to FirestoreArticleDoc schema
 */
export function isFirestoreArticleDoc(obj: unknown): obj is FirestoreArticleDoc {
  if (!obj || typeof obj !== 'object') return false;
  const doc = obj as Record<string, unknown>;

  const hasRequiredFields =
    typeof doc.id === 'string' &&
    typeof doc.title === 'string' &&
    typeof doc.slug === 'string' &&
    typeof doc.excerpt === 'string' &&
    typeof doc.content === 'string' &&
    typeof doc.categorySlug === 'string' &&
    ['draft', 'published', 'archived'].includes(doc.status as string) &&
    typeof doc.createdAt === 'string' &&
    typeof doc.updatedAt === 'string';

  if (!hasRequiredFields) return false;

  // Verify author structure
  if (!doc.author || typeof doc.author !== 'object') return false;
  const author = doc.author as Record<string, unknown>;
  return typeof author.name === 'string' && typeof author.role === 'string';
}

/**
 * Validation Helper: Returns comprehensive list of validation issues
 * matching firestore.rules validation primitive isValidArticle(data).
 */
export function validateArticleSchema(data: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['डाटा एक ऑब्जेक्ट होना चाहिए (Data must be an object)'] };
  }

  const art = data as Record<string, unknown>;

  if (typeof art.id !== 'string' || art.id.length === 0 || art.id.length > 128) {
    errors.push('id must be a string between 1 and 128 characters');
  }
  if (typeof art.title !== 'string' || art.title.length < 5 || art.title.length > 300) {
    errors.push('title must be between 5 and 300 characters');
  }
  if (typeof art.slug !== 'string' || !/^(?=.*[a-z0-9])[a-z0-9-]+$/.test(art.slug) || art.slug.length < 3 || art.slug.length > 160) {
    errors.push('slug must be lowercase alphanumeric with hyphens between 3 and 160 characters');
  }
  if (typeof art.excerpt !== 'string' || art.excerpt.length > 600) {
    errors.push('excerpt must be a string with maximum 600 characters');
  }
  if (typeof art.content !== 'string' || art.content.length < 50 || art.content.length > 50000) {
    errors.push('content must be between 50 and 50,000 characters');
  }
  if (typeof art.categorySlug !== 'string' && typeof art.category !== 'string') {
    errors.push('categorySlug/category must be specified');
  }
  if (!['draft', 'published', 'archived'].includes(art.status as string)) {
    errors.push("status must be 'draft', 'published', or 'archived'");
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Bidirectional Converter: Transforms client-side Article to Firestore-compliant document
 */
export function articleToFirestore(article: Article): FirestoreArticleDoc {
  const now = new Date().toISOString();
  
  // Parse reading time in minutes
  const readingTimeMinutes = parseInt(article.readTime?.replace(/\D/g, '') || '5', 10);

  const cleanSlug = (() => {
    const s = (article.slug || '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
    return (s && s.length >= 3 && !/^[-]+$/.test(s)) ? s : `article-${article.id || Date.now().toString().slice(-6)}`;
  })();

  return {
    id: article.id,
    title: article.title.trim(),
    slug: cleanSlug,
    excerpt: article.excerpt.trim(),
    content: article.content.trim(),
    categorySlug: article.category.trim(),
    categoryHindi: article.categoryHindi || '',
    status: (article.status as ArticleStatus) || 'published',
    createdAt: article.createdAt || now,
    updatedAt: article.updatedAt || now,
    publishedAt: article.publishedAt || article.createdAt || now,
    readTime: article.readTime || `${readingTimeMinutes} मिनट`,
    readingTimeMinutes,
    author: {
      name: (article.author?.name || 'राजेश कुमार साहू')
        .replace(/गुरु\s*/gi, '')
        .replace(/Guru\s*/gi, '')
        .trim() || 'राजेश कुमार साहू',
      role: article.author?.role || 'मुख्य संपादक (Chief Editor) एवं स्वास्थ्य विश्लेषक',
      avatar: article.author?.avatar || ''
    },
    image: article.image ? {
      url: article.image.url,
      alt: article.image.alt || article.title
    } : undefined,
    seo: article.seo ? {
      title: article.seo.title,
      metaDescription: article.seo.metaDescription,
      keywords: article.seo.keywords || []
    } : undefined,
    tags: article.tags || [],
    reviewedBy: article.reviewedBy ? {
      name: article.reviewedBy.name,
      credentials: article.reviewedBy.credentials
    } : undefined,
    faqs: article.faqs || []
  };
}

/**
 * Bidirectional Converter: Transforms Firestore document back to client-side Article
 */
export function articleFromFirestore(doc: FirestoreArticleDoc | Record<string, unknown>): Article {
  const readTimeStr = typeof doc.readTime === 'string'
    ? doc.readTime
    : typeof doc.readingTimeMinutes === 'number'
      ? `${doc.readingTimeMinutes} मिनट`
      : '5 मिनट';

  const authorObj = (doc.author && typeof doc.author === 'object') ? (doc.author as Record<string, string>) : {};
  const imageObj = (doc.image && typeof doc.image === 'object') ? (doc.image as Record<string, string>) : {};
  const seoObj = (doc.seo && typeof doc.seo === 'object') ? (doc.seo as Record<string, any>) : {};

  return {
    id: String(doc.id || ''),
    title: String(doc.title || ''),
    slug: (() => {
      const s = String(doc.slug || '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
      return (s && s.length >= 3 && !/^[-]+$/.test(s)) ? s : `article-${doc.id || 'entry'}`;
    })(),
    excerpt: String(doc.excerpt || ''),
    content: String(doc.content || ''),
    category: String(doc.categorySlug || ('category' in doc ? (doc as Record<string, unknown>).category : '') || 'reproductive-health'),
    categoryHindi: String(doc.categoryHindi || 'प्रजनन स्वास्थ्य'),
    readTime: readTimeStr,
    publishedAt: String(doc.publishedAt || doc.createdAt || new Date().toISOString()),
    createdAt: String(doc.createdAt || new Date().toISOString()),
    updatedAt: typeof doc.updatedAt === 'string' ? doc.updatedAt : undefined,
    status: (doc.status === 'draft' ? 'draft' : 'published'),
    author: {
      name: (authorObj.name || 'राजेश कुमार साहू')
        .replace(/गुरु\s*/gi, '')
        .replace(/Guru\s*/gi, '')
        .trim() || 'राजेश कुमार साहू',
      role: authorObj.role || 'मुख्य संपादक (Chief Editor) एवं स्वास्थ्य विश्लेषक',
      avatar: authorObj.avatar
    },
    image: {
      url: imageObj.url || 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
      alt: imageObj.alt || String(doc.title || '')
    },
    seo: {
      title: seoObj.title || String(doc.title || ''),
      metaDescription: seoObj.metaDescription || String(doc.excerpt || ''),
      keywords: Array.isArray(seoObj.keywords) ? seoObj.keywords : []
    },
    tags: Array.isArray(doc.tags) ? doc.tags : [],
    reviewedBy: doc.reviewedBy && typeof doc.reviewedBy === 'object' ? {
      name: ((doc.reviewedBy as any).name || 'राजेश कुमार साहू')
        .replace(/गुरु\s*/gi, '')
        .replace(/Guru\s*/gi, '')
        .trim() || 'राजेश कुमार साहू',
      credentials: (doc.reviewedBy as any).credentials || 'मुख्य संपादक (Chief Editor) एवं स्वास्थ्य विश्लेषक'
    } : undefined,
    faqs: Array.isArray(doc.faqs) ? doc.faqs : []
  };
}

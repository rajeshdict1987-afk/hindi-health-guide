import fs from 'fs';
import path from 'path';
import { Article } from '../types/article';
import { INITIAL_ARTICLES } from '../data/initialArticles';
import { generateCleanSlug } from './seoHelper';
import { formatHindiArticleContent } from './contentFormatter';

const STORE_PATH = path.join(process.cwd(), 'src/data/articles-store.json');

// Purge any 'गुरु' prefix from text
export const purgeGuru = (str: string | undefined): string => {
  if (!str) return '';
  return str
    .replace(/गुरु\s*राजेश\s*कुमार\s*साहू/g, 'राजेश कुमार साहू')
    .replace(/गुरु\s*राजेश/g, 'राजेश')
    .replace(/Guru\s*Rajesh\s*Kumar\s*Sahu/gi, 'Rajesh Kumar Sahu')
    .replace(/Guru\s*Rajesh/gi, 'Rajesh');
};

export const sanitizeArticle = (art: Article): Article => {
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

  let cleanSlug = (art.slug || '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
  if (!cleanSlug || cleanSlug.length < 3 || /^[-]+$/.test(cleanSlug)) {
    cleanSlug = generateCleanSlug(art.title, art.id);
  }

  return {
    ...art,
    slug: cleanSlug,
    title: purgeGuru(art.title),
    excerpt: purgeGuru(art.excerpt),
    content: formatHindiArticleContent(purgeGuru(art.content)),
    author: {
      name: authorName,
      role: art.author?.role || 'मुख्य संपादक (Chief Editor) एवं स्वास्थ्य विश्लेषक',
      avatar: art.author?.avatar,
    },
    reviewedBy: {
      name: reviewerName,
      credentials: art.reviewedBy?.credentials || 'मुख्य संपादक (Chief Editor) एवं स्वास्थ्य विश्लेषक',
    },
  };
};

export function getAllServerArticles(): Article[] {
  try {
    if (!fs.existsSync(STORE_PATH)) {
      fs.writeFileSync(STORE_PATH, JSON.stringify(INITIAL_ARTICLES, null, 2), 'utf-8');
      return INITIAL_ARTICLES.map(sanitizeArticle);
    }
    const raw = fs.readFileSync(STORE_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return INITIAL_ARTICLES.map(sanitizeArticle);
    }
    return parsed.map(sanitizeArticle);
  } catch (e) {
    console.error('Error reading server articles store:', e);
    return INITIAL_ARTICLES.map(sanitizeArticle);
  }
}

export function getServerArticleBySlug(slugOrId: string): Article | undefined {
  if (!slugOrId) return undefined;
  const articles = getAllServerArticles();
  const decoded = decodeURIComponent(slugOrId).trim().toLowerCase();
  const normalizedTarget = decoded.replace(/-+/g, '-').replace(/^-+|-+$/g, '');

  let found = articles.find(
    (a) => a.slug === slugOrId || a.slug === decoded || a.id === slugOrId
  );

  if (!found) {
    found = articles.find((a) => {
      const aNorm = a.slug.replace(/-+/g, '-').replace(/^-+|-+$/g, '');
      return aNorm === normalizedTarget || a.slug.includes(normalizedTarget) || normalizedTarget.includes(a.slug);
    });
  }

  return found;
}

export function saveServerArticle(article: Article): Article[] {
  const sanitized = sanitizeArticle(article);
  const current = getAllServerArticles();
  const index = current.findIndex((a) => a.id === sanitized.id || a.slug === sanitized.slug);

  let updated: Article[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = sanitized;
  } else {
    updated = [sanitized, ...current];
  }

  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(updated, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write to server articles store:', e);
  }

  return updated;
}

export function deleteServerArticle(idOrSlug: string): Article[] {
  const current = getAllServerArticles();
  const updated = current.filter((a) => a.id !== idOrSlug && a.slug !== idOrSlug);
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(updated, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write after delete to server articles store:', e);
  }
  return updated;
}

export function syncServerArticles(clientArticles: Article[]): Article[] {
  if (!Array.isArray(clientArticles) || clientArticles.length === 0) {
    return getAllServerArticles();
  }

  const current = getAllServerArticles();
  const articleMap = new Map<string, Article>();

  // Place current server articles first
  current.forEach((a) => {
    articleMap.set(a.slug, a);
    articleMap.set(a.id, a);
  });

  let hasNew = false;
  // Merge client articles
  clientArticles.forEach((clientArt) => {
    const sanitized = sanitizeArticle(clientArt);
    if (!articleMap.has(sanitized.slug) && !articleMap.has(sanitized.id)) {
      current.unshift(sanitized);
      articleMap.set(sanitized.slug, sanitized);
      articleMap.set(sanitized.id, sanitized);
      hasNew = true;
    }
  });

  if (hasNew) {
    try {
      fs.writeFileSync(STORE_PATH, JSON.stringify(current, null, 2), 'utf-8');
      console.log('Successfully synced new client articles into server store. Total:', current.length);
    } catch (e) {
      console.error('Failed to write synced articles to server store:', e);
    }
  }

  return current;
}

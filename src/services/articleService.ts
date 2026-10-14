/**
 * Article Management Service for Hindi Health Guide
 * Provides robust CRUD, searching, filtering, and local/cloud persistence.
 */

import { INITIAL_ARTICLES } from '../data/initialArticles';
import { Article, ArticleFilterOptions, ArticleStatus } from '../types/article';

const STORAGE_KEY = 'hhg_articles_v1';

export class ArticleService {
  private static instance: ArticleService;
  private memoryArticles: Article[] = [];

  private constructor() {
    this.initStorage();
  }

  public static getInstance(): ArticleService {
    if (!ArticleService.instance) {
      ArticleService.instance = new ArticleService();
    }
    return ArticleService.instance;
  }

  private initStorage(): void {
    if (typeof window === 'undefined') {
      this.memoryArticles = [...INITIAL_ARTICLES];
      return;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.memoryArticles = parsed;
          return;
        }
      }
      // Seed initial authentic articles
      this.memoryArticles = [...INITIAL_ARTICLES];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.memoryArticles));
    } catch (e) {
      console.warn('LocalStorage unavailable, using in-memory articles:', e);
      this.memoryArticles = [...INITIAL_ARTICLES];
    }
  }

  private persist(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.memoryArticles));
      } catch (e) {
        console.error('Failed to persist articles:', e);
      }
    }
  }

  /**
   * Fetch articles with flexible filtering and sorting
   */
  public getArticles(options: ArticleFilterOptions = {}): { articles: Article[]; total: number } {
    let result = [...this.memoryArticles];

    // Filter by status (default to only published for public, unless specified)
    if (options.status) {
      result = result.filter((a) => a.status === options.status);
    } else {
      result = result.filter((a) => a.status === 'published');
    }

    // Filter by category
    if (options.categorySlug) {
      if (options.categorySlug === 'medically-reviewed-articles') {
        result = result.filter((a) => a.medicalReview && a.medicalReview.isReviewed);
      } else {
        result = result.filter((a) => a.categorySlug === options.categorySlug);
      }
    }

    // Filter medically reviewed only
    if (options.medicallyReviewedOnly) {
      result = result.filter((a) => a.medicalReview && a.medicalReview.isReviewed);
    }

    // Filter featured only
    if (options.featuredOnly) {
      result = result.filter((a) => a.featured);
    }

    // Text search query across title, excerpt, quick answer, content, and keywords
    if (options.searchQuery && options.searchQuery.trim().length > 0) {
      const q = options.searchQuery.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          (a.quickAnswer && a.quickAnswer.toLowerCase().includes(q)) ||
          a.content.toLowerCase().includes(q) ||
          a.seo.keywords.some((k) => k.toLowerCase().includes(q))
      );
    }

    // Sort by published date descending, fallback to createdAt
    result.sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.createdAt).getTime();
      const dateB = new Date(b.publishedAt || b.createdAt).getTime();
      return dateB - dateA;
    });

    return {
      articles: result,
      total: result.length,
    };
  }

  /**
   * Get single article by slug
   */
  public getArticleBySlug(slug: string, includeUnpublished = false): Article | null {
    const article = this.memoryArticles.find((a) => a.slug === slug);
    if (!article) return null;

    if (!includeUnpublished && article.status !== 'published') {
      return null;
    }
    return article;
  }

  /**
   * Get single article by ID
   */
  public getArticleById(id: string): Article | null {
    return this.memoryArticles.find((a) => a.id === id) || null;
  }

  /**
   * Get related articles from the same category or general reviewed list
   */
  public getRelatedArticles(currentSlug: string, categorySlug: string, limit = 3): Article[] {
    return this.memoryArticles
      .filter((a) => a.status === 'published' && a.slug !== currentSlug)
      .sort((a, b) => {
        // Boost same category
        const scoreA = a.categorySlug === categorySlug ? 2 : 0 + (a.medicalReview?.isReviewed ? 1 : 0);
        const scoreB = b.categorySlug === categorySlug ? 2 : 0 + (b.medicalReview?.isReviewed ? 1 : 0);
        return scoreB - scoreA;
      })
      .slice(0, limit);
  }

  /**
   * Increment view counter safely
   */
  public incrementViews(id: string): void {
    const article = this.getArticleById(id);
    if (article) {
      article.viewsCount = (article.viewsCount || 0) + 1;
      this.persist();
    }
  }

  /**
   * Create new article (Admin)
   */
  public createArticle(data: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>): Article {
    const now = new Date().toISOString();
    const newId = `art-${Date.now()}`;
    const slug = data.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-');

    const newArticle: Article = {
      ...data,
      id: newId,
      slug,
      createdAt: now,
      updatedAt: now,
      viewsCount: 0,
      publishedAt: data.status === 'published' ? (data.publishedAt || now) : undefined,
    };

    this.memoryArticles.unshift(newArticle);
    this.persist();
    return newArticle;
  }

  /**
   * Update existing article (Admin)
   */
  public updateArticle(id: string, updates: Partial<Article>): Article {
    const index = this.memoryArticles.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new Error(`लेख ID ${id} नहीं मिला।`);
    }

    const existing = this.memoryArticles[index];
    const now = new Date().toISOString();

    const updated: Article = {
      ...existing,
      ...updates,
      id: existing.id, // Immutable
      createdAt: existing.createdAt, // Immutable
      updatedAt: now,
      publishedAt:
        updates.status === 'published' && !existing.publishedAt
          ? now
          : updates.publishedAt || existing.publishedAt,
    };

    if (updates.slug) {
      updated.slug = updates.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-');
    }

    this.memoryArticles[index] = updated;
    this.persist();
    return updated;
  }

  /**
   * Delete article (Admin)
   */
  public deleteArticle(id: string): boolean {
    const initialLength = this.memoryArticles.length;
    this.memoryArticles = this.memoryArticles.filter((a) => a.id !== id);
    if (this.memoryArticles.length !== initialLength) {
      this.persist();
      return true;
    }
    return false;
  }

  /**
   * Reset to initial authentic seed data
   */
  public resetToDefault(): void {
    this.memoryArticles = [...INITIAL_ARTICLES];
    this.persist();
  }

  /**
   * Category article counts
   */
  public getCategoryCounts(): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const a of this.memoryArticles) {
      if (a.status === 'published') {
        counts[a.categorySlug] = (counts[a.categorySlug] || 0) + 1;
        if (a.medicalReview?.isReviewed) {
          counts['medically-reviewed-articles'] = (counts['medically-reviewed-articles'] || 0) + 1;
        }
      }
    }
    return counts;
  }
}

export const articleService = ArticleService.getInstance();

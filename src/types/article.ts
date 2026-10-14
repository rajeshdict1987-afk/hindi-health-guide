/**
 * Article Data Models and Types for Hindi Health Guide
 */

export type ArticleStatus = 'draft' | 'published' | 'archived';

export interface Author {
  id: string;
  name: string;
  hindiTitle: string;
  bio: string;
  avatarUrl?: string;
}

export interface MedicalReview {
  isReviewed: boolean;
  reviewerName?: string;
  reviewerRole?: string; // e.g., 'MBBS, MS (OB-GYN)', 'MD (Dermatology & Venereology)'
  reviewerRegistration?: string; // e.g., 'NMC Reg. No. 54321 / DMC'
  reviewedDate?: string;
  reviewNotes?: string;
}

export interface ArticleReference {
  title: string;
  organization: string; // e.g., 'विश्व स्वास्थ्य संगठन (WHO)', 'NACO (भारत सरकार)', 'ICMR'
  url: string;
  accessDate?: string;
}

export interface ArticleImage {
  url: string;
  alt: string;
  caption?: string;
  credit?: string;
}

export interface ArticleSEO {
  title: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl?: string;
}

export interface ArticleFAQ {
  question: string;
  answer: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  quickAnswer?: string; // सीधा उत्तर - key summary answering core reader query immediately
  excerpt: string;
  content: string; // structured markdown or formatted content
  categorySlug: string; // Must match one of the 7 site categories
  status: ArticleStatus;
  author: Author;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  image: ArticleImage;
  seo: ArticleSEO;
  references: ArticleReference[];
  medicalReview: MedicalReview;
  readingTimeMinutes: number;
  featured?: boolean;
  viewsCount?: number;
  faqs?: ArticleFAQ[];
}

export interface ArticleFilterOptions {
  categorySlug?: string;
  searchQuery?: string;
  status?: ArticleStatus;
  medicallyReviewedOnly?: boolean;
  featuredOnly?: boolean;
}

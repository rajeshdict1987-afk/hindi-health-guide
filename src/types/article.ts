export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  categoryHindi: string;
  readTime: string;
  publishedAt: string;
  updatedAt?: string;
  createdAt: string;
  status: 'published' | 'draft';
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  image: {
    url: string;
    alt: string;
  };
  seo: {
    title: string;
    metaDescription: string;
    keywords: string[];
  };
  tags: string[];
  reviewedBy?: {
    name: string;
    credentials: string;
  };
}

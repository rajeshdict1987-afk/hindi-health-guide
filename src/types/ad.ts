export interface Advertisement {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  targetUrl: string;
  position: 'footer' | 'bottom' | 'mid' | 'article-sidebar' | 'article-inline';
  active: boolean;
  createdAt: string;
}

export interface Advertisement {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  targetUrl: string;
  position: 'footer' | 'bottom' | 'mid' | 'article-sidebar' | 'article-inline' | 'header';
  active: boolean;
  createdAt: string;
}

export interface AdSenseSettings {
  adSenseClientId: string; // e.g. ca-pub-XXXXXXXXXXXXXXXX
  adSenseEnabled: boolean;
  headerSlot: string;
  inArticleSlot: string;
  sidebarSlot: string;
  customHeaderCode?: string;
  customInArticleCode?: string;
  customSidebarCode?: string;
}

export const DEFAULT_ADSENSE_SETTINGS: AdSenseSettings = {
  adSenseClientId: 'ca-pub-1234567890123456',
  adSenseEnabled: false,
  headerSlot: '',
  inArticleSlot: '',
  sidebarSlot: '',
  customHeaderCode: '',
  customInArticleCode: '',
  customSidebarCode: '',
};

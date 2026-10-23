/**
 * ==============================================================================
 * SECURE ENVIRONMENT VARIABLES & RUNTIME CONFIGURATION
 * Provides strongly typed, safe fallbacks without exposing secrets to the client.
 * ==============================================================================
 */

function sanitizeUrl(rawUrl?: string): string {
  const FALLBACK_URL = 'https://hindihealthguide.org';
  if (!rawUrl || typeof rawUrl !== 'string') {
    return FALLBACK_URL;
  }
  let trimmed = rawUrl.trim();

  // If passed markdown link e.g. [https://yourdomain.com](https://yourdomain.com) or [text](url)
  const markdownMatch = trimmed.match(/\((https?:\/\/[^\s)]+)\)/);
  if (markdownMatch && markdownMatch[1]) {
    trimmed = markdownMatch[1];
  }

  // Strip brackets, quotes, backticks
  trimmed = trimmed.replace(/^[\["'`]+|[\]"'`]+$/g, '').trim();

  // Reject placeholder domains
  if (
    trimmed.includes('yourdomain.com') ||
    trimmed.includes('example.com') ||
    trimmed === '' ||
    trimmed === 'undefined' ||
    trimmed === 'null'
  ) {
    return FALLBACK_URL;
  }

  if (trimmed.startsWith('http://')) {
    trimmed = `https://${trimmed.slice(7)}`;
  } else if (!trimmed.startsWith('https://')) {
    trimmed = `https://${trimmed}`;
  }

  trimmed = trimmed.replace(/\/+$/, '');

  try {
    const parsed = new URL(trimmed);
    return parsed.origin;
  } catch {
    return FALLBACK_URL;
  }
}

export const ENV = {
  /**
   * Primary canonical custom production URL:
   * Pointing strictly to official domain: https://hindihealthguide.org
   */
  productionUrl: sanitizeUrl(process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL),



  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',

  /**
   * Server-Side Gemini API Key Reader
   * Safe getter prevents accidental client-side leakage.
   */
  getGeminiApiKey(): string | undefined {
    if (typeof window !== 'undefined') {
      console.warn('Security Warning: Attempted to access GEMINI_API_KEY from browser context.');
      return undefined;
    }
    return process.env.GEMINI_API_KEY?.trim() || undefined;
  },

  /**
   * Firebase Client Configuration (Optional Cloud Sync)
   */
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
    firestoreDatabaseId: process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_DATABASE_ID || '(default)'
  }
};

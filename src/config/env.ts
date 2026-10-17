/**
 * ==============================================================================
 * SECURE ENVIRONMENT VARIABLES & RUNTIME CONFIGURATION
 * Provides strongly typed, safe fallbacks without exposing secrets to the client.
 * ==============================================================================
 */

function sanitizeUrl(rawUrl?: string): string {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return 'https://hindilhealthguide.org';
  }
  let trimmed = rawUrl.trim();
  if (trimmed.startsWith('http://')) {
    trimmed = `https://${trimmed.slice(7)}`;
  } else if (!trimmed.startsWith('https://')) {
    trimmed = `https://${trimmed}`;
  }
  // Remove trailing slashes for consistent URL joining
  return trimmed.replace(/\/+$/, '');
}

export const ENV = {
  /**
   * Primary canonical custom production URL:
   * Pointing strictly to official domain: https://hindilhealthguide.org
   */
  productionUrl: process.env.NEXT_PUBLIC_SITE_URL ? sanitizeUrl(process.env.NEXT_PUBLIC_SITE_URL) : 'https://hindilhealthguide.org',

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

/**
 * Firebase Client & Security Error Handling Layer
 * Adheres strictly to the Firebase Integration Skill and error logging protocol.
 */

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
  currentUser?: {
    uid?: string;
    email?: string | null;
    emailVerified?: boolean;
    isAnonymous?: boolean;
  }
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid || null,
      email: currentUser?.email || null,
      emailVerified: currentUser?.emailVerified || null,
      isAnonymous: currentUser?.isAnonymous || null,
      providerInfo: [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface AdminAuthState {
  isAuthenticated: boolean;
  email: string | null;
  displayName: string | null;
  role: 'admin' | 'editor' | 'guest';
}

const AUTH_STORAGE_KEY = 'hhg_admin_session';

export class AdminAuthService {
  private static instance: AdminAuthService;
  private state: AdminAuthState = {
    isAuthenticated: false,
    email: null,
    displayName: null,
    role: 'guest',
  };

  private constructor() {
    this.restoreSession();
  }

  public static getInstance(): AdminAuthService {
    if (!AdminAuthService.instance) {
      AdminAuthService.instance = new AdminAuthService();
    }
    return AdminAuthService.instance;
  }

  private restoreSession(): void {
    if (typeof window === 'undefined') return;
    try {
      const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        this.state = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Session storage read error:', e);
    }
  }

  public getState(): AdminAuthState {
    return { ...this.state };
  }

  public loginAsAdmin(email: string, displayName = 'संपादक / एडमिन'): boolean {
    this.state = {
      isAuthenticated: true,
      email,
      displayName,
      role: 'admin',
    };
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(this.state));
    }
    return true;
  }

  public logout(): void {
    this.state = {
      isAuthenticated: false,
      email: null,
      displayName: null,
      role: 'guest',
    };
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }
}

export const adminAuth = AdminAuthService.getInstance();

/**
 * Check if external Firebase credentials are provided in the environment.
 * If not, the application operates in 100% functional standalone mode without crashing.
 */
export function isFirebaseConfigured(): boolean {
  if (typeof process === 'undefined') return false;
  return Boolean(
    process.env?.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env?.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  );
}

export function getFirebaseConfig() {
  if (!isFirebaseConfigured()) return null;
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
}


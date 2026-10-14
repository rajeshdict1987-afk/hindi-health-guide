/**
 * Router Context supporting full SPA path navigation, browser history,
 * search params, and route matching for Hindi Health Guide.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface RouteMatch {
  path: string;
  params: Record<string, string>;
  searchParams: URLSearchParams;
}

interface RouterContextType {
  currentPath: string;
  searchParams: URLSearchParams;
  navigate: (path: string, options?: { replace?: boolean }) => void;
  getParam: (name: string) => string | undefined;
}

const RouterContext = createContext<RouterContextType | null>(null);

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  const [searchParams, setSearchParams] = useState<URLSearchParams>(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search);
    }
    return new URLSearchParams();
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      setSearchParams(new URLSearchParams(window.location.search));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string, options?: { replace?: boolean }) => {
    if (typeof window !== 'undefined') {
      if (options?.replace) {
        window.history.replaceState({}, '', path);
      } else {
        window.history.pushState({}, '', path);
      }
      const [pathname, search] = path.split('?');
      setCurrentPath(pathname || '/');
      setSearchParams(new URLSearchParams(search || ''));
      window.scrollTo(0, 0);
    }
  };

  const getParam = (_name: string): string | undefined => {
    return undefined;
  };

  return (
    <RouterContext.Provider value={{ currentPath, searchParams, navigate, getParam }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = (): RouterContextType => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};

/**
 * Route matching helper for parameterized paths like /category/:slug or /articles/:slug
 */
export function matchRoute(
  pattern: string,
  pathname: string
): { isMatch: boolean; params: Record<string, string> } {
  const patternSegments = pattern.split('/').filter(Boolean);
  const pathSegments = pathname.split('/').filter(Boolean);

  if (patternSegments.length !== pathSegments.length) {
    return { isMatch: false, params: {} };
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < patternSegments.length; i++) {
    const pSeg = patternSegments[i];
    const aSeg = pathSegments[i];

    if (pSeg.startsWith(':')) {
      const paramName = pSeg.slice(1);
      params[paramName] = decodeURIComponent(aSeg);
    } else if (pSeg !== aSeg) {
      return { isMatch: false, params: {} };
    }
  }

  return { isMatch: true, params };
}

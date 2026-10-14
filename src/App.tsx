/**
 * Hindi Health Guide (हिंदी हेल्थ गाइड)
 * Main Application Component with client routing and accessibility layout
 */

import React from 'react';
import { RouterProvider, useRouter, matchRoute } from './context/RouterContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

// Public Pages
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { ArticlePage } from './pages/ArticlePage';
import { SearchPage } from './pages/SearchPage';
import { AboutPage } from './pages/AboutPage';
import { EditorialPolicyPage } from './pages/EditorialPolicyPage';
import { MedicalDisclaimerPage } from './pages/MedicalDisclaimerPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminArticleEditorPage } from './pages/admin/AdminArticleEditorPage';
import { AdminMediaPage } from './pages/admin/AdminMediaPage';

const AppContent: React.FC = () => {
  const { currentPath } = useRouter();

  // Route matching logic
  const renderRoute = () => {
    // 1. Home
    if (currentPath === '/' || currentPath === '') {
      return <HomePage />;
    }

    // 2. Category Page: /category/:slug
    const categoryMatch = matchRoute('/category/:slug', currentPath);
    if (categoryMatch.isMatch && categoryMatch.params.slug) {
      return <CategoryPage slug={categoryMatch.params.slug} />;
    }

    // 3. Article Page: /articles/:slug
    const articleMatch = matchRoute('/articles/:slug', currentPath);
    if (articleMatch.isMatch && articleMatch.params.slug) {
      return <ArticlePage slug={articleMatch.params.slug} />;
    }

    // 4. Search
    if (currentPath === '/search') {
      return <SearchPage />;
    }

    // 5. Institutional & Legal Pages
    if (currentPath === '/about') {
      return <AboutPage />;
    }
    if (currentPath === '/editorial-policy') {
      return <EditorialPolicyPage />;
    }
    if (currentPath === '/medical-disclaimer') {
      return <MedicalDisclaimerPage />;
    }
    if (currentPath === '/privacy-policy') {
      return <PrivacyPolicyPage />;
    }
    if (currentPath === '/terms') {
      return <TermsPage />;
    }
    if (currentPath === '/contact') {
      return <ContactPage />;
    }

    // 6. Admin Routes
    if (currentPath === '/admin/login') {
      return <AdminLoginPage />;
    }
    if (currentPath === '/admin' || currentPath === '/admin/articles') {
      return <AdminDashboardPage />;
    }
    if (currentPath === '/admin/articles/new') {
      return <AdminArticleEditorPage />;
    }
    const adminEditMatch = matchRoute('/admin/articles/:id/edit', currentPath);
    if (adminEditMatch.isMatch && adminEditMatch.params.id) {
      return <AdminArticleEditorPage articleId={adminEditMatch.params.id} />;
    }
    if (currentPath === '/admin/media') {
      return <AdminMediaPage />;
    }

    // 7. 404 Fallback
    return <NotFoundPage />;
  };

  const isAdminRoute = currentPath.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-['Mukta',sans-serif]">
      <Header />
      <main className="flex-1">
        {renderRoute()}
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  );
}

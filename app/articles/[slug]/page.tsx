import type { Metadata } from 'next';
import React from 'react';
import { INITIAL_ARTICLES } from '../../../src/data/initialArticles';
import { SITE_CONFIG } from '../../../src/config/site-config';
import { ArticlePage } from '../../../src/views/ArticlePage';
import { Article } from '../../../src/types/article';
import { generateArticleSchema, generateFAQSchema } from '../../../src/lib/seoHelper';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return INITIAL_ARTICLES.map((art: Article) => ({
    slug: art.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = INITIAL_ARTICLES.find((a: Article) => a.slug === slug);

  if (!article) {
    return {
      title: 'लेख नहीं मिला',
    };
  }

  return {
    title: article.seo?.title || `${article.title} | ${SITE_CONFIG.hindiName}`,
    description: article.seo?.metaDescription || article.excerpt,
    keywords: article.seo?.keywords || article.tags || ['स्वास्थ्य', 'प्रजनन स्वास्थ्य'],
    alternates: {
      canonical: `${SITE_CONFIG.productionUrl}/articles/${article.slug}`,
    },
    openGraph: {
      type: 'article',
      locale: 'hi_IN',
      siteName: SITE_CONFIG.hindiName,
      title: article.title,
      description: article.excerpt,
      url: `${SITE_CONFIG.productionUrl}/articles/${article.slug}`,
      images: [
        {
          url: article.image.url,
          width: 1200,
          height: 630,
          alt: article.image.alt || article.title,
        },
      ],
      publishedTime: article.publishedAt || article.createdAt,
      modifiedTime: article.updatedAt || article.publishedAt || article.createdAt,
      authors: [article.author.name],
      tags: article.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [article.image.url],
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const article = INITIAL_ARTICLES.find((a: Article) => a.slug === slug);

  const jsonLd = article ? generateArticleSchema(article) : null;
  const faqJsonLd = article ? generateFAQSchema(article) : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <ArticlePage slug={slug} />
    </>
  );
}

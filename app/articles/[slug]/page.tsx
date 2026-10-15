import type { Metadata } from 'next';
import React from 'react';
import { INITIAL_ARTICLES } from '../../../src/data/initialArticles';
import { SITE_CONFIG } from '../../../src/config/site-config';
import { ArticlePage } from '../../../src/views/ArticlePage';
import { Article } from '../../../src/types/article';

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
    title: article.seo.title || article.title,
    description: article.seo.metaDescription || article.excerpt,
    alternates: {
      canonical: `/articles/${article.slug}`,
    },
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.excerpt,
      url: `${SITE_CONFIG.productionUrl}/articles/${article.slug}`,
      images: [
        {
          url: article.image.url,
          alt: article.image.alt,
        },
      ],
      publishedTime: article.publishedAt || article.createdAt,
      authors: [article.author.name],
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <ArticlePage slug={slug} />;
}

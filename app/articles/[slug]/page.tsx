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

// फ़ायरस्टोर / डेटाबेस या प्रारंभिक डेटा से आर्टिकल लोड करने का फ़ंक्शन
export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  return INITIAL_ARTICLES.find((a: Article) => a.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}): Promise<Metadata> {
  const resolvedParams = await params;
  const article = await getArticleBySlug(resolvedParams.slug);

  if (!article) {
    return {
      title: 'लेख नहीं मिला | हिंदी हेल्थ गाइड',
      description: 'यह स्वास्थ्य आलेख उपलब्ध नहीं है या हटा दिया गया है।',
    };
  }

  // एक्सर्प्ट या आर्टिकल सामग्री के शुरुआती 150 अक्षरों से स्वच्छ विवरण
  const cleanDescription =
    article.excerpt ||
    (article.content
      ? article.content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().substring(0, 150)
      : '') ||
    'भारत का विश्वसनीय स्वास्थ्य पोर्टल - यौन एवं प्रजनन स्वास्थ्य शिक्षा।';

  const imageUrl =
    (article as any).imageUrl ||
    article.image?.url ||
    'https://www.hindihealthguide.org/default-og-image.jpg';

  const articleUrl = `https://www.hindihealthguide.org/articles/${resolvedParams.slug}`;

  return {
    title: article.title,
    description: cleanDescription,
    alternates: {
      canonical: articleUrl,
    },
    openGraph: {
      title: article.title,
      description: cleanDescription,
      url: articleUrl,
      siteName: 'हिंदी हेल्थ गाइड',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      type: 'article',
      publishedTime: article.publishedAt || article.createdAt,
      modifiedTime: article.updatedAt || article.publishedAt || article.createdAt,
      authors: [
        (article.author?.name || 'राजेश कुमार साहू')
          .replace(/गुरु\s*/gi, '')
          .replace(/Guru\s*/gi, '')
          .trim() || 'राजेश कुमार साहू',
      ],
      tags: article.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: cleanDescription,
      images: [imageUrl],
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

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

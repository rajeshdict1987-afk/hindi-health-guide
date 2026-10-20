import type { Metadata } from 'next';
import React from 'react';
import { INITIAL_ARTICLES } from '../../../src/data/initialArticles';
import { ArticlePage } from '../../../src/views/ArticlePage';
import { Article } from '../../../src/types/article';
import { generateArticleSchema, generateFAQSchema } from '../../../src/lib/seoHelper';

interface Props {
  params: Promise<{ slug: string }> | { slug: string };
}

export async function generateStaticParams() {
  return INITIAL_ARTICLES.map((art: Article) => ({
    slug: art.slug,
  }));
}

// फ़ंक्शन: स्लग या आईडी के आधार पर आर्टिकल डेटा लोड करना
export async function getArticleData(slugParam: string): Promise<Article | undefined> {
  if (!slugParam) return undefined;
  const decoded = decodeURIComponent(slugParam).trim();
  
  // 1. सीधे स्लग से मिलान
  let found = INITIAL_ARTICLES.find(
    (a: Article) => a.slug === slugParam || a.slug === decoded || a.id === slugParam
  );

  // 2. यदि न मिले, तो क्लीन स्लग से मिलान
  if (!found) {
    const normalizedTarget = decoded.replace(/-+/g, '-').replace(/^-+|-+$/g, '');
    found = INITIAL_ARTICLES.find((a: Article) => {
      const aNorm = a.slug.replace(/-+/g, '-').replace(/^-+|-+$/g, '');
      return aNorm === normalizedTarget || a.slug.includes(normalizedTarget) || normalizedTarget.includes(a.slug);
    });
  }

  return found;
}

export const getArticleBySlug = getArticleData;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const article = await getArticleData(slug);

  const title = article?.title || 'हिंदी हेल्थ गाइड';
  const rawContent = article?.content ? article.content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() : '';
  const description = article?.excerpt || rawContent.substring(0, 150) || 'स्वास्थ्य संबंधी प्रामाणिक जानकारी।';
  const imageUrl = (article as any)?.imageUrl || article?.image?.url || 'https://www.hindihealthguide.org/logo.png';
  const pageUrl = `https://www.hindihealthguide.org/articles/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: 'हिंदी हेल्थ गाइड',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'hi_IN',
      type: 'article',
      publishedTime: article?.publishedAt || article?.createdAt,
      modifiedTime: article?.updatedAt || article?.publishedAt,
      authors: [
        (article?.author?.name || 'राजेश कुमार साहू')
          .replace(/गुरु\s*/gi, '')
          .replace(/Guru\s*/gi, '')
          .trim() || 'राजेश कुमार साहू',
      ],
      tags: article?.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function Page({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const article = await getArticleData(slug);

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

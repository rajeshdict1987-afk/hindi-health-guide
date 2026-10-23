import type { Metadata } from 'next';
import React from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { INITIAL_ARTICLES } from '../../../src/data/initialArticles';
import { ArticlePage } from '../../../src/views/ArticlePage';
import { Article } from '../../../src/types/article';
import { generateArticleSchema, generateFAQSchema } from '../../../src/lib/seoHelper';
import { getServerArticleBySlug } from '../../../src/lib/serverArticles';

// Incremental Static Regeneration (ISR): CDN cache revalidated every 60 seconds
export const revalidate = 60;


type Props = {
  params: Promise<{ slug: string }> | { slug: string };
};

// फ़ंक्शन: स्लग या आईडी के आधार पर आर्टिकल प्राप्त करना (सर्वर स्टोर -> फ़ायरस्टोर -> डिफ़ॉल्ट डेटाबेस)
export async function getArticleData(slugParam: string): Promise<Article | undefined> {
  if (!slugParam) return undefined;

  // 1. सर्वर के स्थायी JSON स्टोर से प्राप्त करें (सर्वोच्च प्राथमिकता)
  const serverArt = getServerArticleBySlug(slugParam);
  if (serverArt) return serverArt;

  // 2. यदि फ़ायरस्टोर में मौजूद हो
  try {
    const docRef = doc(db, 'articles', slugParam);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as Article;
    }
  } catch {}

  // 3. फ़ॉलबैक: INITIAL_ARTICLES
  const decoded = decodeURIComponent(slugParam).trim();
  const normalizedTarget = decoded.replace(/-+/g, '-').replace(/^-+|-+$/g, '');

  let found = INITIAL_ARTICLES.find(
    (a: Article) => a.slug === slugParam || a.slug === decoded || a.id === slugParam
  );

  if (!found) {
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
  const { slug } = resolvedParams;

  const article = await getArticleData(slug);

  const articleTitle = article?.title || 'हिंदी हेल्थ गाइड';
  const cleanContent = article?.content ? article.content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() : '';
  const articleDesc = article?.excerpt || cleanContent.substring(0, 150) || 'स्वास्थ्य संबंधी प्रामाणिक जानकारी।';
  
  let articleImage = (article as any)?.imageUrl || article?.image?.url || 'https://hindihealthguide.org/logo.png';
  if (articleImage.startsWith('/')) {
    articleImage = `https://hindihealthguide.org${articleImage}`;
  }

  const pageUrl = `https://hindihealthguide.org/articles/${slug}`;


  return {
    title: articleTitle,
    description: articleDesc,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: articleTitle,
      description: articleDesc,
      url: pageUrl,
      siteName: 'हिंदी हेल्थ गाइड',
      images: [
        {
          url: articleImage,
          width: 1200,
          height: 630,
          alt: articleTitle,
        },
      ],
      locale: 'hi_IN',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: articleTitle,
      description: articleDesc,
      images: [articleImage],
    },
  };
}

export default async function Page({ params }: Props) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
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
      <ArticlePage slug={slug} initialArticle={article || null} />
    </>
  );
}

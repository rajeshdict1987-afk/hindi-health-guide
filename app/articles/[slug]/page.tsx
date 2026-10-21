import type { Metadata } from 'next';
import React from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { INITIAL_ARTICLES } from '../../../src/data/initialArticles';
import { ArticlePage } from '../../../src/views/ArticlePage';
import { Article } from '../../../src/types/article';
import { generateArticleSchema, generateFAQSchema } from '../../../src/lib/seoHelper';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = {
  params: Promise<{ slug: string }> | { slug: string };
};

// फ़ंक्शन: स्लग या आईडी के आधार पर आर्टिकल प्राप्त करना (फ़ॉलबैक व बिल्ड समय हेतु)
export async function getArticleData(slugParam: string): Promise<Article | undefined> {
  if (!slugParam) return undefined;
  const decoded = decodeURIComponent(slugParam).trim();

  let found = INITIAL_ARTICLES.find(
    (a: Article) => a.slug === slugParam || a.slug === decoded || a.id === slugParam
  );

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
  const { slug } = resolvedParams;

  let articleTitle = 'हिंदी हेल्थ गाइड';
  let articleDesc = 'स्वास्थ्य संबंधी प्रामाणिक जानकारी।';
  let articleImage = 'https://www.hindihealthguide.org/logo.png';

  try {
    const docRef = doc(db, 'articles', slug);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      articleTitle = data.title || articleTitle;
      articleDesc = data.excerpt || data.content?.substring(0, 150) || articleDesc;
      articleImage = data.imageUrl || (data.image && data.image.url) || articleImage;
    } else {
      // यदि फायरस्टोर में यह स्लग न मिले, तो डिफ़ॉल्ट/स्थानीय डेटाबेस से प्राप्त करें
      const localData = await getArticleData(slug);
      if (localData) {
        articleTitle = localData.title || articleTitle;
        articleDesc = localData.excerpt || localData.content?.substring(0, 150) || articleDesc;
        articleImage = (localData as any).imageUrl || localData.image?.url || articleImage;
      }
    }
  } catch (e) {
    console.error('Error fetching metadata:', e);
    const localData = await getArticleData(slug);
    if (localData) {
      articleTitle = localData.title || articleTitle;
      articleDesc = localData.excerpt || localData.content?.substring(0, 150) || articleDesc;
      articleImage = (localData as any).imageUrl || localData.image?.url || articleImage;
    }
  }

  // Ensure absolute URL for social media link crawlers (WhatsApp / Facebook)
  if (articleImage.startsWith('/')) {
    articleImage = `https://www.hindihealthguide.org${articleImage}`;
  }

  const pageUrl = `https://www.hindihealthguide.org/articles/${slug}`;

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
  let article: any = null;

  try {
    const docRef = doc(db, 'articles', slug);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      article = docSnap.data();
    }
  } catch {
    // Fallback
  }

  if (!article) {
    article = await getArticleData(slug);
  }

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

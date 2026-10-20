import type { Metadata } from 'next';
import React from 'react';
import { db } from '@/lib/firebase'; // आपका फायरस्टोर कनेक्शन
import { doc, getDoc } from 'firebase/firestore';
import { INITIAL_ARTICLES } from '../../../src/data/initialArticles';
import { ArticlePage } from '../../../src/views/ArticlePage';
import { Article } from '../../../src/types/article';
import { generateArticleSchema, generateFAQSchema } from '../../../src/lib/seoHelper';

type Props = {
  params: Promise<{ slug: string }> | { slug: string };
};

export async function generateStaticParams() {
  return INITIAL_ARTICLES.map((art: Article) => ({
    slug: art.slug,
  }));
}

// फ़ंक्शन: लोकल / प्रारंभिक डेटा से आर्टिकल प्राप्त करना (फ़ॉलबैक व बिल्ड समय हेतु)
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

// 1. यह फ़ंक्शन WhatsApp और Facebook को आर्टिकल का डेटा देता है
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // यहाँ अपने डेटाबेस से आर्टिकल का डेटा लाएँ
  let articleData: any = null;
  try {
    const docRef = doc(db, 'articles', slug);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      articleData = docSnap.data();
    }
  } catch (error) {
    console.error('Error fetching article metadata from Firestore:', error);
  }

  // यदि फायरस्टोर में न मिले (उदा. प्रारंभिक डेटा), तो डिफ़ॉल्ट डेटाबेस से लाएं
  if (!articleData) {
    articleData = await getArticleData(slug);
  }

  const title = articleData?.title || 'हिंदी हेल्थ गाइड';
  const rawContent = articleData?.content
    ? String(articleData.content).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
    : '';
  const description =
    articleData?.excerpt ||
    rawContent.substring(0, 120) ||
    articleData?.content?.substring(0, 120) ||
    'स्वास्थ्य संबंधी प्रामाणिक जानकारी।';

  // आर्टिकल की पोस्टर फ़ोटो (16:9) - अगर न हो तो आपका ओरिजिनल ब्रांड लोगो
  const imageUrl =
    articleData?.imageUrl ||
    articleData?.image?.url ||
    'https://www.hindihealthguide.org/logo.png';
  const pageUrl = `https://www.hindihealthguide.org/articles/${slug}`;

  return {
    title: title,
    description: description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: title,
      description: description,
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
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [imageUrl],
    },
  };
}

export default async function Page({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  let article: any = null;

  try {
    const docRef = doc(db, 'articles', slug);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      article = docSnap.data();
    }
  } catch {
    // Fallback below
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

import type { Metadata } from 'next';
import React from 'react';
import { SITE_CONFIG, CategoryConfig } from '../../../src/config/site-config';
import { CategoryPage } from '../../../src/views/CategoryPage';

interface Props {
  params: Promise<{ slug: string }>;
}

// Incremental Static Regeneration (ISR)
export const revalidate = 60;

export async function generateStaticParams() {

  return SITE_CONFIG.categories.map((cat: CategoryConfig) => ({
    slug: cat.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = SITE_CONFIG.categories.find((c: CategoryConfig) => c.slug === slug);

  if (!category) {
    return {
      title: 'श्रेणी नहीं मिली',
    };
  }

  return {
    title: category.seoTitle,
    description: category.seoDescription,
    alternates: {
      canonical: `${SITE_CONFIG.productionUrl}/category/${category.slug}`,
    },
    openGraph: {
      type: 'website',
      locale: 'hi_IN',
      siteName: SITE_CONFIG.hindiName,
      title: `${category.hindiName} - ${SITE_CONFIG.hindiName}`,
      description: category.seoDescription || category.description,
      url: `${SITE_CONFIG.productionUrl}/category/${category.slug}`,
      images: [
        {
          url: `${SITE_CONFIG.productionUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: category.hindiName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.hindiName} - ${SITE_CONFIG.hindiName}`,
      description: category.seoDescription || category.description,
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const category = SITE_CONFIG.categories.find((c: CategoryConfig) => c.slug === slug);

  const categoryJsonLd = category
    ? {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': ['CollectionPage', 'MedicalWebPage'],
            '@id': `${SITE_CONFIG.productionUrl}/category/${category.slug}#page`,
            url: `${SITE_CONFIG.productionUrl}/category/${category.slug}`,
            name: `${category.hindiName} - ${SITE_CONFIG.hindiName}`,
            headline: category.seoTitle,
            description: category.seoDescription || category.description,
            inLanguage: 'hi-IN',
            publisher: {
              '@type': 'Organization',
              name: SITE_CONFIG.hindiName,
              url: SITE_CONFIG.productionUrl,
            },
            citation: [
              'World Health Organization (WHO) Guidelines',
              'National AIDS Control Organisation (NACO) Standards'
            ],
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'होम',
                item: SITE_CONFIG.productionUrl,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: category.hindiName,
                item: `${SITE_CONFIG.productionUrl}/category/${category.slug}`,
              },
            ],
          },
        ],
      }
    : null;

  return (
    <>
      {categoryJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryJsonLd) }}
        />
      )}
      <CategoryPage slug={slug} />
    </>
  );
}

import type { Metadata } from 'next';
import React from 'react';
import { SITE_CONFIG, CategoryConfig } from '../../../src/config/site-config';
import { CategoryPage } from '../../../src/views/CategoryPage';

interface Props {
  params: Promise<{ slug: string }>;
}

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
      canonical: `/category/${category.slug}`,
    },
    openGraph: {
      title: `${category.name} | ${SITE_CONFIG.hindiName}`,
      description: category.description,
      url: `${SITE_CONFIG.productionUrl}/category/${category.slug}`,
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <CategoryPage slug={slug} />;
}

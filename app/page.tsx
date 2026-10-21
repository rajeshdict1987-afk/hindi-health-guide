import React from 'react';
import { HomePage } from '../src/views/HomePage';
import { getAllServerArticles } from '../src/lib/serverArticles';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Page() {
  const articles = getAllServerArticles();
  return <HomePage initialArticles={articles} />;
}

import React from 'react';
import { HomePage } from '../src/views/HomePage';
import { getAllServerArticles } from '../src/lib/serverArticles';

// Incremental Static Regeneration (ISR): cached for instant millisecond delivery
export const revalidate = 60;


export default function Page() {
  const articles = getAllServerArticles();
  return <HomePage initialArticles={articles} />;
}

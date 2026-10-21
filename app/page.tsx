import React from 'react';
import { HomePage } from '../src/views/HomePage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Page() {
  return <HomePage />;
}

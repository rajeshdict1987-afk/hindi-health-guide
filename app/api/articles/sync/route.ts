import { NextRequest, NextResponse } from 'next/server';
import { syncServerArticles, getAllServerArticles } from '@/src/lib/serverArticles';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const articles = body.articles || body;
    if (Array.isArray(articles) && articles.length > 0) {
      const merged = syncServerArticles(articles);
      return NextResponse.json({ success: true, count: merged.length, articles: merged });
    }
    const current = getAllServerArticles();
    return NextResponse.json({ success: true, count: current.length, articles: current });
  } catch (error) {
    console.error('API /api/articles/sync error:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllServerArticles, 
  saveServerArticle, 
  deleteServerArticle 
} from '@/src/lib/serverArticles';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const articles = getAllServerArticles();
    return NextResponse.json({ articles, success: true });
  } catch (error) {
    console.error('API /api/articles GET error:', error);
    return NextResponse.json({ articles: [], success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const article = body.article || body;
    if (!article || !article.title || !article.slug) {
      return NextResponse.json({ success: false, error: 'आर्टिकल शीर्षक और स्लग आवश्यक हैं।' }, { status: 400 });
    }
    const updated = saveServerArticle(article);
    return NextResponse.json({ success: true, articles: updated });
  } catch (error) {
    console.error('API /api/articles POST error:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id') || searchParams.get('slug');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Article ID or slug is required' }, { status: 400 });
    }
    const updated = deleteServerArticle(id);
    return NextResponse.json({ success: true, articles: updated });
  } catch (error) {
    console.error('API /api/articles DELETE error:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

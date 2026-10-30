import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { 
  getAllServerArticles, 
  saveServerArticle, 
  deleteServerArticle,
  syncServerArticles 
} from '@/src/lib/serverArticles';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const articles = getAllServerArticles();
    return NextResponse.json(
      { articles, success: true },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error) {
    console.error('API /api/articles GET error:', error);
    return NextResponse.json({ articles: [], success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Check if this is a bulk sync request from client
    if (body.sync && Array.isArray(body.articles)) {
      const updated = syncServerArticles(body.articles);
      try {
        revalidatePath('/', 'page');
        revalidatePath('/category/[slug]', 'page');
        revalidatePath('/articles/[slug]', 'page');
        revalidatePath('/sitemap.xml');
      } catch (revErr) {
        console.warn('Revalidation note:', revErr);
      }
      return NextResponse.json({ success: true, articles: updated, synced: true });
    }

    const article = body.article || body;
    if (!article || !article.title || !article.slug) {
      return NextResponse.json({ success: false, error: 'आर्टिकल शीर्षक और स्लग आवश्यक हैं।' }, { status: 400 });
    }
    const updated = saveServerArticle(article);

    // Revalidate all cached Next.js routes instantly so the new article appears immediately
    try {
      revalidatePath('/', 'page');
      revalidatePath(`/articles/${article.slug}`, 'page');
      if (article.category) {
        revalidatePath(`/category/${article.category}`, 'page');
      }
      revalidatePath('/sitemap.xml');
    } catch (revErr) {
      console.warn('Revalidation note:', revErr);
    }

    return NextResponse.json({ success: true, articles: updated });
  } catch (error) {
    console.error('API /api/articles POST error:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get('id') || searchParams.get('slug');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Article ID or slug is required' }, { status: 400 });
    }
    const updated = deleteServerArticle(id);

    try {
      revalidatePath('/', 'page');
      revalidatePath('/category/[slug]', 'page');
      revalidatePath('/articles/[slug]', 'page');
      revalidatePath('/sitemap.xml');
    } catch (revErr) {
      console.warn('Revalidation note:', revErr);
    }

    return NextResponse.json({ success: true, articles: updated });
  } catch (error) {
    console.error('API /api/articles DELETE error:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

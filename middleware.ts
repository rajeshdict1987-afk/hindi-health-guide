import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin API mutations
  if (pathname.startsWith('/api/admin')) {
    const sessionCookie = request.cookies.get('admin_session')?.value;
    const authHeader = request.headers.get('authorization');

    if (sessionCookie !== 'authenticated' && authHeader !== 'Bearer admin_secret_token') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin session required.' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/admin/:path*'],
};

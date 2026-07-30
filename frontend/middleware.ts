import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that never require authentication or redirect
  const publicRoutes = ['/', '/login', '/signup', '/forgot-password', '/unauthorized'];
  if (publicRoutes.includes(pathname) || pathname.startsWith('/_next') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/student/:path*', '/vendor/:path*', '/admin/:path*', '/chief/:path*'],
};

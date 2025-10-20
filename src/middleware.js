import { NextResponse } from 'next/server';

export function middleware(request) {
  let allowedPath = ['/', '/login', '/register', '/forgot-password'];
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('authToken');


  // Case 1: Not logged in and trying to access protected route
  if (!sessionCookie && !allowedPath.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Case 2: Already logged in but trying to access login/register
  if (sessionCookie && (pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('forgot-password'))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next(); 
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
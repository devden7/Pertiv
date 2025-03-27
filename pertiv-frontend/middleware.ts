import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { ENV } from './utils/config';
import { ROLE_PATHS } from './utils/path';
import { Role } from './model/middleware.model';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get('token');

  if (!token && publicRoutes.some((item) => item === pathname)) {
    return NextResponse.next();
  }

  for (let i = 0; i < protectedUserRoutes.length; i++) {
    if (!token && pathname.startsWith(protectedUserRoutes[i])) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (token) {
    const secret = new TextEncoder().encode(ENV.JWT_SECRET);
    const user = await jwtVerify(token.value, secret);
    const role = user.payload.role as Role;

    const routePath =
      role === 'admin'
        ? ROLE_PATHS.admin
        : role === 'staff'
        ? ROLE_PATHS.staff
        : ROLE_PATHS.user;

    if (authRoutes.some((item) => item === pathname)) {
      return NextResponse.redirect(new URL(routePath, request.url));
    }

    if ((role === 'admin') !== pathname.startsWith(ROLE_PATHS.admin)) {
      return NextResponse.redirect(new URL(routePath, request.url));
    }

    if ((role === 'staff') !== pathname.startsWith(ROLE_PATHS.staff)) {
      return NextResponse.redirect(new URL(routePath, request.url));
    }

    if (
      role === 'user' &&
      protectedUserRoutes.some((item) => item === pathname)
    ) {
      return NextResponse.next();
    }
  }
}
const authRoutes = ['/login', '/register'];
const publicRoutes = ['/', '/book-selling', '/login', '/register'];
const protectedUserRoutes = ['/cart', '/transactions', '/payment'];

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};

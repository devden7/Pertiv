import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { ENV } from './utils/config';
import { ROLE_PATHS } from './utils/path';
import { Role } from './model/middleware.model';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get('token');

  if (!token && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token) {
    const secret = new TextEncoder().encode(ENV.JWT_SECRET);
    const user = await jwtVerify(token.value, secret);

    const role = user.payload.role as Role;

    if (role === 'admin' && pathname.startsWith(ROLE_PATHS.admin)) {
      return NextResponse.next();
    }

    if (role === 'staff' && pathname.startsWith(ROLE_PATHS.staff)) {
      return NextResponse.next();
    }

    if (role === 'user' && pathname === ROLE_PATHS.user) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL(ROLE_PATHS[role], request.url));
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};

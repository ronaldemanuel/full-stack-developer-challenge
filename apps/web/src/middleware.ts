import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  const isProtectedRoute = protectedRoutes.some((fn) =>
    fn(request.nextUrl.pathname),
  );

  const isPublicOnlyRoute = publicOnlyRoutes.some((fn) =>
    fn(request.nextUrl.pathname),
  );

  // WARN:
  // THIS IS NOT SECURE!
  // This is the recommended approach to optimistically redirect users
  // We recommend handling auth checks in each page/route
  if (!sessionCookie && isProtectedRoute) {
    return NextResponse.redirect(new URL(PROTECTED_REDIRECT, request.url));
  }

  if (sessionCookie && isPublicOnlyRoute) {
    return NextResponse.redirect(new URL(PUBLIC_ONLY_REDIRECT, request.url));
  }

  return NextResponse.next();
}

const PROTECTED_REDIRECT = '/sign-in';
const PUBLIC_ONLY_REDIRECT = '/dashboard';

const protectedRoutes: Array<(pathname: string) => boolean> = [
  (path) => path.startsWith('/dashboard'),
  (path) => path.startsWith('/user/settings'),
];

const publicOnlyRoutes: Array<(pathname: string) => boolean> = [
  (path) => path.startsWith('/sign-in'),
];

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'], // Specify the routes the middleware applies to
};

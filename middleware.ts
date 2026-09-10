import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const isApi = request.nextUrl.pathname.startsWith('/api/admin');
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
  if (token) return NextResponse.next();
  if (isApi) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const login = new URL('/admin/login', request.url);
  login.searchParams.set('callbackUrl', request.nextUrl.pathname);
  return NextResponse.redirect(login);
}

export const config = { matcher: ['/admin/((?!login).*)', '/api/admin/:path*'] };

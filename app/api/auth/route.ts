import { NextResponse } from 'next/server';

const AUTH_COOKIE = 'soarx-auth';

export async function POST(request: Request) {
  const body = await request.json();
  const password = body?.password;

  if (!password || password !== process.env.SOARX_ACCESS_PASSWORD) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: AUTH_COOKIE,
    value: 'authenticated',
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  return response;
}

import { NextResponse } from 'next/server';

const base_url = process.env.BASE_URL;

export async function GET() {
  try {
    const email = 'nebyat797@gmail.com';
    const password = 'password123';
        
    const response = await fetch(`${base_url}/api/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      const res = NextResponse.json({ success: true, user: data.user });
      res.cookies.set('token', data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 
      });
      return res;
    }
    
    return NextResponse.json({ error: data.message }, { status: 400 });
  } catch (error) {
    console.error('Auto-login error:', error);
    return NextResponse.json({ error: 'Auto-login failed' }, { status: 500 });
  }
}
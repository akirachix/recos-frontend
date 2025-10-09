import { NextRequest, NextResponse } from 'next/server';

const base_url = process.env.BASE_URL;
export async function GET(request: NextRequest) {
  try {
    
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token' }, { status: 401 });
    }

    const response = await fetch(`${base_url}/users/`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const userData = await response.json();
    return NextResponse.json(userData);
    
  } catch (error) {
    return NextResponse.json({ 
      error: 'Internal server error',
      details: {message : (error as Error)}.message
    }, { status: 500 });
  }
}
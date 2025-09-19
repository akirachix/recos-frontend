import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token' }, { status: 401 });
    }

    const backendResponse = await fetch('https://recos-662b3d74caf2.herokuapp.com/api/users/', {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    });

    
    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      return NextResponse.json({ 
        error: 'Backend request failed',
        details: errorText 
      }, { status: backendResponse.status });
    }

    const userData = await backendResponse.json();
    return NextResponse.json(userData);
    
  } catch (error) {
    return NextResponse.json({ 
      error: 'Internal server error',
      details: typeof error === 'object' && error !== null && 'message' in error ? (error as { message: string }).message : String(error)
    }, { status: 500 });
  }
}
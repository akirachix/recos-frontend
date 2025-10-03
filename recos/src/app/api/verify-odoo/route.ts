import { NextRequest, NextResponse } from 'next/server';

const baseUrl = process.env.BASE_URL;
if (!baseUrl) throw new Error("API base URL not configured");

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No auth token' }, { status: 401 });
    }
    
    const credentials = await request.json();
    const response = await fetch(`${baseUrl}/verify-odoo/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(credentials),
    });
    
    const responseBody = await response.json();
    return NextResponse.json(responseBody, { status: response.status });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Internal server error',
      details: (error as Error).message 
    }, { status: 500 });
  }
}

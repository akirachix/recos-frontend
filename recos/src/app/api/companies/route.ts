import { NextRequest, NextResponse } from 'next/server';

const baseUrl = process.env.BASE_URL;
if (!baseUrl) throw new Error("API base URL missing");

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized, token missing' 
      }, { status: 401 });
    }
    
    const response = await fetch(`${baseUrl}/companies/`, {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return NextResponse.json({ success: true, data }, { status: 200 });
  }catch (error) {
    return NextResponse.json({  message: (error as Error).message }, { status: 500 });
  }
}

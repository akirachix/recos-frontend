import { NextResponse } from 'next/server';

interface LoginRequestBody {
    email: string;
    password: string;
}

interface LoginResponseData {
    token: string;
    message?: string;
}

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const { email, password }: LoginRequestBody = await request.json();
        
        const response: Response = await fetch('https://recos-662b3d74caf2.herokuapp.com/api/login/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data: LoginResponseData = await response.json();
        
        if (response.ok) {
            const res = NextResponse.json({ success: true });
            res.cookies.set('token', data.token, {
                httpOnly: true,
                secure: true, 
                sameSite: 'none', 
                path: '/',
                maxAge: 60 * 60 * 24 * 7
            });
            return res;
        }
        
        return NextResponse.json({ error: data.message }, { status: 400 });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }
}
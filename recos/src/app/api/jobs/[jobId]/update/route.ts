import { NextRequest, NextResponse } from 'next/server';

const base_url = process.env.BASE_URL;

export async function PUT(request: NextRequest, context: { params: Promise<{ jobId: string }> }) {
  try {
    if (!base_url) {
      throw new Error('BASE_URL environment variable is not set');
    }

    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token' }, { status: 401 });
    }

    const params = await context.params;
    const jobId = params.jobId;
    const body = await request.json();


    const response = await fetch(`${base_url}/jobs/${jobId}/`, {
      method: 'PUT',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const updatedJob = await response.json();
    return NextResponse.json(updatedJob);
  } catch (error) {
    return NextResponse.json({
      details: { message: (error as Error).message }
    }, { status: 500 });
  }
}
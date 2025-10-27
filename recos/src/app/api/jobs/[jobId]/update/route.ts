import { NextRequest, NextResponse } from 'next/server';

const base_url = process.env.BASE_URL;

export async function PATCH(request: NextRequest, context: { params: Promise<{ jobId: string }> }) {
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

    if (!body.state) {
      return NextResponse.json({ error: 'State is required' }, { status: 400 });
    }

    const validStates = ['open', 'pause', 'close', 'cancel'];
    if (!validStates.includes(body.state)) {
      return NextResponse.json({ error: 'Invalid state value' }, { status: 400 });
    }

    const response = await fetch(`${base_url}/jobs/${jobId}/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ state: body.state }), 
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update job state');
    }

    const updatedJob = await response.json();
    return NextResponse.json(updatedJob);
  } catch (error) {
    return NextResponse.json(
      {
        details: { message: (error as Error).message },
      },
      { status: 500 }
    );
  }
}

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

    if (!body.job_title || !body.job_description) {
      return NextResponse.json({ error: 'Job title and description are required for full update' }, { status: 400 });
    }

    const response = await fetch(`${base_url}/jobs/${jobId}/`, {
      method: 'PUT',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update job');
    }

    const updatedJob = await response.json();
    return NextResponse.json(updatedJob);
  } catch (error) {
    return NextResponse.json(
      {
        details: { message: (error as Error).message },
      },
      { status: 500 }
    );
  }
}
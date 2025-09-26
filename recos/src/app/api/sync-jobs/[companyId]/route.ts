import { NextRequest, NextResponse } from 'next/server';

const base_url = process.env.BASE_URL;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ companyId: string }> }
) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    
    const { companyId } = await params;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token' }, { status: 401 });
    }

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 });
    }

    const syncResponse = await fetch(`${base_url}/sync/jobs/company/${companyId}/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!syncResponse.ok) {
      const errorText = await syncResponse.text();
      console.error('Sync jobs error:', errorText);
      return NextResponse.json({ 
        error: `Failed to sync jobs: ${syncResponse.statusText}` 
      }, { status: syncResponse.status });
    }

    const syncData = await syncResponse.json();
    return NextResponse.json(syncData);
    
  } catch (error) {
    console.error('Error in sync jobs API:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: (error as Error).message 
    }, { status: 500 });
  }
}
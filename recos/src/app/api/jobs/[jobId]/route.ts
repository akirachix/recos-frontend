import { NextRequest, NextResponse } from 'next/server';

const base_url = process.env.BASE_URL;

type RawJob = {
  job_id: number;
  company_name: string;
  job_title: string;
  job_description: string;
  state: string;
  posted_at: string;
  total_applicants?: number; 
  company?: number;
  company_id?: number;
  generated_job_summary?: string | null;
  expired_at?: string;
  created_at?: string;
  status?: string; 
};


export async function GET(request: NextRequest, context: { params: Promise<{ jobId: string }> }) {
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

    const response = await fetch(`${base_url}/jobs/${jobId}/`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const jobData = await response.json() as RawJob; 

    console.log('Fetched job data:', jobData);
    

    const enhancedJob: RawJob = {
      ...jobData,
      total_applicants: jobData.total_applicants || 0, 
      created_at: new Date(jobData.posted_at).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit'
      }),
      status: jobData.state.charAt(0).toUpperCase() + jobData.state.slice(1)
    };

    console.log('Enhanced job data:', enhancedJob);
    
    return NextResponse.json({ job: enhancedJob });

  } catch (error) {
    return NextResponse.json({
      details: { message: (error as Error).message }
    }, { status: 500 });
  }
}

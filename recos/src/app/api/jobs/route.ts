import { NextRequest, NextResponse } from 'next/server';

type RawJob = {
  job_id: number;
  company: number;
  company_name: string;
  company_id: number;
  job_title: string;
  job_description: string;
  generated_job_summary: string | null;
  state: string; 
  posted_at: string; 
  expired_at: string; 
  created_at: string; 
};

type Candidate = {
  candidate_id: number;
  job: number;
  job_title: string;
  company_name: string;
  odoo_candidate_id: number;
  name: string;
  email: string;
  phone: string;
  generated_skill_summary: string | null;
  state: string;
  partner_id: number;
  date_open: string;
  date_last_stage_update: string;
  created_at: string;
  updated_at: string;
};

type EnhancedJob = RawJob & {
  applicants: number;
  ai_shortlisted: number;
  posted_at: string;
  status: string;
};

const base_url = process.env.BASE_URL;

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token' }, { status: 401 });
    }

    const jobsUrl = `${base_url}/companies/${companyId}/jobs/`;

    const jobsResponse = await fetch(jobsUrl, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!jobsResponse.ok) {
      throw new Error(`Failed to fetch jobs: ${jobsResponse.statusText}`);
    }

    const jobsData = await jobsResponse.json() as RawJob[];

    const candidatePromises = jobsData.map(async (job) => {
      try {
        const candidatesResponse = await fetch(`${base_url}/jobs/${job.job_id}/candidates/`, {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });


        const candidatesData = await candidatesResponse.json() as Candidate[];
        return { candidates: candidatesData, jobId: job.job_id };
      } catch (error) {
        return { candidates: [], jobId: job.job_id };
      }
    });

    const candidateResults = await Promise.all(candidatePromises);

    const candidateCountMap = new Map<number, { total: number; aiShortlisted: number }>();
    
    candidateResults.forEach(result => {
      const totalCandidates = result.candidates.length;
      const aiShortlisted = result.candidates.filter(c => 
        c.state === 'screening'
      ).length;
      
      candidateCountMap.set(result.jobId, {
        total: totalCandidates,
        aiShortlisted: aiShortlisted
      });
    });

    const enhancedJobs: EnhancedJob[] = jobsData.map((job) => {
      const candidateCounts = candidateCountMap.get(job.job_id) || { total: 0, aiShortlisted: 0 };
      
      return {
        ...job,
        applicants: candidateCounts.total,
        ai_shortlisted: candidateCounts.aiShortlisted,
        posted_at: new Date(job.posted_at).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }).replace(',', ''),
        status: job.state.charAt(0).toUpperCase() + job.state.slice(1)
      };
    });

    return NextResponse.json(enhancedJobs);
    
  } catch (error) {
    console.error('Error in jobs API:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: (error as Error).message 
    }, { status: 500 });
  }
}
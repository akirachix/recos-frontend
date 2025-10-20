import { fetchJobs } from './fetchJobs';
import { fetchJobCandidates } from './fetchJobCandidates';

interface ApiCandidate {
  candidate_id: number;
  name: string;
  email: string;
  phone?: string;
  state?: string;
  generated_skill_summary?: string;
}


interface ApiJob {
  job_id: number;
  job_title: string;
}


export interface CandidateWithJobDetails {
  candidate_id: number;
  name: string;
  email: string;
  phone?: string;
  state?: string;
  generated_skill_summary?: string;
  job_title: string;
  job_id: number;
}
type JobsApiResponse = { data?: ApiJob[]; jobs?: ApiJob[] } | ApiJob[];
type CandidatesApiResponse = { data?: ApiCandidate[]; candidates?: ApiCandidate[] } | ApiCandidate[];
export async function getAllCandidatesForCompany(
  companyId: number,
  syncJobsFirst: boolean = false
): Promise<CandidateWithJobDetails[]> {
  try {
    const jobsResponse = await fetchJobs(companyId.toString()) as JobsApiResponse;
    let jobs: ApiJob[] = [];
    if (Array.isArray(jobsResponse)) {
      jobs = jobsResponse;
    } else if (jobsResponse && typeof jobsResponse === 'object') {
      if ('data' in jobsResponse && Array.isArray(jobsResponse.data)) {
        jobs = jobsResponse.data;
      } else if ('jobs' in jobsResponse && Array.isArray(jobsResponse.jobs)) {
        jobs = jobsResponse.jobs;
      }
    }

    if (!jobs || jobs.length === 0) {
      return [];
    }

    const allCandidates: CandidateWithJobDetails[] = [];

    for (const job of jobs) {
      try {
        const candidatesResponse = await fetchJobCandidates(job.job_id.toString()) as CandidatesApiResponse;
        let candidates: ApiCandidate[] = [];
        if (Array.isArray(candidatesResponse)) {
          candidates = candidatesResponse;
        } else if (candidatesResponse && typeof candidatesResponse === 'object') {
          if ('data' in candidatesResponse && Array.isArray(candidatesResponse.data)) {
            candidates = candidatesResponse.data;
          } else if ('candidates' in candidatesResponse && Array.isArray(candidatesResponse.candidates)) {
            candidates = candidatesResponse.candidates;
          }
        }
        
        if (candidates.length > 0) {
          const transformedCandidates: CandidateWithJobDetails[] = candidates.map(
            (candidate: ApiCandidate) => ({
              candidate_id: candidate.candidate_id,
              name: candidate.name,
              email: candidate.email,
              phone: candidate.phone,
              state: candidate.state,
              generated_skill_summary: candidate.generated_skill_summary,
              job_title: job.job_title,
              job_id: job.job_id,
            })
          );
          allCandidates.push(...transformedCandidates);
        }
      } catch (error) {
        throw error
      }
    }

    return allCandidates;
  } catch (error) {
    throw new Error();
  }
}
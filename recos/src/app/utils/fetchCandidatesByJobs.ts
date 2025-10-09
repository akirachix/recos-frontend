import { fetchJobs } from './fetchJobs';
import { fetchJobCandidates } from './fetchJobCandidates';
import { Candidate } from '../hooks/useCandidates';



export async function getAllCandidatesForCompany(companyId: number, syncJobsFirst: boolean = false) {
  try {
    const jobs = await fetchJobs(companyId.toString());
    if (!jobs || jobs.length === 0) {
      return [];
    }
    const allCandidates: Candidate[] = [];
    for (const job of jobs) {
      try {
        const candidates = await fetchJobCandidates(job.job_id.toString());
        
        if (candidates && candidates.length > 0) {
          const transformedCandidates = candidates.map((candidate: any) => ({
            candidate_id: candidate.candidate_id,
            name: candidate.name,
            email: candidate.email,
            phone: candidate.phone,
            state: candidate.state,
            generated_skill_summary: candidate.generated_skill_summary,
            job_title: job.job_title,
            job_id: job.job_id,
          }));
          
          allCandidates.push(...transformedCandidates);
        }
      } catch {
     
      }
    }

    return allCandidates;
  } catch (error) {
    throw new Error("Failed to get all candidates for company: " + (error as Error).message);
  }
}

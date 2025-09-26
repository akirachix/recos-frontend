import { useState, useEffect } from 'react';
import { fetchJobDetails } from '@/app/utils/fetchJobDetails';
import { updateJobState } from '../utils/updateJobState';
import { fetchJobCandidates } from '../utils/fetchJobCandidates';

export type Job = {
  job_id: number;
  company_name: string;
  job_title: string;
  job_description: string;
  created_at: string;
  total_applicants: number;
  status: string;
  posted_at?: string; 
  state?: string; 
  generated_job_summary: string | null;
};

export type Candidate = {
  id: number;
  name: string;
  email: string;
  stage: string;
  interview_status: string;
};

interface RawCandidate {
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
}

export const useFetchJobDetails = (jobId: string) => {
  const [job, setJob] = useState<Job | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const getJobDetails = async () => {
      setLoading(true);
      try {
        const jobData = await fetchJobDetails(jobId);
        const { job: rawJob } = jobData;
        const transformedJob: Job = {
          ...rawJob,
          created_at: new Date(rawJob.posted_at).toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit'
          }),
          status: (rawJob.state || rawJob.status || 'Open').charAt(0).toUpperCase() + (rawJob.state || rawJob.status || 'Open').slice(1),
          total_applicants: rawJob.total_applicants || 0
        };
        setJob(transformedJob);

        const candidateData = await fetchJobCandidates(jobId);
        
        const candidateArray = Array.isArray(candidateData) ? candidateData : [];
        
        const transformedCandidates: Candidate[] = candidateArray.map((c: RawCandidate) => ({
          id: c.candidate_id,
          name: c.name === "False" ? "Not Available" : c.name,
          email: c.email === "False" ? "Not Available" : c.email,
          stage: c.state.charAt(0).toUpperCase() + c.state.slice(1),
          interview_status: 'Not Scheduled' 
        }));
        setCandidates(transformedCandidates);

        setError(null);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      getJobDetails();
    }
  }, [jobId]);

  const handleStateUpdate = async (newState: string) => {
    if (!job) return;
    
    setUpdating(true);
    try {
      const updatedJob = await updateJobState(jobId, newState, job);
      setJob({
        ...job,
        state: updatedJob.state,
        status: updatedJob.state.charAt(0).toUpperCase() + updatedJob.state.slice(1)
      });
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setUpdating(false);
    }
  };

  return { job, candidates, loading, error, updating, handleStateUpdate };
};
import { useState, useEffect } from 'react';
import { Job, Interview, DashboardMetrics, PositionSummary, Candidate } from '@/app/types';
import { fetchJobs } from '../utils/fetchJobs';
import { fetchInterviews } from "../utils/fetchInterview";
import { getAllCandidatesForCompany } from '../utils/fetchCandidatesByJobs';


const getAuthToken = () => {
  if (typeof document !== 'undefined') {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('auth_token='))
      ?.split('=')[1];
  }
  return null;
};


type CandidateWithJob = Candidate & {
  job?: {
    id?: number;
    job_title?: string;
  } | number;
  job_title?: string;
};


type CandidatesResponse = {
  data?: Candidate[];
  candidates?: Candidate[];
} | Candidate[];


type JobsResponse = {
  data?: Job[];
  jobs?: Job[];
} | Job[];


type JobWithId = Job & {
  id?: number;
  job_title?: string;
  state?: string;
};


type ApiJob = Job & {
  jobId?: number;
  job_id?: number;
  title?: string;
  jobTitle?: string;
};


export const useDashboardData = (companyId?: string) => { 
  const [jobs, setJobs] = useState<JobWithId[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [candidates, setCandidates] = useState<CandidateWithJob[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [positionSummary, setPositionSummary] = useState<PositionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      if (!companyId) {
        setError("Company ID is required to fetch dashboard data.");
        setLoading(false);
        return;
      }

      try {
        const token = getAuthToken();
        if (!token) throw new Error("Authentication token is missing");
        const companyIdAsNumber = parseInt(companyId, 10);
        if (isNaN(companyIdAsNumber)) {
            throw new Error("Invalid Company ID provided.");
        }

        const jobsResponse = await fetchJobs(companyId) as JobsResponse;
        let jobsData: JobWithId[] = [];
        
        if (Array.isArray(jobsResponse)) {
          jobsData = jobsResponse as JobWithId[];
        } else if (jobsResponse && typeof jobsResponse === 'object' && 'data' in jobsResponse && Array.isArray(jobsResponse.data)) {
          jobsData = jobsResponse.data;
        } else if (jobsResponse && typeof jobsResponse === 'object' && 'jobs' in jobsResponse && Array.isArray(jobsResponse.jobs)) {
          jobsData = jobsResponse.jobs;
        }
        
       
        const normalizedJobs = jobsData.map((job: ApiJob) => ({
          ...job, 
          id:job.jobId || job.job_id,
          job_title: job.job_title || job.title || job.jobTitle || 'Untitled Position',
          state: job.state || 'open'
        }));
        
        setJobs(normalizedJobs);

        const interviewsResponse = await fetchInterviews(token);
        const interviewsData = Array.isArray(interviewsResponse) ? interviewsResponse : [];
        setInterviews(interviewsData);

        const candidatesResponse = await getAllCandidatesForCompany(companyIdAsNumber, true) as CandidatesResponse;
        let candidatesData: Candidate[] = [];
        
        if (Array.isArray(candidatesResponse)) {
          candidatesData = candidatesResponse;
        } else if (candidatesResponse && typeof candidatesResponse === 'object' && 'data' in candidatesResponse && Array.isArray(candidatesResponse.data)) {
          candidatesData = candidatesResponse.data;
        } else if (candidatesResponse && typeof candidatesResponse === 'object' && 'candidates' in candidatesResponse && Array.isArray(candidatesResponse.candidates)) {
          candidatesData = candidatesResponse.candidates;
        }
        
        const candidatesWithJob: CandidateWithJob[] = candidatesData.map((candidate: Candidate) => {
          return {
            ...candidate,
            candidate_id: candidate.candidate_id,
            name: candidate.name || 'Unnamed Candidate',
            email: candidate.email || '',
          };
        });
        
        setCandidates(candidatesWithJob);
        
        const openPositions = normalizedJobs.filter((job: JobWithId) => job.state === 'open').length;
        const completedInterviews = interviewsData.length;
        const totalCandidates = candidatesWithJob.length; 

        setMetrics({
          totalCandidates,
          openPositions,
          avgHiringCycle: 0,
          completedInterviews,
        });

        const positionSummaryData = normalizedJobs
          .filter((job: JobWithId) => job.state === 'open')
          .map((job: JobWithId) => ({
            name: job.job_title || 'Untitled Position',
            value: 0,
          }));

        setPositionSummary(positionSummaryData);
      } catch (error) {
        console.error("Dashboard data fetch error:", error);
        setError((error as Error).message || "An error occurred while fetching dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId]); 

  return {
    jobs,
    interviews,
    candidates,
    metrics,
    positionSummary,
    loading,
    error,
  };
};
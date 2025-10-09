import { useState, useEffect } from 'react';
import { Job, Interview, DashboardMetrics, PositionSummary, Candidate } from '@/app/types';
import { fetchJobs } from '../utils/fetchJobs';
import { fetchInterviews } from "../utils/fetchInterview";
import { fetchJobCandidates } from '../utils/fetchJobCandidates';

const getAuthToken = () => {
  if (typeof document !== 'undefined') {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('auth_token='))
      ?.split('=')[1];
  }
  return null;
};

export const useDashboardData = (companyId?: string) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [positionSummary, setPositionSummary] = useState<PositionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = getAuthToken();
        if (!token) throw new Error("Authentication token is missing");
        const jobsResponse = await fetchJobs(companyId);
        const interviewsResponse = await fetchInterviews(token);
        const candidatesResponse = companyId !== undefined && companyId !== null
          ? await fetchJobCandidates((companyId))
          : [];
          
        const jobsData = Array.isArray(jobsResponse) ? jobsResponse : [];
        const interviewsData = Array.isArray(interviewsResponse) ? interviewsResponse : [];
        const candidatesData = Array.isArray(candidatesResponse) ? candidatesResponse : [];

        console.log("Jobs data:", jobsData.length);
        console.log("Interviews data:", interviewsData.length);
        console.log("Candidates data:", candidatesData.length);

        setJobs(jobsData);
        setInterviews(interviewsData);
        setCandidates(candidatesData);

        const openPositions = jobsData.filter((job: Job) => job.state === 'open').length;
        const completedInterviews = interviewsData.length;
        const totalCandidates = candidatesData.length;

        setMetrics({
          totalCandidates,
          openPositions,
          avgHiringCycle: 0, 
          completedInterviews,
        });

        const positionSummaryData = jobsData
          .filter((job: Job) => job.state === 'open')
          .map((job: Job) => ({
            name: job.job_title,
            value: 0, 
          }));

        setPositionSummary(positionSummaryData);
      } catch (error) {
        console.error("Error in useDashboardData:", error);
        setError((error as Error).message);
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
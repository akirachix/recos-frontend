
import { useState, useEffect } from 'react';
import { Job, Interview, DashboardMetrics, PositionSummary } from '@/app/types';
import { fetchJobs } from '../utils/fetchJobs';
import { fetchInterviews } from '../utils/fetchInterview';

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
        if (!token) {
          throw new Error('Authentication required');
        }
        const jobsResponse = await fetchJobs(companyId);
        const interviewsResponse = await fetchInterviews(token);
        const jobsData = Array.isArray(jobsResponse) ? jobsResponse : [];
        const interviewsData = Array.isArray(interviewsResponse) ? interviewsResponse : [];
        setJobs(jobsData);
        setInterviews(interviewsData);
        const openPositions = jobsData.filter((job: Job) => job.state === 'open').length;
        const completedInterviews = interviewsData.length;
        setMetrics({
          totalCandidates: 0,
          openPositions,
          avgHiringCycle: 0, 
          completedInterviews
        });
        const positionSummaryData = jobsData
          .filter((job: Job) => job.state === 'open')
          .map((job: Job) => ({
            name: job.job_title,
            value: 0 
          }));
        setPositionSummary(positionSummaryData);
      } catch (error) {
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
    metrics,
    positionSummary,
    loading,
    error
  };
};

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

        console.log("Fetching data for companyId:", companyIdAsNumber);
        
        const jobsResponse = await fetchJobs(companyId);
        const jobsData = Array.isArray(jobsResponse) ? jobsResponse : [];
        setJobs(jobsData);

        const interviewsResponse = await fetchInterviews(token);
        const interviewsData = Array.isArray(interviewsResponse) ? interviewsResponse : [];
        setInterviews(interviewsData);

        const candidatesData = await getAllCandidatesForCompany(companyIdAsNumber, true);
        
        let finalCandidatesData: Candidate[] = [];
        if (Array.isArray(candidatesData)) {
          finalCandidatesData = candidatesData;
        } else if (candidatesData && Array.isArray(candidatesData.data)) {
          finalCandidatesData = candidatesData.data;
        } else if (candidatesData && Array.isArray(candidatesData.candidates)) {
          finalCandidatesData = candidatesData.candidates;
        } else {
          console.error("API response for candidates is not a recognized array format. Setting to empty array.");
        }
        setCandidates(finalCandidatesData);
  
        const openPositions = jobsData.filter((job: Job) => job.state === 'open').length;
        const completedInterviews = interviewsData.length;
        const totalCandidates = finalCandidatesData.length; 

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
        console.error("Dashboard data fetch error:", error);
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
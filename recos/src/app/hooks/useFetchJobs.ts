import { useState, useEffect, useCallback } from 'react';
import { fetchJobs, syncJobs } from '@/app/utils/fetchJobs';

export type Job = {
  job_id: number;
  company_name: string;
  job_title: string;
  applicants: number;
  ai_shortlisted: number;
  posted_at: string;
  status: string;
};

interface UseFetchJobsOptions {
  companyId?: string;
  syncOnMount?: boolean;
}

export const useFetchJobs = (options: UseFetchJobsOptions = {}) => {
  const { companyId, syncOnMount = false } = options;
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getJobs = useCallback(async () => {
    setLoading(true);
    try {
      const jobsData = await fetchJobs(companyId);
      setJobs(Array.isArray(jobsData) ? jobsData : []);
      setError(null);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  const syncAndFetchJobs = useCallback(async () => {
    if (!companyId) {
      setError('Company ID is required to sync jobs');
      return;
    }

    setSyncing(true);
    try {
      await syncJobs(companyId);
      await getJobs();
      setError(null);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setSyncing(false);
    }
  }, [companyId, getJobs]);

  useEffect(() => {
    if (syncOnMount && companyId) {
      syncAndFetchJobs();
    } else {
      getJobs();
    }
  }, [companyId, syncOnMount, syncAndFetchJobs, getJobs]);

  return { 
    jobs, 
    loading, 
    syncing,
    error, 
    refetch: getJobs,
    syncAndFetchJobs 
  };
};

import { useState, useEffect, ReactNode } from "react";
import { getAllCandidatesForCompany} from "../utils/fetchCandidatesByJobs";

export type Candidate = {
  initialMatch: ReactNode;
  position: ReactNode;
  candidate_id: number;
  name: string;
  email: string;
  phone: string;
  state: string;
  generated_skill_summary?: string;
  job_title: string;
  job_id: number;
};

export default function useCandidates(companyId: number, syncBeforeFetch: boolean = false) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyId) return;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const data: Candidate[] = await getAllCandidatesForCompany(companyId, syncBeforeFetch);
        setCandidates(data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [companyId, syncBeforeFetch]);

  return { candidates, loading, error };
}
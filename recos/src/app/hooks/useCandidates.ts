import { useState, useEffect, ReactNode } from "react";
import { getAllCandidatesForCompany, CandidateWithJobDetails } from "../utils/fetchCandidatesByJobs";

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
  data: string;
};

export default function useCandidates(companyId: number, syncBeforeFetch: boolean = false) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!companyId) {
      setCandidates([]);
      setLoading(false);
      setError(null);
      return;
    }

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const apiResult: CandidateWithJobDetails[] = await getAllCandidatesForCompany(
          companyId,
          syncBeforeFetch
        );

        const mapped: Candidate[] = apiResult.map((c) => ({
          candidate_id: c.candidate_id,
          name: c.name,
          email: c.email,
          phone: c.phone ?? "",
          state: c.state ?? "",
          generated_skill_summary: c.generated_skill_summary,
          job_title: c.job_title,
          job_id: c.job_id,
          initialMatch: null,
          position: c.job_title,
          data: JSON.stringify(c),
        }));

        if (!cancelled) {
          setCandidates(mapped);
        }
      } catch (err) {
        if (!cancelled) {
          setError((err as Error)?.message ?? String(err));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [companyId, syncBeforeFetch]);

  return { candidates, loading, error };
}

import { useState, useEffect } from "react";
import { fetchCandidates } from "../utils/fetchCandidates";
import { syncCandidates } from "../utils/syncCandidates";

export type Candidate = {
  candidate_id: number;
  name: string;
  job_title: string;  
  state: string;
  generated_skill_summary?: string;
  email: string;
  phone: string;
  attachments: {
    attachment_id: number;
    name: string;
    original_filename: string;
    download_url: string;
  }[];
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
        if (syncBeforeFetch) {
          await syncCandidates(companyId);
        }
        const data: Candidate[] = await fetchCandidates(companyId);
        setCandidates(data);
      } catch (error: any) {
        setError(error.message ?? "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [companyId, syncBeforeFetch]);

  return { candidates, loading, error };
}

import { useState, useEffect } from "react";
import { fetchInterviewById } from "../utils/fetchInterviewById";
interface InterviewDetails {
  id: number;
  candidate_id: number;
  candidate_name: string;
  candidate_email: string;
  recruiter_name: string;
  recruiter_email: string;
  scheduled_at: string;
  created_at?: string;
  description?: string;
  duration: number;
  status: string;
  interview_link?: string;
  google_calendar_link?: string;
}
export function useInterviewDetails(
  selectedInterviewId: number | null,
  token: string | null,
  apiBaseUrl: string | undefined,
  modalOpen: boolean
) {
  const [selectedInterview, setSelectedInterview] = useState<InterviewDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailError, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDetails() {
      if (!modalOpen || selectedInterviewId === null) {
        setSelectedInterview(null);
        setLoadingDetails(false);
        setError(null);
        return;
      }
      setLoadingDetails(true);
      setError(null);
      try {
        const data = await fetchInterviewById(token, selectedInterviewId);
        setSelectedInterview(data);
      } catch (error) {
        setError((error as Error).message);
        setSelectedInterview(null);
      } finally {
        setLoadingDetails(false);
      }
    }
    fetchDetails();
  }, [selectedInterviewId, token, apiBaseUrl, modalOpen]);

  return {
    selectedInterview,
    loadingDetails,
    detailError,
    setSelectedInterview,
    setLoadingDetails,
    setError,
  };
}

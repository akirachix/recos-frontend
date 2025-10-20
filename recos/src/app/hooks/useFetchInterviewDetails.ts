import { useState, useEffect } from "react";
import { fetchInterviewById } from "../utils/fetchInterviewById";

interface InterviewDetails {
  interview_id: number;
  candidate: number;
  recruiter: number;
  candidate_name: string;
  candidate_email: string;
  recruiter_name: string;
  recruiter_email: string;
  title: string;
  description?: string;
  scheduled_at: string;
  duration: number;
  end_time: string;
  interview_link?: string;
  required_preparation?: string;
  status: string;
  google_event_id?: string;
  google_calendar_link?: string;
  send_calendar_invite: boolean;
  is_upcoming: boolean;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  calendar_event?: {
    event_id: string;
    meet_link: string;
    calendar_link: string;
    ai_join_url?: string;
  };
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
import { useState, useEffect } from "react";
import { fetchCreateInterview } from "../utils/fetchCreateInterview";

export interface CreateInterviewPayload {
  title?: string;
  candidate_email?: string;
  candidate_name?: string;
  candidate?: number | null;
  recruiter?: number | null;
  scheduled_at?: string;
  duration?: number;
  description?: string;
}


export interface Interview {
  calendar_link: any;
  google_calendar_link: any;
  calendar_event: any;
  meet_link: number;
  interview_id: number;
  title: string;
  candidate_email: string;
  candidate_name: string;
  candidate: number;
  recruiter: number;
  scheduled_at: string; 
  duration: number;
  description?: string;
}
export interface CreateInterviewResponse {
  interview: Interview;
}

export const useCreateInterview = (
  initial: Partial<CreateInterviewPayload> = {},
  profileId?: number,
  scheduledDate?: string,
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [title, setTitle] = useState(initial.title ?? "");
  const [candidateEmail, setCandidateEmail] = useState(initial.candidate_email ?? "");
  const [candidateName, setCandidateName] = useState(initial.candidate_name ?? "");
  const [candidateId, setCandidateId] = useState<number | null>(initial.candidate ?? null);
  const [recruiterId, setRecruiterId] = useState<number | null>(initial.recruiter ?? profileId ?? null);
  const [scheduledAt, setScheduledAt] = useState(
    initial.scheduled_at ? initial.scheduled_at.slice(0, 16) : scheduledDate ?? ""
  );
  const [duration, setDuration] = useState(initial.duration ?? 60);
  const [description, setDescription] = useState(initial.description ?? "");

  useEffect(() => {
    setTitle(initial.title ?? "");
    setCandidateEmail(initial.candidate_email ?? "");
    setCandidateName(initial.candidate_name ?? "");
    setCandidateId(initial.candidate ?? null);
    setRecruiterId(initial.recruiter ?? profileId ?? null);
    setScheduledAt(initial.scheduled_at ? initial.scheduled_at.slice(0, 16) : scheduledDate ?? "");
    setDuration(initial.duration ?? 60);
    setDescription(initial.description ?? "");
  }, [initial, profileId, scheduledDate]);

  useEffect(() => {
    if (profileId !== undefined && profileId !== null) {
      setRecruiterId(profileId);
    }
  }, [profileId]);

  useEffect(() => {
    if (scheduledDate) {
      setScheduledAt(scheduledDate);
    }
  }, [scheduledDate]);

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setError(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  const reset = () => {
    setTitle("");
    setCandidateEmail("");
    setCandidateName("");
    setCandidateId(null);
    setRecruiterId(profileId ?? null);
    setScheduledAt(scheduledDate ?? "");
    setDuration(60);
    setDescription("");
    setError(null);
    setLoading(false);
    setSuccessMessage(null);
  };

  const createInterview = async (payload: CreateInterviewPayload): Promise<CreateInterviewResponse> => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCreateInterview(payload);
      return data;
    } catch (error) {
      setError(error as Error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    successMessage,
    createInterview,
    title,
    setTitle,
    candidateEmail,
    setCandidateEmail,
    candidateName,
    setCandidateName,
    candidateId,
    setCandidateId,
    recruiterId,
    setRecruiterId,
    scheduledAt,
    setScheduledAt,
    duration,
    setDuration,
    description,
    setDescription,
    reset,
  };
};
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

export const useCreateInterview = (initial: Partial<CreateInterviewPayload> = {}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const [title, setTitle] = useState<string>(initial.title ?? "");
  const [candidateEmail, setCandidateEmail] = useState<string>(initial.candidate_email ?? "");
  const [candidateName, setCandidateName] = useState<string>(initial.candidate_name ?? "");
  const [candidateId, setCandidateId] = useState<number | null>(initial.candidate ?? null);
  const [recruiterId, setRecruiterId] = useState<number | null>(initial.recruiter ?? null);
  const [scheduledAt, setScheduledAt] = useState<string>(
    initial.scheduled_at ? initial.scheduled_at.slice(0, 16) : ""
  );
  const [duration, setDuration] = useState<number>(initial.duration ?? 60);
  const [description, setDescription] = useState<string>(initial.description ?? "");

  useEffect(() => {
    setTitle(initial.title ?? "");
    setCandidateEmail(initial.candidate_email ?? "");
    setCandidateName(initial.candidate_name ?? "");
    setCandidateId(initial.candidate ?? null);
    setRecruiterId(initial.recruiter ?? null);
    setScheduledAt(initial.scheduled_at ? initial.scheduled_at.slice(0, 16) : "");
    setDuration(initial.duration ?? 60);
    setDescription(initial.description ?? "");
  }, [
    initial.title,
    initial.candidate_email,
    initial.candidate_name,
    initial.candidate,
    initial.recruiter,
    initial.scheduled_at,
    initial.duration,
    initial.description,
  ]);

  const reset = () => {
    setTitle("");
    setCandidateEmail("");
    setCandidateName("");
    setCandidateId(null);
    setRecruiterId(null);
    setScheduledAt("");
    setDuration(60);
    setDescription("");
    setError(null);
    setLoading(false);
  };

  const createInterview = async (payload: CreateInterviewPayload): Promise<object> => {
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
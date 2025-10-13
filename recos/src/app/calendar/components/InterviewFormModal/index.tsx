'use client';

import React, { useState, useCallback, useEffect } from "react";
import { CreateInterviewPayload, useCreateInterview } from "@/app/hooks/useCreateInterview";
import { Candidate, Job } from "@/app/types";
import { getAllCandidatesForCompany } from "@/app/utils/fetchCandidatesByJobs";
import { fetchJobs } from "@/app/utils/fetchJobs";
import useFetchProfile from "@/app/hooks/useFetchProfile";

interface InterviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateInterviewPayload) => Promise<void>;
  initialData: CreateInterviewPayload;
  scheduledDate?: string;
}

type CandidateWithJob = Candidate & {
  job?: { id?: number; job_title?: string } | number;
  job_title?: string;
};

type CandidatesResponse = { data?: Candidate[]; candidates?: Candidate[] } | Candidate[];
type JobsResponse = { data?: Job[]; jobs?: Job[] } | Job[];
type JobWithId = Job & { id?: number; job_title?: string };

function hasProperty<T extends string | number | symbol>(object: unknown, prop: T): object is Record<T, unknown> {
  return typeof object === "object" && object !== null && prop in object;
}

const getCompanyId = (): string | null => {
  if (typeof window !== "undefined") {
    const storedId = localStorage.getItem("companyId");
    if (storedId) return storedId;
  }
  return "1";
};

export default function InterviewFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  scheduledDate,
}: InterviewFormModalProps) {
  const { user: profile } = useFetchProfile();

  const {
    title,
    setTitle,
    candidateEmail,
    setCandidateEmail,
    candidateName,
    setCandidateName,
    candidateId,
    setCandidateId,
    recruiterId,
    scheduledAt,
    setScheduledAt,
    duration,
    setDuration,
    description,
    setDescription,
    createInterview,
    reset,
    error: hookError,
    successMessage, 
  } = useCreateInterview(initialData, profile?.id, scheduledDate);

  const [candidates, setCandidates] = useState<CandidateWithJob[]>([]);
  const [jobs, setJobs] = useState<JobWithId[]>([]);
  const [candidateJobTitle, setCandidateJobTitle] = useState<string>("");
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [candidatesError, setCandidatesError] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);

  const [showSuccess, setShowSuccess] = useState(false);

  const fetchCompanyCandidates = useCallback(async () => {
    if (!companyId) return;
    setLoadingCandidates(true);
    setCandidatesError(null);
    try {
      const companyIdNum = parseInt(companyId, 10);
      if (isNaN(companyIdNum)) throw new Error(`Invalid Company ID: ${companyId}`);

      const candidatesData = (await getAllCandidatesForCompany(companyIdNum, true)) as CandidatesResponse;
      const jobsResponse = (await fetchJobs(companyId)) as JobsResponse;

      let finalCandidatesData: Candidate[] = [];
      if (Array.isArray(candidatesData)) finalCandidatesData = candidatesData;
      else if (hasProperty(candidatesData, "data") && Array.isArray(candidatesData.data)) finalCandidatesData = candidatesData.data;
      else if (hasProperty(candidatesData, "candidates") && Array.isArray(candidatesData.candidates)) finalCandidatesData = candidatesData.candidates;

      setCandidates(finalCandidatesData.filter(c => c && c.candidate_id != null));

      let finalJobsData: Job[] = [];
      if (Array.isArray(jobsResponse)) finalJobsData = jobsResponse;
      else if (hasProperty(jobsResponse, "data") && Array.isArray(jobsResponse.data)) finalJobsData = jobsResponse.data;
      else if (hasProperty(jobsResponse, "jobs") && Array.isArray(jobsResponse.jobs)) finalJobsData = jobsResponse.jobs;

      setJobs(finalJobsData.map(j => j as JobWithId));
    } catch (err) {
      setCandidatesError((err as Error).message || "Failed to load candidates");
    } finally {
      setLoadingCandidates(false);
    }
  }, [companyId]);

  const updateCompanyId = useCallback(() => {
    const id = getCompanyId();
    if (id !== companyId) {
      setCompanyId(id);
      reset();
      setCandidateId(null);
      setCandidateEmail("");
      setCandidateName("");
      setCandidateJobTitle("");
      setSelectedJobId(null);
      setCandidates([]);
      setJobs([]);
      setError(null);
      setShowSuccess(false);
    }
  }, [companyId, reset]);

  useEffect(() => {
    updateCompanyId();
  }, [updateCompanyId]);

  useEffect(() => {
    if (isOpen && companyId) {
      fetchCompanyCandidates();
    }
  }, [isOpen, companyId, fetchCompanyCandidates]);

  useEffect(() => {
    if (successMessage) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleCandidateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const candidate = candidates.find(c => c.candidate_id?.toString() === selectedId);
    if (candidate) {
      setCandidateId(candidate.candidate_id);
      setCandidateEmail(candidate.email || "");
      setCandidateName(candidate.name || "");

      let jobTitle = "Applied for Job";
      if (candidate.job && typeof candidate.job === "object" && "job_title" in candidate.job) {
        jobTitle = (candidate.job as { job_title?: string }).job_title ?? jobTitle;
      } else if (candidate.job_title) {
        jobTitle = candidate.job_title;
      }

      let jobId: number | null = null;
      if (typeof candidate.job === "number") {
        jobId = candidate.job;
      }

      setSelectedJobId(jobId);
      setCandidateJobTitle(jobTitle);
    } else {
      setCandidateId(null);
      setCandidateEmail("");
      setCandidateName("");
      setSelectedJobId(null);
      setCandidateJobTitle("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setShowSuccess(false);

    if (!recruiterId || isNaN(Number(recruiterId)) || recruiterId <= 0) {
      setError("Recruiter ID is missing or invalid.");
      return;
    }
    if (!scheduledAt || new Date(scheduledAt) <= new Date()) {
      setError("Interview must be scheduled for a future date and time.");
      return;
    }

    setSaving(true);
    try {
      const payload: CreateInterviewPayload = {
        title,
        candidate_email: candidateEmail,
        candidate_name: candidateName,
        candidate: candidateId,
        recruiter: recruiterId,
        scheduled_at: new Date(scheduledAt).toISOString(),
        duration,
        description,
      };

      const response = await createInterview(payload);

   

      await onSave(payload);
      reset();
      onClose();
    } catch (error) {
      setError((error as Error).message || "Failed to save interview.");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 xl:pl-80">
      <div className="border-white bg-white rounded-2xl p-5 pb-5 max-w-[900px] w-full mx-auto sm:max-w-xl md:max-w-3xl lg:max-w-5xl">
        <form onSubmit={handleSubmit} className="p-4 rounded-lg shadow-xl max-w-7xl flex flex-col space-y-4">
          <h2 className="text-2xl font-bold text-black pb-5">{initialData ? "Edit Interview" : "Create Interview"}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-medium text-black mb-2">Title</label>
              <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg" />
            </div>
            <div>
              <label className="block text-lg font-medium text-black mb-2">Select Candidate</label>
              {loadingCandidates ? (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md text-lg bg-gray-50">Loading candidates...</div>
              ) : candidatesError ? (
                <div className="w-full px-3 py-2 border border-red-300 rounded-md text-lg text-red-600 bg-red-50">Error: {candidatesError}</div>
              ) : (
                <select value={candidateId?.toString() || ""} onChange={handleCandidateChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg">
                  <option value="">Select a candidate</option>
                  {candidates.map(candidate => (
                    <option key={candidate.candidate_id} value={candidate.candidate_id?.toString()}>{candidate.name || "Unnamed Candidate"}</option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <label className="block text-lg font-medium text-black mb-2">Job (Applied For)</label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-lg">{candidateJobTitle || "Auto-populated from candidate"}</div>
            </div>
            <div>
              <label className="block text-lg font-medium text-black mb-2">Recruiter</label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-lg">
                {profile ? (
                  <p>{profile.first_name} {profile.last_name}</p>
                ) : (
                  <p className="text-gray-500">Recruiter info loading...</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-lg font-medium text-black mb-2">Candidate Email</label>
              <input
                type="email"
                value={candidateEmail}
                readOnly
                placeholder="Auto-populated from selection"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-black mb-2">Scheduled At</label>
              <input type="datetime-local" required value={scheduledAt} min={new Date().toISOString().slice(0, 16)} onChange={e => setScheduledAt(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg cursor-pointer" />
            </div>
            <div>
              <label className="block text-lg font-medium text-black mb-2">Duration (minutes)</label>
              <input type="number" min={1} required value={duration} onChange={e => setDuration(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg" />
            </div>
            <div className="col-span-1 sm:col-span-2">
              <label className="block text-lg font-medium text-black mb-2">Description</label>
              <textarea rows={2} value={description} onChange={e => setDescription(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg" />
            </div>
          </div>

          {error && <p className="text-red-600 text-lg mt-2" role="alert">{error}</p>}
          {(hookError && !error) && <p className="text-red-600 text-lg mt-2" role="alert">{hookError.message}</p>}
          {showSuccess && <p className="text-green-600 text-sm mt-2" role="alert">{successMessage}</p>}

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} disabled={saving} className="px-6 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300 transition-colors text-lg cursor-pointer">Cancel</button>
            <button type="submit" disabled={saving} className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-lg disabled:bg-purple-400 cursor-pointer">{saving ? "Saving..." : "Save Interview"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

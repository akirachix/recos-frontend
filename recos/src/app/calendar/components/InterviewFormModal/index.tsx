'use client';

import React, { useState, useCallback, useEffect, useRef } from "react";
import { CreateInterviewPayload, useCreateInterview } from "@/app/hooks/useCreateInterview";
import { Candidate, Interview, Job } from "@/app/types";
import { getAllCandidatesForCompany } from "@/app/utils/fetchCandidatesByJobs";
import { fetchJobs } from "@/app/utils/fetchJobs";
import useFetchProfile from "@/app/hooks/useFetchProfile";
import { useParams } from "next/navigation";
import { useCompany } from "@/app/context/CompanyContext";

interface InterviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Interview | CreateInterviewPayload) => Promise<void>; 
  initialData: CreateInterviewPayload;
  scheduledDate?: string;
}
interface Company {
  company_id: string;
  company_name: string;
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

const useCompanyId = (): string | null => {
  const params = useParams();
  const { selectedCompany } = useCompany();
  let companyId = params.companyId;
  if (!companyId && selectedCompany) {
    companyId = selectedCompany.company_id?.toString();
  }

  if (typeof companyId === 'string' && companyId.trim() !== '') {
    return companyId;
  }
  
  return null;
};

export default function InterviewFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  scheduledDate,
}: InterviewFormModalProps) {
  const companyId = useCompanyId();
  const { user: profile } = useFetchProfile();
  const { selectedCompany, companies, setSelectedCompany } = useCompany();
  
  const hasInitializedRef = useRef(false);
  const prevCompanyIdRef = useRef<string | null>(null);

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
  const [showSuccess, setShowSuccess] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  const fetchCompanyCandidates = useCallback(async () => {
    if (!companyId) {
      setCandidatesError("Company ID is required");
      return;
    }
    
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

  const resetFormFields = useCallback(() => {
    setCandidateId(null);
    setCandidateEmail("");
    setCandidateName("");
    setCandidateJobTitle("");
    setSelectedJobId(null);
    setCandidates([]);
    setJobs([]);
    setError(null);
    setShowSuccess(false);
    setDebugInfo(null);
  }, []);

  const handleCompanySelect = useCallback((company: Company) => {
    setSelectedCompany(company);
  }, [setSelectedCompany]);

  const companiesList = React.useMemo(() => {
    return companies.map((company) => (
      <li
        key={company.company_id}
        className={`px-4 py-2 cursor-pointer ${
          selectedCompany?.company_id === company.company_id
            ? "bg-purple-700"
            : "hover:bg-purple-700"
        }`}
        onClick={() => handleCompanySelect(company)}
      >
        {company.company_name}
      </li>
    ));
  }, [companies, selectedCompany, handleCompanySelect]);

  useEffect(() => {
    const justOpened = isOpen && !hasInitializedRef.current;
    const companyIdChanged = companyId !== prevCompanyIdRef.current;
    if (isOpen) hasInitializedRef.current = true;
    prevCompanyIdRef.current = companyId;
    
    if (justOpened || companyIdChanged) {
      resetFormFields();
      if (justOpened) {
        setTimeout(() => reset(), 0);
      }
      
      if (companyId) {
        fetchCompanyCandidates();
      } else {
        setCandidatesError("Company ID is required");
      }
    }
  }, [isOpen, companyId, resetFormFields, fetchCompanyCandidates, reset]);

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
    setDebugInfo(null);
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    
    if (!candidateId && !candidateName.trim()) {
      setError("Candidate selection is required.");
      return;
    }
    
    if (!candidateEmail.trim() || !/^\S+@\S+\.\S+$/.test(candidateEmail)) {
      setError("Valid candidate email is required.");
      return;
    }
    
    if (!recruiterId || isNaN(Number(recruiterId)) || recruiterId <= 0) {
      setError("Recruiter ID is missing or invalid.");
      return;
    }
    
    if (!scheduledAt || new Date(scheduledAt) <= new Date()) {
      setError("Interview must be scheduled for a future date and time.");
      return;
    }
    
    if (!duration || isNaN(Number(duration)) || duration <= 0) {
      setError("Valid duration is required.");
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
      console.log("Interview payload:", payload);
      setDebugInfo(`Creating interview: ${title} for ${candidateName}`);

      const response = await createInterview(payload);
  
    
      if (response && response.interview) {
        await onSave(response.interview);
        setDebugInfo(`Interview created successfully with ID: ${response.interview.interview_id}`);
      } else {
        await onSave(payload);
        setDebugInfo("Interview created with payload data");
      }
    
      setShowSuccess(true);
      setTimeout(() => {
        resetFormFields();
        onClose();
      }, 1500);
    } catch (error) {
      let errorMessage = "Failed to save interview.";
      setError(errorMessage);
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
          
          {!companyId && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              <p className="font-medium">Company ID is required</p>
              <p className="text-sm">Please ensure the company ID is provided in the URL or select a company.</p>
            </div>
          )}
          
       
          {selectedCompany && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-4">
              <p className="font-medium">Selected Company</p>
              <p className="text-sm">{selectedCompany.company_name}</p>
            </div>
          )}
          {!selectedCompany && companies.length > 0 && (
            <div className="mb-4">
              <label className="block text-lg font-medium text-black mb-2">Select Company</label>
              <ul className="border border-gray-300 rounded-md max-h-40 overflow-y-auto">
                {companiesList}
              </ul>
            </div>
          )}
          
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
                <div className="space-y-2">
                  <div className="w-full px-3 py-2 border border-red-300 rounded-md text-lg text-red-600 bg-red-50">Error: {candidatesError}</div>
                  {companyId && (
                    <button 
                      type="button" 
                      onClick={fetchCompanyCandidates}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
                    >
                      Retry
                    </button>
                  )}
                </div>
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
               {showSuccess && <p className="text-green-600 text-sm mt-2" role="alert">Interview created successfully!</p>}
          </div>
       
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} disabled={saving} className="px-6 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300 transition-colors text-lg cursor-pointer">Cancel</button>
            <button type="submit" disabled={saving || !companyId} className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-lg disabled:bg-purple-400 cursor-pointer">{saving ? "Saving..." : "Save Interview"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

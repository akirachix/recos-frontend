"use client";

import React, { useEffect, useState, useCallback } from "react";
import { CreateInterviewPayload, useCreateInterview } from "@/app/hooks/useCreateInterview";
import { Candidate, Job } from "@/app/types";
import { getAllCandidatesForCompany } from "@/app/utils/fetchCandidatesByJobs";
import { fetchJobs } from "@/app/utils/fetchJobs";

interface InterviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateInterviewPayload) => Promise<void>;
  initialData: CreateInterviewPayload;
  scheduledDate?: string;
}

const getCompanyId = (): string | null => {
  if (typeof window !== 'undefined') {
    const storedId = localStorage.getItem('companyId');
    if (storedId) return storedId;
  }
  const fallbackId = '1';
  return fallbackId;
};

export default function InterviewFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  scheduledDate,
}: InterviewFormModalProps) {
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
    setRecruiterId,
    scheduledAt,
    setScheduledAt,
    duration,
    setDuration,
    description,
    setDescription,
    createInterview,
    reset,
  } = useCreateInterview(initialData);

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [selectedJobTitle, setSelectedJobTitle] = useState<string>("");
  const [candidateJobTitle, setCandidateJobTitle] = useState<string>("");

  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [candidatesError, setCandidatesError] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);

  // Function to fetch candidates and jobs
  const fetchCandidatesAndJobs = useCallback(async () => {
    if (!companyId) return;
    
    setLoadingCandidates(true);
    setCandidatesError(null);
    try {
      const companyIdAsNumber = parseInt(companyId, 10);
      if (isNaN(companyIdAsNumber)) throw new Error(`Invalid Company ID format: "${companyId}".`);

      // Use the specific logic requested by the user
      const candidatesData = await getAllCandidatesForCompany(companyIdAsNumber, true);
      const jobsResponse = await fetchJobs(companyId);

      // Process candidates data
      let finalCandidatesData: Candidate[] = [];
      if (Array.isArray(candidatesData)) {
        finalCandidatesData = candidatesData;
      } else if (candidatesData && Array.isArray(candidatesData.data)) {
        finalCandidatesData = candidatesData.data;
      } else if (candidatesData && Array.isArray(candidatesData.candidates)) {
        finalCandidatesData = candidatesData.candidates;
      } else {
        console.error("API response for candidates is not a recognized array format. Setting to empty array.");
      }
      setCandidates(finalCandidatesData);

      // Process jobs data
      let finalJobsData: Job[] = [];
      if (Array.isArray(jobsResponse)) {
        finalJobsData = jobsResponse;
      }
      setJobs(finalJobsData);

    } catch (error: any) {
      console.error("An error occurred while fetching data:", error);
      setCandidatesError(error.message || "An unknown error occurred.");
    } finally {
      setLoadingCandidates(false);
    }
  }, [companyId]);

  // Function to update company ID and reset form
  const updateCompanyId = useCallback(() => {
    const id = getCompanyId();
    if (id !== companyId) {
      console.log("Company ID changed from", companyId, "to", id);
      setCompanyId(id);
      
      // Reset form fields when company changes
      reset();
      setCandidateId(null);
      setCandidateEmail('');
      setCandidateName('');
      setSelectedJobId(null);
      setSelectedJobTitle("");
      setCandidateJobTitle("");
      setCandidates([]); // Clear candidates immediately
      setJobs([]); // Clear jobs immediately
    }
  }, [companyId, reset]);

  // Effect to get the company ID and set up a listener for changes
  useEffect(() => {
    // Initial call
    updateCompanyId();

    // Set up an interval to check for changes to localStorage
    const intervalId = setInterval(updateCompanyId, 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [updateCompanyId]);

  // Effect to fetch candidates and jobs when the modal opens or company changes
  useEffect(() => {
    if (isOpen && companyId) {
      fetchCandidatesAndJobs();
    }
  }, [isOpen, companyId, fetchCandidatesAndJobs]);

  // Effect to set the scheduled date if provided
  useEffect(() => {
    if (scheduledDate) setScheduledAt(scheduledDate);
  }, [scheduledDate, setScheduledAt]);

  const handleCandidateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCandidateId = e.target.value;
    console.log("Selected candidate ID:", selectedCandidateId);
    
    if (selectedCandidateId) {
      const selectedCandidate = candidates.find(c => c.candidate_id.toString() === selectedCandidateId);
      console.log("Found candidate:", selectedCandidate);
      
      if (selectedCandidate) {
        setCandidateId(parseInt(selectedCandidate.candidate_id, 10));
        setCandidateEmail(selectedCandidate.email || '');
        setCandidateName(selectedCandidate.name || '');
        
        let jobTitle = "Applied for Job";
        let jobId = null;
        
        if (selectedCandidate.job && typeof selectedCandidate.job === 'object' && selectedCandidate.job.job_title) {
          jobTitle = selectedCandidate.job.job_title;
          jobId = selectedCandidate.job.id;
          console.log("Found job title in job object:", jobTitle);
        }
        else if (selectedCandidate.job_title) {
          jobTitle = selectedCandidate.job_title;
          console.log("Found job title directly on candidate:", jobTitle);
        }
        else if (selectedCandidate.job && typeof selectedCandidate.job === 'number') {
          jobId = selectedCandidate.job;
          const job = jobs.find(j => j.id === jobId);
          if (job && job.job_title) {
            jobTitle = job.job_title;
            console.log("Found job title by looking up job ID:", jobTitle);
          }
        }
        
        setSelectedJobId(jobId);
        setSelectedJobTitle(jobTitle);
        setCandidateJobTitle(jobTitle);
        
        console.log("Final job title:", jobTitle);
      }
    } else {
      setCandidateId(null);
      setCandidateEmail('');
      setCandidateName('');
      setSelectedJobId(null);
      setSelectedJobTitle("");
      setCandidateJobTitle("");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
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
      await createInterview(payload);
      await onSave(payload);
      reset();
      onClose();
    } catch (error) {
      setError((error as Error).message);
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
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg" />
            </div>
            <div>
              <label className="block text-lg font-medium text-black mb-2">Select Candidate</label>
              {loadingCandidates ? (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md text-lg bg-gray-50">Loading candidates...</div>
              ) : candidatesError ? (
                <div className="w-full px-3 py-2 border border-red-300 rounded-md text-lg text-red-600 bg-red-50">Error: {candidatesError}</div>
              ) : (
                <select value={candidateId?.toString() || ''} onChange={handleCandidateChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg" required>
                  <option value="">Select a candidate</option>
                  {candidates.filter(candidate => candidate && typeof candidate.candidate_id !== 'undefined').map((candidate) => (
                    <option key={candidate.candidate_id} value={candidate.candidate_id.toString()}>
                      {candidate.name || 'Unnamed Candidate'}
                    </option>
                  ))}
                </select>
              )}
            </div>
            
            <div>
              <label className="block text-lg font-medium text-black mb-2">Job (Applied For)</label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-lg">
                {candidateJobTitle ? (
                  <p className="text-lg text-black">{candidateJobTitle}</p>
                ) : (
                  <p className="text-lg text-gray-400">Auto-populated from candidate</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-lg font-medium text-black mb-2">Candidate Email</label>
              <input type="email" value={candidateEmail} onChange={(e) => setCandidateEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-lg" readOnly placeholder="Auto-populated from selection" />
            </div>
   

            <div>
              <label className="block text-lg font-medium text-black mb-2">Scheduled At</label>
              <input type="datetime-local" required value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg" />
            </div>
            
            <div>
              <label className="block text-lg font-medium text-black mb-2">Duration (minutes)</label>
              <input type="number" min={1} required value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg" />
            </div>
            
            <div className="col-span-1 sm:col-span-2">
              <label className="block text-lg font-medium text-black mb-2">Description</label>
              <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg" />
            </div>
          </div>        
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300 transition-colors text-lg" disabled={saving}>Cancel</button>
            <button type="submit" className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-lg disabled:bg-purple-400" disabled={saving}>{saving ? "Saving..." : "Save Interview"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
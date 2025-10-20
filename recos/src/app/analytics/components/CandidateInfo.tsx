
"use client";


import { Candidate } from "@/app/hooks/useCandidates";
import { Job } from "@/app/hooks/useFetchJobs";

interface CandidateInfoProps {
  candidate: Candidate;
  job?: Job | null; 
}

export default function CandidateInfo({ candidate, job }: CandidateInfoProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{candidate.name}</h2>
          <p className="text-gray-600 mt-1">
            {job ? job.job_title : candidate.job_title || "Position not specified"}
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end mb-2">
            <span className="text-sm text-gray-500 mr-2">Initial Match</span>
            <span className="text-lg font-semibold text-gray-800">85%</span>
          </div>
          <div className="flex items-center justify-end">
            <span className="text-sm text-gray-500 mr-2">Final Match</span>
            <span className="text-lg font-semibold text-green-600">90%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
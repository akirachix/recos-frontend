"use client";

import React, { useState, useEffect } from "react";
import useCandidates, { Candidate } from "../../hooks/useCandidates";
import ClientLayout from "@/app/shared-components/ClientLayout";
import { useParams } from "next/navigation";


function capitalizeName(name: string) {
  return name
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}


interface CandidatesPageProps {
  selectedCompanyId: number;
}

export function CandidatesPage({ selectedCompanyId }: CandidatesPageProps) {
  const { candidates, loading, error } = useCandidates(selectedCompanyId, true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const filteredCandidates = candidates.filter((candidate) =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (Array.isArray(filteredCandidates) && filteredCandidates.length > 0 && !selectedCandidate) {
      setSelectedCandidate(filteredCandidates[0]);
    } else if (filteredCandidates.length === 0) {
      setSelectedCandidate(null);
    }
  }, [filteredCandidates, selectedCandidate]);

  return (
    <ClientLayout>
      <main className="flex gap-8 min-h-[600px] h-[80vh] w-full px-6 py-4 bg-gray-50">
        <div className="w-1/2 bg-white rounded-lg shadow-xl p-5 flex flex-col max-h-full">
          <h1 className="text-2xl font-bold mb-4 text-gray-900">List of Candidates</h1>
          <input
            type="text"
            placeholder="Search candidates by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-purple-600 rounded-md py-2 px-3 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <div
            data-testid="candidate-list"
            className="overflow-y-auto flex-1 space-y-2"
          >
            {loading ? (
              <div className="text-center text-gray-600 mt-20">Loading candidates...</div>
            ) : error ? (
              <div className="text-red-600 text-center mt-20">Error: {error}</div>
            ) : filteredCandidates.length === 0 ? (
              <div className="text-center text-gray-500 mt-20">No candidates found.</div>
            ) : (
              filteredCandidates.map((candidate: Candidate) => (
                <div
                  key={candidate.candidate_id}
                  onClick={() => setSelectedCandidate(candidate)}
                  className={`cursor-pointer rounded-md p-4 transition-colors ${
                    selectedCandidate?.candidate_id === candidate.candidate_id
                      ? "bg-purple-300"
                      : "hover:bg-purple-100"
                  }`}
                >
                  <p className="font-semibold text-gray-900">{capitalizeName(candidate.name)}</p>
                  <p className="text-sm text-gray-700">{candidate.job_title ?? "Applied for Job"}</p>
                  <p className="text-xs text-gray-500 mt-1">Status: {candidate.state ?? "N/A"}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {selectedCandidate && !loading && !error && (
          <div className="flex-1 bg-white rounded-lg shadow-xl p-8 overflow-visible border border-purple-300">
           <h2 className="text-3xl font-bold mb-6 text-gray-900">{capitalizeName(selectedCandidate.name)}</h2>

            <section className="mb-10">
              <h3 className="font-bold mb-3 text-purple-700">About</h3>
              <p className="text-gray-800 text-base">
                {selectedCandidate.generated_skill_summary ?? "No details available."}
              </p>
            </section>

            <section className="mb-10">
              <h3 className="font-bold mb-3 text-purple-700">Contact</h3>
              <div className="text-gray-800 mb-1">Email: {selectedCandidate.email ?? "N/A"}</div>
              <div className="text-gray-800">Phone: {selectedCandidate.phone ?? "N/A"}</div>
            </section>

            <section>
              <h3 className="font-bold mb-3 text-purple-700">Resume</h3>
              {selectedCandidate.attachments && selectedCandidate.attachments.length > 0 ? (
                selectedCandidate.attachments.map((attachment) => (
                  <a
                    key={attachment.attachment_id}
                    href={attachment.download_url}
                    download
                    className="text-gray-900 hover:underline block mb-1"
                  >
                    {attachment.original_filename || attachment.name}
                  </a>
                ))
              ) : (
                <p className="text-gray-900">No resumes uploaded.</p>
              )}
            </section>
          </div>
        )}
      </main>
    </ClientLayout>
  );
}

export default function CandidatesRoutePage() {
  const { companyId } = useParams();
  const numericCompanyId = Number(companyId);

  return <CandidatesPage selectedCompanyId={numericCompanyId} />;
}

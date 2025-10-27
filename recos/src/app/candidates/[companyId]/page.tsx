"use client";

import React, { useState, useEffect, useMemo } from "react";
import useCandidates, { Candidate } from "../../hooks/useCandidates";
import ClientLayout from "@/app/shared-components/ClientLayout";
import { useParams, useRouter } from "next/navigation";
import { parseSkillSummary, ParsedSummary } from "../../utils/parseSkillSummary";

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

const SummarySection: React.FC<{ title: string; content: string }> = ({ title, content }) => (
  <section className="mb-6">
    <h3 className="font-bold mb-2 text-purple-700">{title}</h3>
    <p className="text-gray-800 text-sm whitespace-pre-wrap">{content}</p>
  </section>
);

export function CandidatesPage({ selectedCompanyId }: CandidatesPageProps) {
  const { candidates, loading, error } = useCandidates(selectedCompanyId, true);
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const filteredCandidates = useMemo(
    () =>
      Array.isArray(candidates)
        ? candidates.filter((candidate) =>
            candidate.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : [],
    [candidates, searchTerm]
  );

  useEffect(() => {
    if (Array.isArray(filteredCandidates) && filteredCandidates.length > 0 && !selectedCandidate) {
      setSelectedCandidate(filteredCandidates[0]);
    } else if (filteredCandidates.length === 0) {
      setSelectedCandidate(null);
    }
  }, [filteredCandidates, selectedCandidate]);

  const parsedSummary: ParsedSummary = parseSkillSummary(selectedCandidate?.generated_skill_summary);

  const handleViewInterviewPlan = () => {
    router.push('/analytics');
  };

  return (
    <ClientLayout>
      <div className="flex justify-end px-6 py-4 bg-gray-50">
        <button
          onClick={handleViewInterviewPlan}
          className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          View Interview Plan
        </button>
      </div>

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

          <div className="overflow-y-auto flex-1 space-y-2">
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
          <div className="flex-1 bg-white rounded-lg shadow-xl p-6 overflow-hidden border border-purple-300 flex flex-col">
            <div className="overflow-y-auto flex-grow">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">{capitalizeName(selectedCandidate.name)}</h2>

              {parsedSummary["SKILLS SUMMARY"] && (
                <SummarySection title="About" content={parsedSummary["SKILLS SUMMARY"]} />
              )}
              {parsedSummary["KEY SKILLS"] && (
                <SummarySection title="Skills" content={parsedSummary["KEY SKILLS"]} />
              )}
              {parsedSummary["EXPERIENCE"] && (
                <SummarySection title="Experience" content={parsedSummary["EXPERIENCE"]} />
              )}
              {parsedSummary["EDUCATION"] && (
                <SummarySection title="Education" content={parsedSummary["EDUCATION"]} />
              )}
              {parsedSummary["ADDITIONAL QUALIFICATIONS"] && (
                <SummarySection title="Additional Qualifications" content={parsedSummary["ADDITIONAL QUALIFICATIONS"]} />
              )}

              <section className="mb-6">
                <h3 className="font-bold mb-2 text-purple-700">Contact</h3>
                <div className="text-gray-800 mb-1 text-sm">Email: {selectedCandidate.email ?? "N/A"}</div>
                <div className="text-gray-800 text-sm">Phone: {selectedCandidate.phone ?? "N/A"}</div>
              </section>
            </div>
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
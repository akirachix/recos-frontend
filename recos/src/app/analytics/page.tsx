"use client";

import ClientLayout from "../shared-components/ClientLayout";
import AboutSection from "./components/AboutSection";
import HiringDecision from "./components/HiringDecision";
import InterviewPerformance from "./components/InterviewPerformance";
import SkillsSection from "./components/SkillsSection";

interface Candidate {
  id: string;
  name: string;
  job_title?: string;
}

interface Job {
  id: string;
  job_title: string;
}

interface Skill {
  name: string;
  match: number;
}

interface PerformanceItem {
  name: string;
  value: "High" | "Medium" | "Low";
}

export default function CandidateReportPage() {
  const candidate: Candidate = {
    id: "1",
    name: "Danait",
  };

  const job: Job = {
    id: "1",
    job_title: "Python Developer",
  };

  const about =
    "Danait is a software engineer with experience in backend and frontend development, database design, and API development. They have experience building web applications, mobile apps, and AI agents, demonstrating a strong foundation for a backend developer role.";

  const skills: Skill[] = [
    { name: "Machine Learning", match: 40 },
    { name: "Python", match: 70 },
  ];

  const performance: PerformanceItem[] = [
    { name: "Attention to Detail", value: "Medium" },
    { name: "Technical Skills", value: "High" },
    { name: "Problem Solving", value: "Medium" },
    { name: "AI Confidence", value: "Low" },
  ];

  const candidateId = "1";

  const analysis = {
    problemSolving: 50,
    python: 30,
    webFrameworks: 0,
    overall: 90,
    versionControl: 0,
    databases: 0,
    programmingConcepts: 0,
    communication: 0,
    timeManagement: 0,
  };

  return (
    <ClientLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="w-full mx-auto px-4 py-6"> 
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-extrabold text-gray-800">Danait</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition-shadow">
                <AboutSection about={about} />
              </div>

              <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition-shadow">
                <SkillsSection skills={skills} />
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition-shadow">
                <InterviewPerformance performance={performance} />
              </div>

              <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition-shadow">
                <HiringDecision candidateId={candidateId} />
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-200" aria-hidden="true" />

          <div className="mt-6 bg-white rounded-xl shadow-md p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-block w-10 h-10 bg-gray-200 rounded-full" aria-label="avatar" />
              <div>
                <div className="text-xl font-semibold text-gray-700">{candidate.name}</div>
                <div className="text-xl text-gray-500">{job.job_title} • ID {candidate.id}</div>
              </div>
            </div>
            <span className="px-3 py-1.5 text-xl font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-100">
              Overall fit: {analysis.overall}
            </span>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
"use client";

import React, { useEffect } from "react";
import { CreateInterviewPayload, useCreateInterview } from "@/app/hooks/useCreateInterview";

interface InterviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateInterviewPayload) => Promise<void>;
  initialData: CreateInterviewPayload;
  scheduledDate?: string; 
}
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
  useEffect(() => {
    if (scheduledDate) {
      setScheduledAt(scheduledDate);
    }
  }, [scheduledDate, setScheduledAt]);

  const [error, setError] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 text-2xl">
      <div className="border-white bg-white rounded-2xl p-5 pb-5 max-w-[900px] w-full">
        <form
          onSubmit={handleSubmit}
          className="p-4 rounded-lg shadow-xl max-w-7xl flex flex-col space-y-4"
        >
          <h2 className="text-2xl font-bold text-black pb-5">
            {initialData ? "Edit Interview" : "Create Interview"}
          </h2>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-medium text-black mb-2">Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-black mb-2">Candidate Email</label>
              <input
                type="email"
                value={candidateEmail}
                onChange={(e) => setCandidateEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-black mb-2">Candidate Name</label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-black mb-2">Scheduled At</label>
              <input
                type="datetime-local"
                required
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-black mb-2">Duration (minutes)</label>
              <input
                type="number"
                min={1}
                required
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-lg font-medium text-black mb-2">Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
              />
            </div>
          </div>

          {error && <p className="text-red-600">{error}</p>}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300 transition-colors text-lg"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-lg"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

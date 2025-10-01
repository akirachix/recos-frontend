"use client";
import React, { useState } from "react";
import { useFetchInterviews } from "../hooks/useFetchInterviews";
import { useToken } from "../hooks/useToken";
import ClientLayout from "../shared-components/ClientLayout";
import SimpleSchedule from "./components/Calendar";
import Modal from "./components/Modal";
import { useInterviewDetails } from "../hooks/useFetchInterviewDetails";
import InterviewFormModal from "./components/InterviewFormModal";
import { useCreateInterview, CreateInterviewPayload } from "../hooks/useCreateInterview";

export default function CalendarPage() {
  const token = useToken();
  const { events, loading, error } = useFetchInterviews();
  const { loading: creating, createInterview } = useCreateInterview();
  const [selectedInterviewId, setSelectedInterviewId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { selectedInterview, loadingDetails, detailError } = useInterviewDetails(selectedInterviewId, token, "", modalOpen);

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formScheduledDate, setFormScheduledDate] = useState<string | undefined>(undefined);
  const [formInitialData, setFormInitialData] = useState<CreateInterviewPayload | null>(null);

  const onEditInterview = (id: number) => {
    setSelectedInterviewId(id);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setSelectedInterviewId(null);
  };
  const onCreateInterviewClick = (dateStr: string) => {
    setFormInitialData(null);
    setFormScheduledDate(dateStr);
    setFormModalOpen(true);
  };
  const closeFormModal = () => {
    setFormModalOpen(false);
    setFormInitialData(null);
    setFormScheduledDate(undefined);
  };
  const handleSaveInterview = async (data: CreateInterviewPayload) => {
    try {
      await createInterview(data);
      closeFormModal();
    } catch {
      alert("Failed to create interview");
    }
  };
  return (
    <ClientLayout>
      {loading && <p>Loading interviews...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <SimpleSchedule
          initialYear={2025}
          initialMonth={8}
          events={events}
          onEditInterview={onEditInterview}
          onCreateInterviewClick={onCreateInterviewClick}
        />
      )}
      <Modal isOpen={modalOpen} onClose={closeModal}>
        {loadingDetails && <p>Loading interview details...</p>}
        {detailError && <p className="text-red-600">{detailError}</p>}
        {selectedInterview && (
          <>
            <h2 className="text-xl font-bold mb-4">Interview Details</h2>
            <p><strong>Candidate:</strong> {selectedInterview.candidate_name} ({selectedInterview.candidate_email})</p>
            <p><strong>Recruiter:</strong> {selectedInterview.recruiter_name} ({selectedInterview.recruiter_email})</p>
            <p><strong>Description:</strong> {selectedInterview.description}</p>
            <p><strong>Scheduled At:</strong> {new Date(selectedInterview.scheduled_at).toLocaleString()}</p>
            <p><strong>Duration:</strong> {selectedInterview.duration} minutes</p>
            <p>
              <strong>Status:</strong>
              <span
                className={
                  selectedInterview.status === "draft" || selectedInterview.status === "pending"
                    ? "text-purple-600"
                    : selectedInterview.status === "scheduled"
                      ? "text-green-600"
                      : ""
                }
              >
                {selectedInterview.status === "draft" ? "pending" : selectedInterview.status}
              </span>
            </p>
            {selectedInterview.interview_link && (
              <p><strong>Interview Link:</strong>{" "}
                <a href={selectedInterview.interview_link} className="text-blue-600 underline" target="_blank" rel="noreferrer">Join Meeting</a>
              </p>
            )}
            {selectedInterview.google_calendar_link && (
              <p><strong>Google Calendar:</strong>{" "}
                <a href={selectedInterview.google_calendar_link} className="text-blue-600 underline" target="_blank" rel="noreferrer">View Event</a>
              </p>
            )}
          </>
        )}
      </Modal>
      <InterviewFormModal
        isOpen={formModalOpen}
        initialData={formInitialData ?? {} as CreateInterviewPayload}
        scheduledDate={formScheduledDate}
        onClose={closeFormModal}
        onSave={handleSaveInterview}
      />
    </ClientLayout>
  );
}

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
  const { events, loading, error, refetch } = useFetchInterviews();
  const { loading: creating, createInterview } = useCreateInterview();
  const [selectedInterviewId, setSelectedInterviewId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { selectedInterview, loadingDetails, detailError } = useInterviewDetails(
    selectedInterviewId,
    token,
    "",
    modalOpen
  );

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formScheduledDate, setFormScheduledDate] = useState<string | undefined>(undefined);
  const [formInitialData, setFormInitialData] = useState<CreateInterviewPayload | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const handleSaveInterview = async (data: any) => {
    try {
      const response = await createInterview(data);
      console.log("Create interview response:", JSON.stringify(response, null, 2));

      closeFormModal();
      setSuccessMessage("Interview created successfully!");
      refetch();
      setTimeout(() => setSuccessMessage(null), 2000);
    } catch (err) {
      setErrorMessage("Failed to create interview. Please try again.");
      setTimeout(() => setErrorMessage(null), 2000);
      throw err;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString(undefined, {
        dateStyle: "short",
        timeStyle: "short",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const normalizeStatus = (status: string | undefined) => {
    const s = (status ?? "").toString().toLowerCase();
    if (s === "pending" || s === "draft") return "pending";
    if (s === "scheduled") return "scheduled";
    if (s === "completed") return "completed";
    if (s === "cancelled" || s === "canceled") return "cancelled";
    return s;
  };

  const getStatusColorClass = (status: string | undefined) => {
    const s = normalizeStatus(status);
    if (s === "pending") return "text-purple-600";
    if (s === "scheduled") return "text-green-600";
    if (s === "completed") return "text-blue-600";
    if (s === "cancelled") return "text-red-600";
    return "";
  };

  const formatStatus = (status: string | undefined) => {
    const s = normalizeStatus(status);
    if (s === "pending") return "Pending";
    if (s === "scheduled") return "Scheduled";
    if (s === "completed") return "Completed";
    if (s === "cancelled") return "Cancelled";
    return status ?? "";
  };

  const getInterviewLink = (interview: any) => {
    return interview?.interview_link ||
      interview?.meet_link ||
      interview?.calendar_event?.meet_link ||
      null;
  };

  const getGoogleCalendarLink = (interview: any) => {
    return interview?.google_calendar_link ||
      interview?.calendar_link ||
      interview?.calendar_event?.calendar_link ||
      null;
  };

  const getAIJoinUrl = (interview: any) => interview?.calendar_event?.ai_join_url || null;

  const hasAnyLink = (interview: any) =>
    !!getInterviewLink(interview) ||
    !!getGoogleCalendarLink(interview) ||
    !!getAIJoinUrl(interview);

  return (
    <ClientLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="w-full py-6">
          {successMessage && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {errorMessage}
            </div>
          )}

          {loading && <p className="text-sm text-gray-600">Loading interviews...</p>}
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
                <p>
                  <strong>Candidate:</strong> {selectedInterview.candidate_name}{" "}
                  ({selectedInterview.candidate_email})
                </p>
                <p>
                  <strong>Description:</strong> {selectedInterview.description ?? "No description"}
                </p>
                <p>
                  <strong>Scheduled At:</strong> {formatDate(selectedInterview.scheduled_at)}
                </p>
                <p>
                  <strong>Duration:</strong> {selectedInterview.duration} minutes
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className={getStatusColorClass(selectedInterview.status)}>
                    {formatStatus(selectedInterview.status)}
                  </span>
                </p>

                {hasAnyLink(selectedInterview) && (
                  <>
                    {getInterviewLink(selectedInterview) && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-md">
                        <strong>Interview Link:</strong>{" "}
                        <a href={getInterviewLink(selectedInterview)} className="text-blue-600 underline" target="_blank" rel="noreferrer">
                          Join Meeting
                        </a>
                      </div>
                    )}
                    {getGoogleCalendarLink(selectedInterview) && (
                      <div className="mt-2 p-3 bg-green-50 rounded-md">
                        <strong>Google Calendar:</strong>{" "}
                        <a href={getGoogleCalendarLink(selectedInterview)} className="text-blue-600 underline" target="_blank" rel="noreferrer">
                          View Event
                        </a>
                      </div>
                    )}
                    {getAIJoinUrl(selectedInterview) && (
                      <div className="mt-2 p-3 bg-purple-50 rounded-md">
                        <strong>AI Analysis:</strong>{" "}
                        <a href={getAIJoinUrl(selectedInterview)} className="text-purple-600 underline" target="_blank" rel="noreferrer">
                          Enable AI Analysis
                        </a>
                      </div>
                    )}
                  </>
                )}

                {!hasAnyLink(selectedInterview) && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded-md">
                    <p className="text-yellow-800">
                      <strong>No meeting links available.</strong> This interview might not have been synced with Google Calendar yet.
                    </p>
                  </div>
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
        </div>
      </div>
    </ClientLayout>
  );
}

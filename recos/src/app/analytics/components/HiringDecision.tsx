"use client";

import { useState } from "react";
import { useHiringDecision } from "@/app/hooks/useAiReport";

interface HiringDecisionProps {
  candidateId: string;
}

export default function HiringDecision({ candidateId }: HiringDecisionProps) {
  const { decision, isSubmitting, makeDecision, resetDecision, error } = useHiringDecision(candidateId);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleDecision = async (value: "reject" | "advance") => {
    try {
      await makeDecision(value);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        resetDecision();
      }, 3000);
    } catch (error) {
      console.error("Decision failed:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Hiring Decision</h3>
      {showSuccess && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          Decision submitted successfully!
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      <div className="flex space-x-4">
        <button
          onClick={() => handleDecision("reject")}
          disabled={isSubmitting}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            decision === "reject"
              ? "bg-red-600 text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isSubmitting && decision === "reject" ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : (
            "Reject"
          )}
        </button>
        <button
          onClick={() => handleDecision("advance")}
          disabled={isSubmitting}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            decision === "advance"
              ? "bg-green-600 text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isSubmitting && decision === "advance" ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : (
            "Advance"
          )}
        </button>
      </div>
    </div>
  );
}
import { useState } from "react";

interface HiringDecisionState {
  decision: "reject" | "advance" | null;
  isSubmitting: boolean;
  error: string | null;
}

export function useHiringDecision(candidateId: string) {
  const [state, setState] = useState<HiringDecisionState>({
    decision: null,
    isSubmitting: false,
    error: null,
  });

  const makeDecision = async (value: "reject" | "advance") => {
    setState((prev) => ({ ...prev, isSubmitting: true, error: null }));
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); 
      console.log(`Decision: ${value} for candidate ${candidateId}`);
      setState((prev) => ({ ...prev, decision: value, isSubmitting: false }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isSubmitting: false,
        error: "Failed to submit decision",
      }));
    }
  };

  const resetDecision = () => {
    setState((prev) => ({ ...prev, decision: null, error: null }));
  };

  return {
    ...state,
    makeDecision,
    resetDecision,
  };
}
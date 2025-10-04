import { useState } from "react";
import { fetchVerifyResetCode } from "@/app/utils/fetchVerifyResetCode";

export function useFetchVerifyResetCode() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);

  const verifyResetCode = async (email: string, code: string) => {
    setLoading(true);
    setError(null);
    setVerified(false);
    try {
      const response = await fetchVerifyResetCode(email, code);
      if (
        response.detail &&
        response.detail.toLowerCase().includes("verified")
      ) {
        setVerified(true);
      } else {
        setError("Verification failed. Code not valid.");
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, verified, verifyResetCode };
}
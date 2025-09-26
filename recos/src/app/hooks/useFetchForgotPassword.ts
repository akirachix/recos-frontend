import { useState } from "react";
import { fetchForgotPassword } from "../utils/fetchForgotPassword";

export function useForgotPasswordRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const requestCode = async (email: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await fetchForgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, requestCode };
}
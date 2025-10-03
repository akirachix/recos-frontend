import { useState } from "react";
import { fetchForgotPassword } from "@/app/utils/fetchForgotPassword";

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
    } catch (error) {
      setError((error as Error).message || "Failed to send code. Please try again");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, requestCode };
}

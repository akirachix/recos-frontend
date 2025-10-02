import { useState } from "react";
import { fetchResetPassword } from "../utils/fetchResetPassword";

export function useResetPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetPassword = async (
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await fetchResetPassword(email, password, confirmPassword);
      if (response.detail && response.detail.toLowerCase().includes("successful")) {
        setSuccess(true);
       
        
      } else {
        setError("Reset password failed");
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, resetPassword };
}
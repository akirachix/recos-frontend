import { useState, useCallback } from 'react';
import { fetchVerifyResetCode } from '../utils/fetchVerifyResetCode';

export const useVerifyResetCode = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const verifyResetCode = useCallback(async (code: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchVerifyResetCode(code);
      if (response.success) {
        setSuccess(true);
      } else {
        setError(response.error || 'Failed to verify reset code.');
      }
    } catch (err) {
      setError((err as Error).message);
    }
    setLoading(false);
  }, []);

  return { verifyResetCode, loading, error, success };
};
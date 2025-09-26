import { useState, useEffect } from 'react';
import { getAuthToken } from '../utils/useToken';

export function useToken() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const token = getAuthToken();
    setToken(token || null);
  }, []);

  return token;
}
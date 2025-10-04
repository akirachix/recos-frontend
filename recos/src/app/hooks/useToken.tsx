'use client';

import { useState, useEffect } from 'react';
import { getAuthToken } from '../utils/useToken';

export function useToken() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenFromCookie = getAuthToken() || null;
    setToken(tokenFromCookie);
  }, []);

  return token;
}
'use client';

import { useEffect } from 'react';
import { setAuthToken } from '@/app/utils/useToken';

export default function InitAuthToken() {
  useEffect(() => {
    const existingToken = document.cookie.includes('auth_token');
    if (!existingToken) {
      setAuthToken("FIXED_TOKEN"); 
      console.log('Auth token set in cookies');
    }
  }, []);

  return null;
}

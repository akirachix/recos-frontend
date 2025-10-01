'use client';

import { useEffect } from 'react';
import { setAuthToken } from '@/app/utils/useToken';

export default function InitAuthToken() {
  useEffect(() => {
    const hasAuthToken = document.cookie.includes('auth_token');
    if (!hasAuthToken) {
      setAuthToken('auth_token'); 
      console.log('Auth token set in cookies');
    }
  }, []);

  return null;
}

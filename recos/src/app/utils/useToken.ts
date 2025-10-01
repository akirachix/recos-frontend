'use client';

import Cookies from 'js-cookie';

const AUTH_TOKEN_KEY = 'auth_token';
export const setAuthToken = (token: string) => {
  Cookies.set(AUTH_TOKEN_KEY, token, {
    expires: 7, 
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'strict', 
    path: '/', 
  });
};
export const getAuthToken = (): string | undefined => {
  return Cookies.get(AUTH_TOKEN_KEY);
};

export const removeAuthToken = () => {
  Cookies.remove(AUTH_TOKEN_KEY, { path: '/' });
};

import { useState, useEffect } from 'react';
import { fetchUser } from '@/utils/fetchUser';

type User = {
  id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  image?: string | null;
};

export const useFetchUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      try {
        const userData = await fetchUser();
        setUser(Array.isArray(userData) ? userData[0] : userData || null);
        setError(null);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  return { user, loading, error };
};
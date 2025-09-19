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
      try {
        const userData = await fetchUser();
        
        if (Array.isArray(userData) && userData.length > 0) {
          setUser(userData[0]);
        } else if (userData && typeof userData === 'object') {
          setUser(userData);
        } else {
          setUser(null);
        }
        
        setError(null);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  return { user, loading, error };
};
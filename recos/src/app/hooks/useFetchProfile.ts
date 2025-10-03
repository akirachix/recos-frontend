"use client";
import { useState, useEffect } from "react";
import { fetchProfile } from "../utils/fetchProfile";

export type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  image: string | null;
  created_at: string;
};

export function useFetchProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProfile();
      setUser(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  return { user, loading, error, refetch };
}

export default useFetchProfile;

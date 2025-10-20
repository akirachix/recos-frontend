"use client";
import { useState, useEffect, useRef } from "react";
import { fetchCompanies } from "../utils/fetchCompanies";
import { getAuthToken } from "../utils/useToken";

interface Company {
  company_id: string;
  company_name: string;
}

export function useCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const getCompaniesData = async () => {
    if (hasFetched.current) return;

    const token = getAuthToken();

    if (!token) {
      setCompanies([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchCompanies(token);
      setCompanies(Array.isArray(data) ? data : []);
      hasFetched.current = true;
    } catch (err) {
      setError((err as Error).message);
      setCompanies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    hasFetched.current = false;
  };

  useEffect(() => {
    getCompaniesData();
  }, []);

  return {
    companies,
    isLoading,
    error,
    refetch: getCompaniesData,
    reset,
  };
}
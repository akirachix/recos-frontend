import { useState, useEffect } from "react";

interface Company {
  company_id: string;
  company_name: string;
}
async function fetchCompanies(token: string): Promise<Company[]> {
  const response = await fetch("/api/companies", {
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch companies: ${response.statusText}`);
  }

  const result = await response.json();
  return result.data || [];
}
export function useCompanies(token: string | null) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("Missing token");
      setCompanies([]);
      return;
    }
    setIsLoading(true);
    setError(null);

    fetchCompanies(token)
      .then((data) => {
        setCompanies(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setCompanies([]);
        setIsLoading(false);
      });
  }, [token]);

  return { companies, isLoading, error };
}

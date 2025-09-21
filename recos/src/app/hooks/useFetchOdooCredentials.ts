"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
export function useOdooAuth() {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [dbUrl, setDbUrl] = useState("");
  const [dbName, setDbName] = useState("");
  const [email, setEmail] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
    }
  }, []);

  async function verifyAndSave() {
    if (!token) {
      setError("Not authenticated. Please login.");
      return false;
    }
    if (!agreed) {
      setError("Please agree to share candidate information.");
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const credentials = {
        db_url: dbUrl,
        db_name: dbName,
        email,
        api_key: apiKey,
      };
      router.push("/authentication/odoo/companies");
      return true;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }
  return {
    token,
    loading,
    error,
    dbUrl,
    setDbUrl,
    dbName,
    setDbName,
    email,
    setEmail,
    apiKey,
    setApiKey,
    agreed,
    setAgreed,
    verifyAndSave,
  };
}

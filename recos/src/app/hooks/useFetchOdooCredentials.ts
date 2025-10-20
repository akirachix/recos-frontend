"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useVerifyOdoo } from "./useFetchVerifyOdoo";
import { postOdooCredentials } from "../utils/fetchOdooCredentials";
import { getAuthToken } from "../utils/useToken";

export function useOdooAuth() {
  const router = useRouter();
  const { verify, error: verifyError, loading: verifyLoading } = useVerifyOdoo();

  const [dbUrl, setDbUrl] = useState("");
  const [dbName, setDbName] = useState("");
  const [email, setEmail] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function verifyAndSave() {
    const token = getAuthToken();
    
    if (!token) {
      setError("Not authenticated. Please login.");
      return false;
    }
    
    if (!agreed) {
      setError("Please agree to share candidate information.");
      return false;
    }

    if (!dbUrl || !dbName || !email || !apiKey) {
      setError("All fields are required.");
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
      
      const verifyResult = await verify(credentials, token);
      
      if (!verifyResult.valid) {
        setError(verifyResult.error || "Invalid Odoo credentials");
        return false;
      }
      
      const saveResult = await postOdooCredentials(token, credentials);
      
      if (saveResult.error) {
        setError(saveResult.error);
        return false;
      }
      
      router.push("/authentication/odoo/companies");
      return true;
    } catch (error) {
      const errorMessage = (error as Error).message || "An unknown error occurred";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }
  
  return {
    loading: loading || verifyLoading,
    error: error || verifyError,
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
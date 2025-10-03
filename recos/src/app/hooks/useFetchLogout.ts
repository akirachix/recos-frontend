"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchLogout } from "../utils/fetchLogout";
import { removeAuthToken } from "../utils/useToken";

export function useLogout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const logout = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await fetchLogout();
      removeAuthToken();
      setSuccess(true);
      router.push("/signin");
    } catch (error) {
      setError((error as Error).message || "Failed to logout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, logout };
}

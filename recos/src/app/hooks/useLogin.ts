import { useState } from "react";
import { loginUser } from "../utils/fetchLogin";
import { setAuthToken } from "../utils/useToken";

interface LoginCredentials {
  email: string;
  password: string;
}

const useLogin = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginUser(credentials);
      if (data?.success && data.token) {
        setAuthToken(data.token); 
        return true;
      } else {
        setError(error);
        return false;
      }
    } catch (err) {
      setError((err as Error).message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};

export default useLogin;

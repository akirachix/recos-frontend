
import { useState } from "react";
import { registerUser } from "../utils/fetchRegister";

const useRegister = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (userData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }): Promise<"success" | "exists" | null> => {
    setLoading(true);
    setError(null);
    try { 
      const result = await registerUser(userData);
      if (!result) {
        throw new Error("Registration failed");
      }
      if (result.user) {
        return "success";
      }

      throw new Error("Unknown registration error");
    } catch(error){
                setError((error as Error).message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
};

export default useRegister;




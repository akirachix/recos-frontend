import { useState } from 'react';
import { verifyOdoo } from '../utils/fetchVerifyOdoo';

export function useVerifyOdoo() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    async function verify(credentials: object, token: string) {
        setLoading(true);
        setError(null);
        
        try {
            const result = await verifyOdoo(credentials, token);
            
            if (result.error) {
                setError(result.error);
                return { valid: false, error: result.error };
            }
            
            return result;
        } catch (error) {
            const errorMessage = (error as Error).message || "An unknown error occurred";
            setError(errorMessage);
            return { valid: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }
    
    return { verify, error, loading };
}
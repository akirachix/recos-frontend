import { useState } from 'react';
import { verifyOdoo } from '../utils/fetchVerifyOdoo';
export function useVerifyOdoo() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean | null>(null);

    async function verify(credentials: object) {
        try {
            const message = await verifyOdoo(credentials);
            setError(null);
            return message;
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
        }
    }
    return { verify, error };
}

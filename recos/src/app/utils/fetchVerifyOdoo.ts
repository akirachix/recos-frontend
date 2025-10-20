const baseUrl = "/api/verify-odoo/";

export async function verifyOdoo(credentials: object, token: string) {
    try {
        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify(credentials),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            return { 
                error: errorData.error || "Failed to verify credentials", 
                status: response.status,
                valid: false
            };
        }

        return await response.json();
    } catch (error) {
            throw error;    }
}
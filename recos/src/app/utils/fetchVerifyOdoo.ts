const baseUrl = "/api/verify-odoo";

export async function verifyOdoo(credentials: object) {
    try {
        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        if (!response.ok) {
            const error = await response.text();
            return { error, status: response.status };
        }

        return await response.json();
    } catch (error) {
        throw new Error((error as Error).message
        );
    }
}

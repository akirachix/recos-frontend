export async function postOdooCredentials(token: string, credentials: object) {
  try {
    const response = await fetch("/api/auth", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.text();
      return { error, status: response.status }; 
    }
    return await response.json();  
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

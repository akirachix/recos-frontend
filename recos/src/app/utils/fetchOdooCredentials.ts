const baseUrl = "/api/odoo-credentials/";

export async function postOdooCredentials(token: string, credentials: object) {
  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { 
        error: errorData.error || "Failed to save credentials", 
        status: response.status 
      }; 
    }
    
    return await response.json();  
  } catch (error) {
    return { 
      error: (error as Error).message ,
      status: 500 
    };
  }
}
const baseurl = "/api/auth/signup";

export async function registerUser(data: {  
  first_name: string; 
  last_name: string; 
  email: string; 
  password: string 
}) {
  try {
    const response = await fetch(baseurl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      if (result.email && Array.isArray(result.email) && result.email.length > 0) {
        throw new Error(result.email[0]);
      }
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      throw new Error("Registration failed");
    }
    
    return result;
  } catch (error) {
    throw error;
  }
}
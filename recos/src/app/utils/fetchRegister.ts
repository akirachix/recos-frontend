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
    if (!response.ok) {
     
      throw new Error("User with this email address already exists." );
    }
    
    const result= await response.json();
    return result

  } catch (error) {
    throw new Error("Registration failed: " + (error as Error).message);
  }
}
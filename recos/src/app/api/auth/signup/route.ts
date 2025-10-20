const baseurl = process.env.BASE_URL;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { first_name, last_name, email, password } = body;
    
    if (!first_name || !last_name || !email || !password) {
      return new Response(
        JSON.stringify({ error: "Missing required values: first_name, last_name, email, password" }),
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    
    const response = await fetch(`${baseurl}/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ first_name, last_name, email, password }),
    });
    
    const result = await response.json();
    
    return new Response(JSON.stringify(result), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to register: " + (error as Error).message }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
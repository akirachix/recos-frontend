const baseurl = process.env.BASE_URL;


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { first_name, last_name, email, password} = body;
    if (!first_name || !last_name || !email || !password) {
      return new Response(
        "Missing required values: first_name, last_name, email, password",
        { status: 400 }
      );
    }
    const response = await fetch(`${baseurl}/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ first_name, last_name, email, password}),
    });
    
    const result = await response.json();
    return new Response(JSON.stringify(result), {
      status: 201,
      statusText: "User registered successfully",
    });
  } catch (error) {
    return new Response("Failed to register: " + (error as Error).message, {
      status: 500,
    });
  }
}
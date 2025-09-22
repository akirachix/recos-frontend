
const baseurl = process.env.BASE_URL;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!body) {
      return new Response("Missing required values: email, password", { status: 400 });
    }

    const response = await fetch(`${baseurl}/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const result = await response.json();
    if (response.ok && result.token) {
      return new Response(JSON.stringify({ success: true, token: result.token }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  
  } catch (error) {
    return new Response("Failed to login: " + (error as Error).message, {
      status: 500,
    });
  }
}













































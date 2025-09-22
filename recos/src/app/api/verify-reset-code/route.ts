const baseUrl = process.env.BASE_URL;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body || !body.email || !body.code) {
      return new Response(JSON.stringify({ statusText: "Email and code are required" }), { status: 400 });
    }

    const response = await fetch(`${baseUrl}/verify-reset-code/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: body.email, code: body.code }),
    });

    const result = await response.json();

    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ statusText: "Failed to verify code" }), { status: 500 });
  }
}
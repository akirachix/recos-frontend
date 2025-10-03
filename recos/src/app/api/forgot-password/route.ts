const baseUrl = process.env.BASE_URL;

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return new Response(JSON.stringify({ statusText: "Email is required" }), { status: 400 });
    }
    const response = await fetch(`${baseUrl}/forgot-password/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();
    return new Response(JSON.stringify(result), { status: 201 });
  } catch {
    return new Response(JSON.stringify({ statusText: "Failed to send code" }), { status: 500 });
  }
}
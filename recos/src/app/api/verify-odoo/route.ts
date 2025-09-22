const baseUrl = process.env.API_BASE_URL;
if (!baseUrl) throw new Error("API base URL not configured");

export async function POST(request: Request) {
  try {
    const token = await cookieStore.get("auth_token");
    if (!token) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: No auth token" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    const credentials = await request.json();
    const response = await fetch(`${baseUrl}/verify-odoo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token.value}`,
      },
      body: JSON.stringify(credentials),
    });
    const responseBody = await response.json();
    return new Response(JSON.stringify(responseBody), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 } );
  }
}

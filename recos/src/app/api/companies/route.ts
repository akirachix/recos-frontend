
const baseUrl = process.env.API_BASE_URL;
if (!baseUrl) throw new Error("API base URL missing.");

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Token ", "");
    if (!token) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized, token missing" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    const response = await fetch(`${baseUrl}/api/companies/`, {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error"}), {
      status: 500,
    });
  }
}

 

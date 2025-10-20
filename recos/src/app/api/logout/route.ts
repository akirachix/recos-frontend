const baseUrl = process.env.BASE_URL;

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ statusText: "No auth header" }), { status: 401 });
    }
    const response = await fetch(`${baseUrl}/logout/`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      credentials: "include"
    });

    const result = await response.json();
    return new Response(JSON.stringify(result), { status: response.status });
  } catch (error) {
    return new Response(
      JSON.stringify({ statusText: "Logout failed: " + (error as Error).message }),
      { status: 500 }
    );
  }
}

const baseurl = process.env.BASE_URL;

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");

    const headers: HeadersInit = {};
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const response = await fetch(`${baseurl}/candidates/`, {
      headers,
    });

   
    const result = await response.json();

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Failed to fetch candidates: " + (error as Error).message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

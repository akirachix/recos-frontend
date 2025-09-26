const baseurl = process.env.BASE_URL;

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    console.log("API Route GET: Received Authorization header:", authHeader);

    const headers: HeadersInit = {};
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const response = await fetch(`${baseurl}/candidates/`, {
      headers,
    });

   
    const result = await response.json();

    console.log("API Route GET: Returning candidates successfully");

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API Route GET: Error fetching candidates:", error);
    return new Response(
      JSON.stringify({ message: "Failed to fetch candidates: " + (error as Error).message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

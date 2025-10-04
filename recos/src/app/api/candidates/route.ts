const baseUrl = process.env.BASE_URL;

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const companyId = url.searchParams.get("companyId");
    if (!companyId) {
      return new Response("Missing company Id: companyId", { status: 400 });
    }

    const headers = {};
    const auth = request.headers.get("authorization");
    if (auth) {
      (headers as Record<string, string>)["Authorization"] = auth;
    }

    const response = await fetch(`${baseUrl}/sync/candidates/company/${companyId}/`, {
      method: "GET",
      headers,
    });

    const result = await response.json();

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response((error as Error).message, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const companyId = url.searchParams.get("companyId");
    if (!companyId) {
      return new Response("Missing company Id: companyId", { status: 400 });
    }

    const headers = {
      "Content-Type": "application/json",
    };
    const auth = request.headers.get("authorization");
    if (auth) {
      (headers as Record<string, string>)["Authorization"] = auth;
    }

    const response = await fetch(`${baseUrl}/sync/candidates/company/${companyId}/`, {
      method: "POST",
      headers,
   
    });

    const result = await response.json();
    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response((error as Error).message, { status: 500 });
  }
}

const baseUrl = process.env.BASE_URL;

export async function GET(request: Request) {
  try {
    const token = request.headers.get("authorization");
    if (!token) {
      return new Response(
        JSON.stringify({ statusText: "Unauthorized: No token" }),
        { status: 401 }
      );
    }
    const response = await fetch(`${baseUrl}/users/`, {
      headers: { Authorization: token },
    });

    if (!response.ok) {
      const err = await response.text();
      return new Response(
        JSON.stringify({ statusText: err }),
        { status: response.status }
      );
    }

    const result = await response.json();
    return new Response(JSON.stringify(result), { status: response.status });
  } catch (error) {
    return new Response(
      JSON.stringify({ statusText: "Failed to get profile: " + (error as Error).message }),
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.includes(" ") ? authHeader.split(" ")[1] : authHeader;

    const contentType = request.headers.get("content-type") || "";

    let bodyData: any;

    if (contentType.includes("multipart/form-data")) {
      bodyData = await request.formData();
    } else {
      const jsonBody = await request.json();
      bodyData = JSON.stringify(jsonBody);
    }

    let headers: { [key: string]: string } = {};
    if (token) {
      headers["Authorization"] = `Token ${token}`;
    }
    if (!contentType.includes("multipart/form-data")) {
      headers["Content-Type"] = contentType;
    }

    const response = await fetch(`${baseUrl}/update-profile/`, {
      method: "PATCH",
      headers: headers,
      body: bodyData,
    });

    const result = await response.json();

    return new Response(JSON.stringify(result), { status: response.status });
  } catch (error) {
    return new Response(
      JSON.stringify({ statusText: "Failed to update profile: " + (error as Error).message }),
      { status: 500 }
    );
  }
}

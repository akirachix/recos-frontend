const baseUrl = process.env.BASE_URL;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.email || !body.password || !body.confirm_password) {
      return new Response(
        JSON.stringify({
          statusText: "Password and confirm password are required",
        }),
        { status: 400 }
      );
    }

    const response = await fetch(`${baseUrl}/reset-password/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: body.email,
        password: body.password,
        confirm_password: body.confirm_password,
      }),
    });

    const result = await response.json();
    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(
      JSON.stringify({ statusText: "Failed to reset password" }),
      { status: 500 }
    );
  }
}

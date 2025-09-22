const baseurl = "/api/auth/signin";

export async function loginUser(data: { email: string; password: string }) {
  try {
    const response = await fetch(baseurl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Something went wrong during login: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

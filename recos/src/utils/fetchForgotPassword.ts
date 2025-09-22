export async function fetchForgotPassword(email: string) {
  try {
    const response = await fetch("/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error("Something went wrong during forgot password" + response.statusText);
    }
    return result;
  } catch (error) {
    throw new Error("Failed to send forgot password request: " + (error as Error).message);
  }
}


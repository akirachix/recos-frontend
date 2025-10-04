export async function fetchResetPassword(email: string, password: string, confirm_password: string) {
  try {
    const response = await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, confirm_password }),
    });
    if (!response.ok) {
      throw new Error(`Something went wrong during reset password` + response.statusText);
    }

    const result = await response.json();
    return result
  } catch (error) {
    throw new Error("Failed to reset password: " + (error as Error).message);
  }
}


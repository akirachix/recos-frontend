export async function fetchVerifyResetCode(email: string, code: string) {
  try {
    const response = await fetch("/api/verify-reset-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    if (!response.ok) {
      throw new Error(`Something went wrong during code verification` + response.statusText);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error("Failed to verify the code: " + (error as Error).message);
  }
}

const baseUrl = "/api/interview";
export async function fetchInterviews(token: string) {
  try {
    const response = await fetch(baseUrl, {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text);
    }
    return await response.json();
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
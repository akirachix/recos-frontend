const baseUrl = "/api/interview";

export async function fetchInterviewById(
  token: string | null,
  id: number | string,
) {
  try {
    if (!token) throw new Error("Not authenticated");
    const response = await fetch(`${baseUrl}/${id}`, {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Couldn't get interview id ${id}: ${response.status} - ${text}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

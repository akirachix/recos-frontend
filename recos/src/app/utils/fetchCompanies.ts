const baseUrl = "/api/companies/";

export async function fetchCompanies(token: string) {
  try {
    const response = await fetch(baseUrl, {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Failed to fetch companies, status ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

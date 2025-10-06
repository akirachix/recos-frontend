import { getAuthToken } from "./useToken";

const baseurl = "/api/candidates";

export async function fetchCandidates(companyId: number) {
  const token = getAuthToken();
  const url = `${baseurl}?companyId=${companyId}`;

  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Token ${token}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Something went wrong, " + response.statusText);
    }

    const result = await response.json();
    return result.candidates;
  } catch (error) {
    throw new Error("Failed to fetch candidates: " + (error as Error).message);
  }
}

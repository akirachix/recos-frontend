import { getAuthToken } from "./useToken";

export async function fetchLogout() {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No token found.");

    const response = await fetch("/api/logout", {
      method: "POST",
      headers: {
        "Authorization": `Token ${token}`,
        "Content-Type": "application/json",
      }
    });

    if (!response.ok) {
      throw new Error("Logout failed: " + response.statusText);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error("An error occurred during logout: " + (error as Error).message);
  }
}






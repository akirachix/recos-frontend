import { getAuthToken } from "./authToken";

export async function fetchProfile() {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No token found. Please log in.");

    const response = await fetch("/api/profile", {
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("An error occurred during fetch profile: " + response.statusText);
    }

    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      return data[0]; 
    }
    return data;
  } catch (error) {
    throw new Error("Failed to fetch profile: " + (error as Error).message);
  }
}

export async function fetchUpdateProfile(
  data: FormData 
) {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No auth token found. Please log in.");

    const headers: { [key: string]: string } = {
      Authorization: `Token ${token}`,
    };

    let body: FormData | string;
    if (data instanceof FormData) {
      body = data;
    } else {
      body = JSON.stringify(data);
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers,
      body,
    });

    if (!response.ok) {
      throw new Error("An error occurred during update profile: " + response.statusText);
    }

    return await response.json();
  } catch (error) {
    throw new Error("Failed to update profile: " + (error as Error).message);
  }
}

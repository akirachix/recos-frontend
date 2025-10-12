
import { CreateInterviewPayload } from "../hooks/useCreateInterview";

const baseUrl = "/api/interview/create";

export async function fetchCreateInterview(payload?: CreateInterviewPayload) {
  try {
    const token = localStorage.getItem("authToken");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Token ${token}`;
    }
    const response = await fetch(`${baseUrl}`, {
      method: "POST",
      headers: headers, 
      body: JSON.stringify(payload),
    });
    console.log(response)

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || errorData.message || `Failed to create interview: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
     console.log(error)
    throw error;

  }
}
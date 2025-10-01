import { CreateInterviewPayload } from "../hooks/useCreateInterview";

const baseUrl = "/api/interview";
export async function fetchCreateInterview(payload?: CreateInterviewPayload){
  try {
    const response = await fetch(`${baseUrl}/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to create interview: ${response.status} - ${text}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

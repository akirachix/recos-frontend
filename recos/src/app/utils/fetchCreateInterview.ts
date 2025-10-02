import { CreateInterviewPayload } from "../hooks/useCreateInterview";

const baseUrl = "/api/interview/create";
export async function fetchCreateInterview(payload?: CreateInterviewPayload){
  try {
    const response = await fetch(`${baseUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
       body: JSON.stringify(payload), 
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

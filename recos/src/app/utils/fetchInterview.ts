import { Interview } from '@/app/types';

export const fetchInterviews = async (token: string): Promise<Interview[]> => {
  if (!token) {
    throw new Error("Authentication token is required");
  }
  
  try {
    const response = await fetch('/api/interview', {
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.message || `Failed to fetch interviews: ${response.status}`);
      } catch (e) {
        throw new Error(errorText || `Failed to fetch interviews: ${response.status}`);
      }
    }
    const data = await response.json(); 
    return data;
  } catch (error) {
    throw error;
  }
};
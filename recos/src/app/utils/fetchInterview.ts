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
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to fetch interviews: ${response.status}`);
    }
    const data = await response.json(); 
    return data;
  } catch (error) {
    throw error;
  }
};
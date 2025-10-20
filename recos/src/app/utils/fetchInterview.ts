import { Interview } from '@/app/types';

export const fetchInterviews = async (token: string): Promise<Interview[]> => {
  if (!token) {
    throw new Error('Authentication token is required');
  }

  try {
    const response = await fetch('/api/interview', {
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      let errorMessage = `Failed to fetch interviews: ${response.status}`;

      const contentType = response.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        try {
          const errorData = await response.json();
          if (errorData && (errorData.message || errorData.error)) {
            errorMessage = String(errorData.message ?? errorData.error);
          }
        } catch {
        }
      }

      if (errorMessage.startsWith('Failed to fetch interviews')) {
        try {
          const text = await response.text();
          if (text) errorMessage = text;
        } catch {
  
        }
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();

    return data as Interview[];
  } catch (error) {
      throw new Error();
    }
  }
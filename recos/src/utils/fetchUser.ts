export const fetchUser = async () => {
  try {
    
    const response = await fetch('/api/users');

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch user');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};
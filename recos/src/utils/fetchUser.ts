export const fetchUser = async () => {
  try {
    
    const response = await fetch('/api/users', {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

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
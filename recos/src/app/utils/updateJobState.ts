export const updateJobState = async (jobId: string, state: string) => {
  try {
    const response = await fetch(`/api/jobs/${jobId}/update`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        state,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.details?.message || 'Failed to update job state');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};
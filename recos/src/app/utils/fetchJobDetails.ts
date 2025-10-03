export const fetchJobDetails = async (jobId: string) => {
  try {
    const response = await fetch(`/api/jobs/${jobId}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch job details');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};
export const fetchJobCandidates = async (jobId: string) => {
  const response = await fetch(`/api/jobs/${jobId}/candidates`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch candidates');
  }

  return await response.json();
};
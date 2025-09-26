export const fetchJobs = async (companyId?: string) => {
  try {
    const url = companyId ? `/api/jobs?companyId=${companyId}` : '/api/jobs';
    
    const response = await fetch(url);
    console.log('Fetch Jobs Response:', response);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const syncJobs = async (companyId: string) => {
  try {
    const response = await fetch(`/api/sync-jobs/${companyId}`, {
      method: 'POST'
    });
    
    console.log('Sync Jobs Response:', response);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};
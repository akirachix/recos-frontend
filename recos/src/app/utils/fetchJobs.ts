export const fetchJobs = async (companyId?: string) => {
  try {

    const url = `/api/jobs?companyId=${companyId}`;

    const response = await fetch(url);
    
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
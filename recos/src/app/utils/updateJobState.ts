export interface JobUpdateData {
  company_id?: number;
  company?: number;
  job_title: string;
  job_description: string;
  posted_at?: string;
  state?: string; 
}

export const updateJobState = async (jobId: string, state: string, jobData: JobUpdateData) => {
  try {
    const response = await fetch(`/api/jobs/${jobId}/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        company: jobData.company_id || jobData.company,
        job_title: jobData.job_title,
        job_description: jobData.job_description,
        posted_at: jobData.posted_at,
        state
      })
    });

    return await response.json();
  } catch (error) {
    throw error;
  }
};
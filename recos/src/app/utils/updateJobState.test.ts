import { updateJobState, JobUpdateData } from './updateJobState';

const mockFetch = jest.fn() as jest.Mock;
global.fetch = mockFetch;

type MockFetchOptions = {
  method: string;
  headers: {
    'Content-Type': string;
  };
  body: string;
};

interface RequestBody {
  company?: number;
  job_title: string;
  job_description: string;
  posted_at?: string;
  state: string;
}

describe('updateJobState', () => {
  const jobId = 'job-123';
  const state = 'published';
  const mockResponseData = { id: jobId, state: 'published', updated: true };

  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('updates job state successfully with company_id', async () => {
    const jobData: JobUpdateData = {
      company_id: 456,
      job_title: 'Senior Developer',
      job_description: 'An amazing job opportunity',
      posted_at: '2023-01-01'
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponseData)
    });

    const result = await updateJobState(jobId, state, jobData);
    
    expect(mockFetch).toHaveBeenCalledWith(`/api/jobs/${jobId}/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        company: 456, 
        job_title: 'Senior Developer',
        job_description: 'An amazing job opportunity',
        posted_at: '2023-01-01',
        state: 'published'
      })
    });
    
    expect(result).toEqual(mockResponseData);
  });

  it('updates job state successfully with company (when company_id is missing)', async () => {
    const jobData: JobUpdateData = {
      company: 789,
      job_title: 'Junior Developer',
      job_description: 'A great entry-level position'
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponseData)
    });

    await updateJobState(jobId, state, jobData);
    
    const fetchOptions = mockFetch.mock.calls[0][1] as MockFetchOptions;
    const requestBody: RequestBody = JSON.parse(fetchOptions.body);
    
    expect(requestBody.company).toBe(789);
    expect(requestBody.job_title).toBe('Junior Developer');
    expect(requestBody.job_description).toBe('A great entry-level position');
    expect(requestBody.state).toBe('published');
    expect(requestBody.posted_at).toBeUndefined();
  });

  it('prefers company_id over company when both are present', async () => {
    const jobData: JobUpdateData = {
      company_id: 100,
      company: 200,
      job_title: 'Test Job',
      job_description: 'Test description'
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponseData)
    });

    await updateJobState(jobId, state, jobData);
    
    const fetchOptions = mockFetch.mock.calls[0][1] as MockFetchOptions;
    const requestBody: RequestBody = JSON.parse(fetchOptions.body);
    expect(requestBody.company).toBe(100);
  });

  it('handles missing optional fields correctly', async () => {
    const jobData: JobUpdateData = {
      job_title: 'Minimal Job',
      job_description: 'Just the basics'
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponseData)
    });

    await updateJobState(jobId, state, jobData);
    
    const fetchOptions = mockFetch.mock.calls[0][1] as MockFetchOptions;
    const requestBody: RequestBody = JSON.parse(fetchOptions.body);
    
    expect(requestBody).toEqual({
      company: undefined,
      job_title: 'Minimal Job',
      job_description: 'Just the basics',
      state: 'published'
    });
  });

  it('throws network errors', async () => {
    const jobData: JobUpdateData = {
      job_title: 'Test',
      job_description: 'Test'
    };
    const networkError = new Error('Network connection failed');
    
    mockFetch.mockRejectedValueOnce(networkError);

    await expect(updateJobState(jobId, state, jobData)).rejects.toThrow(networkError);
  });

  it('throws JSON parsing errors', async () => {
    const jobData: JobUpdateData = {
      job_title: 'Test',
      job_description: 'Test'
    };
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.reject(new Error('Invalid JSON'))
    });

    await expect(updateJobState(jobId, state, jobData)).rejects.toThrow('Invalid JSON');
  });

  it('handles API errors (non-200 responses)', async () => {
    const jobData: JobUpdateData = {
      job_title: 'Test',
      job_description: 'Test'
    };
    
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      json: () => Promise.resolve({ error: 'Invalid job data' })
    });

    const result = await updateJobState(jobId, state, jobData);
    expect(result).toEqual({ error: 'Invalid job data' });
  });
});
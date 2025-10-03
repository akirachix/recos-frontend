import { fetchJobDetails } from "./fetchJobDetails";

const mockFetch = jest.fn() as jest.Mock;
global.fetch = mockFetch;

describe('fetchJobDetails', () => {
  const jobId = 'job-123';
  const mockJobData = {
    id: jobId,
    title: 'Senior Developer',
    company: 'Tech Corp',
    description: 'An amazing job opportunity'
  };

  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('fetches job details successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockJobData)
    });

    const result = await fetchJobDetails(jobId);
    
    expect(mockFetch).toHaveBeenCalledWith(`/api/jobs/${jobId}`);
    expect(result).toEqual(mockJobData);
  });

  it('throws error when API returns error message', async () => {
    const errorMessage = 'Job not found';
    
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: errorMessage })
    });

    await expect(fetchJobDetails(jobId)).rejects.toThrow(errorMessage);
  });

  it('throws default error when API returns no error message', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({})
    });

    await expect(fetchJobDetails(jobId)).rejects.toThrow('Failed to fetch job details');
  });

  it('throws network errors', async () => {
    const networkError = new Error('Network connection failed');
    
    mockFetch.mockRejectedValueOnce(networkError);

    await expect(fetchJobDetails(jobId)).rejects.toThrow(networkError);
  });

  it('handles JSON parsing errors gracefully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.reject(new Error('Invalid JSON'))
    });

    await expect(fetchJobDetails(jobId)).rejects.toThrow('Invalid JSON');
  });
});
import { fetchJobCandidates } from "./fetchJobCandidates";

const mockFetch = jest.fn() as jest.Mock;
global.fetch = mockFetch;

describe('fetchJobCandidates', () => {
  const jobId = 'job-123';
  const mockCandidates = [
    { id: 'candidate-1', name: 'John Doe', status: 'applied' },
    { id: 'candidate-2', name: 'Jane Smith', status: 'interviewing' }
  ];

  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('fetches candidates successfully with correct headers', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockCandidates)
    });

    const result = await fetchJobCandidates(jobId);
    
    expect(mockFetch).toHaveBeenCalledWith(`/api/jobs/${jobId}/candidates`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    expect(result).toEqual(mockCandidates);
  });

  it('throws error when response is not ok', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found'
    });

    await expect(fetchJobCandidates(jobId)).rejects.toThrow('Failed to fetch candidates');
  });

  it('throws network errors', async () => {
    const networkError = new Error('Network connection failed');
    
    mockFetch.mockRejectedValueOnce(networkError);

    await expect(fetchJobCandidates(jobId)).rejects.toThrow(networkError);
  });

  it('handles JSON parsing errors gracefully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.reject(new Error('Invalid JSON'))
    });

    await expect(fetchJobCandidates(jobId)).rejects.toThrow('Invalid JSON');
  });

  it('uses correct headers even when response fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    });

    await expect(fetchJobCandidates(jobId)).rejects.toThrow('Failed to fetch candidates');
    
    expect(mockFetch).toHaveBeenCalledWith(`/api/jobs/${jobId}/candidates`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  });
});
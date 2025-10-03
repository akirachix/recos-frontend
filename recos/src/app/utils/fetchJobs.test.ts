import { fetchJobs, syncJobs } from "./fetchJobs";

const mockFetch = jest.fn() as jest.Mock;
global.fetch = mockFetch;

describe('fetchJobs', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('fetches jobs for specific companyId', async () => {
    const companyId = 'company-123';
    const mockData = [{ id: 2, title: 'Job 2' }];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData)
    });

    const result = await fetchJobs(companyId);
    
    expect(mockFetch).toHaveBeenCalledWith(`/api/jobs?companyId=${companyId}`);
    expect(result).toEqual(mockData);
  });

  it('throws error when response is not ok', async () => {
    const errorMessage = 'Failed to fetch jobs';
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: errorMessage })
    });

    await expect(fetchJobs()).rejects.toThrow(errorMessage);
  });

  it('throws network errors', async () => {
    const networkError = new Error('Network error');
    mockFetch.mockRejectedValueOnce(networkError);

    await expect(fetchJobs()).rejects.toThrow(networkError);
  });
});

describe('syncJobs', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('syncs jobs successfully', async () => {
    const companyId = 'company-456';
    const mockData = { success: true, synced: 5 };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData)
    });

    const result = await syncJobs(companyId);
    
    expect(mockFetch).toHaveBeenCalledWith(`/api/sync-jobs/${companyId}`, {
      method: 'POST'
    });
    expect(result).toEqual(mockData);
  });

  it('throws error when sync fails', async () => {
    const companyId = 'company-789';
    const errorMessage = 'Sync failed';
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: errorMessage })
    });

    await expect(syncJobs(companyId)).rejects.toThrow(errorMessage);
  });

  it('throws network errors during sync', async () => {
    const companyId = 'company-999';
    const networkError = new Error('Network error during sync');
    mockFetch.mockRejectedValueOnce(networkError);

    await expect(syncJobs(companyId)).rejects.toThrow(networkError);
  });
});
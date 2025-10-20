import { renderHook, act, waitFor } from '@testing-library/react';
import { useFetchJobs } from './useFetchJobs';
import { fetchJobs, syncJobs } from '@/app/utils/fetchJobs';

jest.mock('@/app/utils/fetchJobs', () => ({
  fetchJobs: jest.fn(),
  syncJobs: jest.fn(),
}));

const mockJobs = [
  {
    job_id: 1,
    company_name: 'Tech Corp',
    job_title: 'Senior Developer',
    applicants: 15,
    ai_shortlisted: 5,
    posted_at: '2023-01-01',
    status: 'active',
  },
  {
    job_id: 2,
    company_name: 'Design Inc',
    job_title: 'UI Designer',
    applicants: 8,
    ai_shortlisted: 2,
    posted_at: '2023-01-02',
    status: 'active',
  },
];

describe('useFetchJobs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useFetchJobs());

    expect(result.current.jobs).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.syncing).toBe(false);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.refetch).toBe('function');
    expect(typeof result.current.syncAndFetchJobs).toBe('function');
  });

  it('should fetch jobs on mount without companyId', async () => {
    (fetchJobs as jest.Mock).mockImplementation(async () => {
      return await act(async () => mockJobs);
    });

    const { result } = renderHook(() => useFetchJobs());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetchJobs).toHaveBeenCalledWith(undefined);
    
    expect(result.current.jobs).toEqual(mockJobs);
    expect(result.current.error).toBe(null);
  });

  it('should fetch jobs with companyId', async () => {
    const companyId = 'company-123';
    (fetchJobs as jest.Mock).mockImplementation(async () => {
      return await act(async () => mockJobs);
    });

    const { result } = renderHook(() => useFetchJobs({ companyId }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetchJobs).toHaveBeenCalledWith(companyId);
    expect(result.current.jobs).toEqual(mockJobs);
  });

  it('should handle fetchJobs error', async () => {
    const errorMessage = 'Failed to fetch jobs';
    (fetchJobs as jest.Mock).mockImplementation(async () => {
      return await act(async () => {
        throw new Error(errorMessage);
      });
    });

    const { result } = renderHook(() => useFetchJobs());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.jobs).toEqual([]);
  });

  it('should handle non-array response from fetchJobs', async () => {
    (fetchJobs as jest.Mock).mockImplementation(async () => {
      return await act(async () => ({ not: 'an array' }));
    });

    const { result } = renderHook(() => useFetchJobs());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.jobs).toEqual([]);
  });

  it('should sync jobs when syncOnMount is true', async () => {
    const companyId = 'company-123';
    (syncJobs as jest.Mock).mockImplementation(async () => {
      return await act(async () => ({}));
    });
    (fetchJobs as jest.Mock).mockImplementation(async () => {
      return await act(async () => mockJobs);
    });

    const { result } = renderHook(() => useFetchJobs({ 
      companyId, 
      syncOnMount: true 
    }));

    await waitFor(() => {
      expect(result.current.syncing).toBe(false);
    });

    expect(syncJobs).toHaveBeenCalledWith(companyId);
    
    expect(fetchJobs).toHaveBeenCalledWith(companyId);
    
    expect(result.current.jobs).toEqual(mockJobs);
    expect(result.current.loading).toBe(false);
  });

  it('should handle syncJobs error', async () => {
    const companyId = 'company-123';
    const errorMessage = 'Sync failed';
    (syncJobs as jest.Mock).mockImplementation(async () => {
      return await act(async () => {
        throw new Error(errorMessage);
      });
    });

    const { result } = renderHook(() => useFetchJobs({ 
      companyId, 
      syncOnMount: true 
    }));

    await waitFor(() => {
      expect(result.current.syncing).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
  });

  it('should refetch jobs when refetch is called', async () => {
    (fetchJobs as jest.Mock)
      .mockImplementationOnce(async () => {
        return await act(async () => [mockJobs[0]]);
      })
      .mockImplementationOnce(async () => {
        return await act(async () => [mockJobs[1]]);
      });

    const { result } = renderHook(() => useFetchJobs());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.jobs).toEqual([mockJobs[0]]);

    await act(async () => {
      await result.current.refetch();
    });

    expect(fetchJobs).toHaveBeenCalledTimes(2);
    expect(result.current.jobs).toEqual([mockJobs[1]]);
  });

  it('should sync and fetch when syncAndFetchJobs is called', async () => {
    const companyId = 'company-123';
    (syncJobs as jest.Mock).mockImplementation(async () => {
      return await act(async () => ({}));
    });
    (fetchJobs as jest.Mock).mockImplementation(async () => {
      return await act(async () => mockJobs);
    });

    const { result } = renderHook(() => useFetchJobs({ companyId }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    jest.clearAllMocks();

    await act(async () => {
      await result.current.syncAndFetchJobs();
    });

    expect(syncJobs).toHaveBeenCalledWith(companyId);
    expect(fetchJobs).toHaveBeenCalledWith(companyId);
    expect(result.current.jobs).toEqual(mockJobs);
  });

  it('should handle empty jobs array', async () => {
    (fetchJobs as jest.Mock).mockImplementation(async () => {
      return await act(async () => []);
    });

    const { result } = renderHook(() => useFetchJobs());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.jobs).toEqual([]);
  });
});
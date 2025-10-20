import { renderHook, act, waitFor } from '@testing-library/react';
import { useFetchJobDetails } from './useFetchJobDetails';
import { fetchJobDetails } from '@/app/utils/fetchJobDetails';
import { updateJobState } from '../utils/updateJobState';
import { fetchJobCandidates } from '../utils/fetchJobCandidates';

jest.mock('@/app/utils/fetchJobDetails');
jest.mock('../utils/updateJobState');
jest.mock('../utils/fetchJobCandidates');

const mockRawJob = {
  job_id: 123,
  company_name: 'Tech Corp',
  job_title: 'Senior Developer',
  job_description: 'An amazing job opportunity',
  posted_at: '2023-01-15',
  state: 'published',
  status: 'active',
  total_applicants: 5,
  generated_job_summary: 'Great job for developers'
};

const mockTransformedJob = {
  job_id: 123,
  company_name: 'Tech Corp',
  job_title: 'Senior Developer',
  job_description: 'An amazing job opportunity',
  created_at: 'Jan 15, 2023',
  status: 'Published',
  total_applicants: 5,
  generated_job_summary: 'Great job for developers',
  posted_at: '2023-01-15', 
  state: 'published' 
};

const mockRawCandidates = [
  {
    candidate_id: 1,
    job: 123,
    job_title: 'Senior Developer',
    company_name: 'Tech Corp',
    odoo_candidate_id: 1001,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    generated_skill_summary: 'Great skills',
    state: 'applied',
    partner_id: 2001,
    date_open: '2023-01-16',
    date_last_stage_update: '2023-01-17',
    created_at: '2023-01-16',
    updated_at: '2023-01-17'
  },
  {
    candidate_id: 2,
    job: 123,
    job_title: 'Senior Developer',
    company_name: 'Tech Corp',
    odoo_candidate_id: 1002,
    name: 'False',
    email: 'False',
    phone: '987-654-3210',
    generated_skill_summary: null,
    state: 'interview',
    partner_id: 2002,
    date_open: '2023-01-18',
    date_last_stage_update: '2023-01-19',
    created_at: '2023-01-18',
    updated_at: '2023-01-19'
  }
];

const mockTransformedCandidates = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    stage: 'Applied',
    interview_status: 'Not Scheduled'
  },
  {
    id: 2,
    name: 'Not Available',
    email: 'Not Available',
    stage: 'Interview',
    interview_status: 'Not Scheduled'
  }
];

describe('useFetchJobDetails', () => {
  const jobId = '123';

  beforeEach(() => {
    jest.clearAllMocks();
    
    (fetchJobDetails as jest.Mock).mockResolvedValue({ job: mockRawJob });
    (fetchJobCandidates as jest.Mock).mockResolvedValue(mockRawCandidates);
    (updateJobState as jest.Mock).mockResolvedValue({ ...mockRawJob, state: 'closed' });
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useFetchJobDetails(jobId));

    expect(result.current.job).toBe(null);
    expect(result.current.candidates).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.updating).toBe(false);
    expect(typeof result.current.handleStateUpdate).toBe('function');
  });

  it('should fetch and transform job and candidate data', async () => {
    const { result } = renderHook(() => useFetchJobDetails(jobId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetchJobDetails).toHaveBeenCalledWith(jobId);
    
    expect(fetchJobCandidates).toHaveBeenCalledWith(jobId);
    
    expect(result.current.job).toEqual(mockTransformedJob);
    
    expect(result.current.candidates).toEqual(mockTransformedCandidates);
    
    expect(result.current.error).toBe(null);
  });

  it('should handle fetchJobDetails error', async () => {
    const errorMessage = 'Failed to fetch job details';
    (fetchJobDetails as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useFetchJobDetails(jobId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.job).toBe(null);
    expect(result.current.candidates).toEqual([]);
  });

  it('should handle fetchJobCandidates error', async () => {
    const errorMessage = 'Failed to fetch candidates';
    (fetchJobCandidates as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useFetchJobDetails(jobId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.job).toEqual(mockTransformedJob);
    expect(result.current.candidates).toEqual([]);
  });

  it('should handle non-array candidate response', async () => {
    (fetchJobCandidates as jest.Mock).mockResolvedValue({ not: 'an array' });

    const { result } = renderHook(() => useFetchJobDetails(jobId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.candidates).toEqual([]);
  });

  it('should transform candidate data correctly', async () => {
    const { result } = renderHook(() => useFetchJobDetails(jobId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.candidates[0].name).toBe('John Doe');
    expect(result.current.candidates[0].email).toBe('john@example.com');
    expect(result.current.candidates[0].stage).toBe('Applied');
    expect(result.current.candidates[0].interview_status).toBe('Not Scheduled');
    
    expect(result.current.candidates[1].name).toBe('Not Available');
    expect(result.current.candidates[1].email).toBe('Not Available');
  });

  it('should transform job data correctly', async () => {
    const { result } = renderHook(() => useFetchJobDetails(jobId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.job?.created_at).toBe('Jan 15, 2023');
    expect(result.current.job?.status).toBe('Published');
    expect(result.current.job?.total_applicants).toBe(5);
  });

  it('should handle missing job state and status', async () => {
    const jobWithoutState = { ...mockRawJob, state: undefined, status: undefined };
    (fetchJobDetails as jest.Mock).mockResolvedValue({ job: jobWithoutState });

    const { result } = renderHook(() => useFetchJobDetails(jobId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.job?.status).toBe('Open');
  });

  it('should handle missing total_applicants', async () => {
    const jobWithoutApplicants = { ...mockRawJob, total_applicants: undefined };
    (fetchJobDetails as jest.Mock).mockResolvedValue({ job: jobWithoutApplicants });

    const { result } = renderHook(() => useFetchJobDetails(jobId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.job?.total_applicants).toBe(0);
  });

  it('should handle handleStateUpdate error', async () => {
    const errorMessage = 'Failed to update job';
    (updateJobState as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useFetchJobDetails(jobId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await expect(result.current.handleStateUpdate('closed')).rejects.toThrow(errorMessage);
    });

    expect(result.current.error).toBe(errorMessage);
  });

  it('should not update if job is null', async () => {
    (fetchJobDetails as jest.Mock).mockRejectedValue(new Error('Job not found'));

    const { result } = renderHook(() => useFetchJobDetails(jobId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.job).toBe(null);

    await act(async () => {
      const resultPromise = result.current.handleStateUpdate('closed');
      await expect(resultPromise).resolves.toBeUndefined();
    });

    expect(updateJobState).not.toHaveBeenCalled();
  });

  it('should dispatch custom event on state update', async () => {
    const dispatchSpy = jest.spyOn(window, 'dispatchEvent');
    
    const { result } = renderHook(() => useFetchJobDetails(jobId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.handleStateUpdate('closed');
    });

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'jobUpdated',
        detail: { jobId, state: 'closed' }
      })
    );

    dispatchSpy.mockRestore();
  });
});
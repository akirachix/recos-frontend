import { renderHook, act } from '@testing-library/react';
import { useCreateInterview, CreateInterviewPayload } from './useCreateInterview';
import { fetchCreateInterview } from '../utils/fetchCreateInterview';

jest.mock('../utils/fetchCreateInterview');

const mockedFetchCreateInterview = fetchCreateInterview as jest.Mock;

describe('useCreateInterview Hook', () => {
  const initialPayload: Partial<CreateInterviewPayload> = {
    title: 'Initial Title',
    candidate_email: 'test@example.com',
    candidate_name: 'John Doe',
    candidate: 123,
    recruiter: 321,
    scheduled_at: '2025-09-20T14:00',
    duration: 90,
    description: 'Initial description',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes state from initial props', () => {
    const { result } = renderHook(() => useCreateInterview(initialPayload));

    expect(result.current.title).toBe(initialPayload.title);
    expect(result.current.candidateEmail).toBe(initialPayload.candidate_email);
    expect(result.current.candidateName).toBe(initialPayload.candidate_name);
    expect(result.current.candidateId).toBe(initialPayload.candidate);
    expect(result.current.recruiterId).toBe(initialPayload.recruiter);
    expect(result.current.scheduledAt).toBe(initialPayload.scheduled_at?.slice(0, 16));
    expect(result.current.duration).toBe(initialPayload.duration);
    expect(result.current.description).toBe(initialPayload.description);
  });

  it('resets state correctly', () => {
    const { result } = renderHook(() => useCreateInterview(initialPayload));

    act(() => {
      result.current.reset();
    });

    expect(result.current.title).toBe('');
    expect(result.current.candidateEmail).toBe('');
    expect(result.current.candidateName).toBe('');
    expect(result.current.candidateId).toBeNull();
    expect(result.current.recruiterId).toBeNull();
    expect(result.current.scheduledAt).toBe('');
    expect(result.current.duration).toBe(60);
    expect(result.current.description).toBe('');
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('updates individual states via setters', () => {
    const { result } = renderHook(() => useCreateInterview());

    act(() => {
      result.current.setTitle('New Title');
      result.current.setCandidateEmail('new@example.com');
      result.current.setCandidateName('Jane Smith');
      result.current.setCandidateId(42);
      result.current.setRecruiterId(24);
      result.current.setScheduledAt('2025-10-01T10:30');
      result.current.setDuration(120);
      result.current.setDescription('Updated Description');
    });

    expect(result.current.title).toBe('New Title');
    expect(result.current.candidateEmail).toBe('new@example.com');
    expect(result.current.candidateName).toBe('Jane Smith');
    expect(result.current.candidateId).toBe(42);
    expect(result.current.recruiterId).toBe(24);
    expect(result.current.scheduledAt).toBe('2025-10-01T10:30');
    expect(result.current.duration).toBe(120);
    expect(result.current.description).toBe('Updated Description');
  });

  it('handles successful createInterview call', async () => {
    const mockResponse = { id: 1, message: 'Interview created' };
    mockedFetchCreateInterview.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useCreateInterview());
    let response;

    await act(async () => {
      response = await result.current.createInterview({ title: 'Interview 1' });
    });

    expect(response).toEqual(mockResponse);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('handles error from createInterview call', async () => {
    const errorMessage = 'Network Error';
    mockedFetchCreateInterview.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useCreateInterview());

    await act(async () => {
      await expect(result.current.createInterview({ title: 'Test Error' })).rejects.toThrow(errorMessage);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).not.toBeNull();
    expect(result.current.error?.message).toBe(errorMessage);
  });
});

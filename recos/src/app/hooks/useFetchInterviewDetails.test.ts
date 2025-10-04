import { renderHook, act, waitFor } from '@testing-library/react';
import { useInterviewDetails } from './useFetchInterviewDetails';
import * as fetchModule from '../utils/fetchInterviewById';

jest.mock('../utils/fetchInterviewById', () => ({
  fetchInterviewById: jest.fn(),
}));

const mockInterview = {
  id: 1,
  candidate_id: 101,
  candidate_name: 'John Doe',
  candidate_email: 'john.doe@example.com',
  recruiter_name: 'Jane Smith',
  recruiter_email: 'jane.smith@example.com',
  scheduled_at: '2025-10-01T10:00:00Z',
  duration: 30,
  status: 'scheduled',
  created_at: '2025-09-30T09:00:00Z',
  description: 'Test interview',
  interview_link: 'https://zoom.us/test',
  google_calendar_link: 'https://calendar.google.com/event',
};

describe('useInterviewDetails Hook', () => {
  const token = 'mock-token';
  const apiBaseUrl = 'http://localhost:3000';
  const selectedInterviewId = 1;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with null interview, no loading, and no error when modal is closed', () => {
    const { result } = renderHook(() =>
      useInterviewDetails(selectedInterviewId, token, apiBaseUrl, false)
    );

    expect(result.current.selectedInterview).toBeNull();
    expect(result.current.loadingDetails).toBe(false);
    expect(result.current.detailError).toBeNull();
    expect(fetchModule.fetchInterviewById).not.toHaveBeenCalled();
  });

  it('should initialize with null interview, no loading, and no error when selectedInterviewId is null', () => {
    const { result } = renderHook(() =>
      useInterviewDetails(null, token, apiBaseUrl, true)
    );

    expect(result.current.selectedInterview).toBeNull();
    expect(result.current.loadingDetails).toBe(false);
    expect(result.current.detailError).toBeNull();
    expect(fetchModule.fetchInterviewById).not.toHaveBeenCalled();
  });

  it('should fetch and set interview details when modal is open and selectedInterviewId is provided', async () => {
    (fetchModule.fetchInterviewById as jest.Mock).mockResolvedValue(mockInterview);

    const { result } = renderHook(() =>
      useInterviewDetails(selectedInterviewId, token, apiBaseUrl, true)
    );

    expect(result.current.loadingDetails).toBe(true);
    expect(result.current.detailError).toBeNull();
    expect(result.current.selectedInterview).toBeNull();

    await waitFor(() => {
      expect(result.current.loadingDetails).toBe(false);
    });

    expect(fetchModule.fetchInterviewById).toHaveBeenCalledWith(token, selectedInterviewId);
    expect(result.current.selectedInterview).toEqual(mockInterview);
    expect(result.current.loadingDetails).toBe(false);
    expect(result.current.detailError).toBeNull();
  });

  it('should handle error when fetchInterviewById fails', async () => {
    const errorMessage = 'Failed to fetch interview';
    (fetchModule.fetchInterviewById as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() =>
      useInterviewDetails(selectedInterviewId, token, apiBaseUrl, true)
    );

    expect(result.current.loadingDetails).toBe(true);
    expect(result.current.detailError).toBeNull();
    expect(result.current.selectedInterview).toBeNull();

    await waitFor(() => {
      expect(result.current.loadingDetails).toBe(false);
    });

    expect(fetchModule.fetchInterviewById).toHaveBeenCalledWith(token, selectedInterviewId);
    expect(result.current.selectedInterview).toBeNull();
    expect(result.current.loadingDetails).toBe(false);
    expect(result.current.detailError).toEqual(errorMessage);
  });

  it('should reset state when modalOpen changes to false', async () => {
    (fetchModule.fetchInterviewById as jest.Mock).mockResolvedValue(mockInterview);

    const { result, rerender } = renderHook(
      ({ modalOpen }) => useInterviewDetails(selectedInterviewId, token, apiBaseUrl, modalOpen),
      { initialProps: { modalOpen: true } }
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.selectedInterview).toEqual(mockInterview);
    expect(result.current.loadingDetails).toBe(false);
    expect(result.current.detailError).toBeNull();

    rerender({ modalOpen: false });

    expect(result.current.selectedInterview).toBeNull();
    expect(result.current.loadingDetails).toBe(false);
    expect(result.current.detailError).toBeNull();
    expect(fetchModule.fetchInterviewById).toHaveBeenCalledTimes(1);
  });

  it('should reset state and refetch when selectedInterviewId changes', async () => {
    (fetchModule.fetchInterviewById as jest.Mock).mockResolvedValue(mockInterview);

    const { result, rerender } = renderHook(
      ({ id }) => useInterviewDetails(id, token, apiBaseUrl, true),
      { initialProps: { id: selectedInterviewId } }
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(fetchModule.fetchInterviewById).toHaveBeenCalledWith(token, selectedInterviewId);
    expect(result.current.selectedInterview).toEqual(mockInterview);

    const newInterviewId = 2;
    const newInterview = { ...mockInterview, id: newInterviewId };
    (fetchModule.fetchInterviewById as jest.Mock).mockResolvedValue(newInterview);

    rerender({ id: newInterviewId });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(fetchModule.fetchInterviewById).toHaveBeenCalledWith(token, newInterviewId);
    expect(result.current.selectedInterview).toEqual(newInterview);
    expect(result.current.loadingDetails).toBe(false);
    expect(result.current.detailError).toBeNull();
  });
});

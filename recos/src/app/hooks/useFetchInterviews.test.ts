import { renderHook, waitFor } from '@testing-library/react';
import { useFetchInterviews } from './useFetchInterviews';
import { fetchInterviews } from '../utils/fetchInterview';
import { useToken } from './useToken';

jest.mock('../utils/fetchInterview');
jest.mock('./useToken');

describe('useFetchInterviews', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should handle loading and data correctly when token is present', async () => {
    const mockToken = 'mock-token';
    const mockData = [
      { id: 1, candidate_id: 11, scheduled_at: '2025-10-01T10:00:00Z', created_at: '2025-09-20T10:00:00Z' },
      { id: 2, candidate_id: 12, scheduled_at: '2025-10-02T11:00:00Z' }
    ];
    
    (useToken as jest.Mock).mockReturnValue(mockToken);
    (fetchInterviews as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => useFetchInterviews());
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.events).toEqual([]);
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.events).toEqual([
        { id: 1, date: '2025-10-01T10:00:00Z', label: 'Interview', created_at: '2025-09-20T10:00:00Z', scheduled_at: '2025-10-01T10:00:00Z', candidate_email: '', candidate_name: '', position: '', interview_link: undefined, google_calendar_link: undefined, calendar_event: undefined, description: undefined, duration: undefined, status: undefined },
        { id: 2, date: '2025-10-02T11:00:00Z', label: 'Interview', created_at: undefined, scheduled_at: '2025-10-02T11:00:00Z', candidate_email: '', candidate_name: '', position: '', interview_link: undefined, google_calendar_link: undefined, calendar_event: undefined, description: undefined, duration: undefined, status: undefined }
      ]);
    });
  });

  test('should set error and empty events if no token', async () => {
    (useToken as jest.Mock).mockReturnValue(null);

    const { result } = renderHook(() => useFetchInterviews());

    expect(result.current.loading).toBe(false);
    expect(result.current.events).toEqual([]);
  });

  test('should handle fetch error', async () => {
    const mockToken = 'mock-token';
    (useToken as jest.Mock).mockReturnValue(mockToken);
    (fetchInterviews as jest.Mock).mockRejectedValue(new Error('Fetch failed'));

    const { result } = renderHook(() => useFetchInterviews());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('Fetch failed');
      expect(result.current.events).toEqual([]);
    });
  });
});

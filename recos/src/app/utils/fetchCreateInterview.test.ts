import { renderHook, act } from '@testing-library/react';
import { useCreateInterview, CreateInterviewPayload } from '../hooks/useCreateInterview';

jest.mock('../utils/fetchCreateInterview', () => ({
  fetchCreateInterview: jest.fn(),
}));

import { fetchCreateInterview } from '../utils/fetchCreateInterview';

describe('useCreateInterview Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles successful createInterview call', async () => {
    const mockResponse = { id: 1, message: 'Interview created' };
    (fetchCreateInterview as jest.Mock).mockResolvedValueOnce(mockResponse);
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
    (fetchCreateInterview as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
    const { result } = renderHook(() => useCreateInterview());

    await act(async () => {
      await expect(result.current.createInterview({ title: 'Test Error' })).rejects.toThrow(errorMessage);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error?.message).toBe(errorMessage);
  });
});

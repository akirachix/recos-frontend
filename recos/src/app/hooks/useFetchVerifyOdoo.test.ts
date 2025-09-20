import { renderHook, act } from '@testing-library/react';
import { useVerifyOdoo } from './useFetchVerifyOdoo';
import * as fetchModule from '../utils/fetchVerifyOdoo';

jest.mock('../utils/fetchVerifyOdoo');

describe('useVerifyOdoo hook', () => {
  const mockVerifyOdoo = fetchModule.verifyOdoo as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns message when verify succeeds', async () => {
    const message = 'Verification successful';
    mockVerifyOdoo.mockResolvedValueOnce(message);

    const { result } = renderHook(() => useVerifyOdoo());

    let verifyResult;
    await act(async () => {
      verifyResult = await result.current.verify({ some: 'credentials' });
    });

    expect(mockVerifyOdoo).toHaveBeenCalledWith({ some: 'credentials' });
    expect(result.current.error).toBeNull();
    expect(verifyResult).toBe(message);
  });

  it('sets error when verify fails', async () => {
    const errorMessage = 'Verification failed';
    mockVerifyOdoo.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useVerifyOdoo());

    await act(async () => {
      await result.current.verify({ some: 'credentials' });
    });

    expect(mockVerifyOdoo).toHaveBeenCalledWith({ some: 'credentials' });
    expect(result.current.error).toBe(errorMessage);
  });
});

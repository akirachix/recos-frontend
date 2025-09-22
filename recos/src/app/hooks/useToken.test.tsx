import { renderHook } from '@testing-library/react';

import { useToken } from './useToken';

describe('useToken hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns token from localStorage', () => {
    const mockToken = 'mocked-token';
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue(mockToken);
    const { result } = renderHook(() => useToken());
    expect(result.current).toBe(mockToken);
    (window.localStorage.getItem as jest.Mock).mockRestore();
  });
  it('returns null if no token in localStorage', () => {
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue(null);
    const { result } = renderHook(() => useToken());
    expect(result.current).toBeNull();
    (window.localStorage.getItem as jest.Mock).mockRestore();
  });
});

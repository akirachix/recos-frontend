import { renderHook, waitFor } from '@testing-library/react';
import { useFetchUser } from './useFetchUser';
import * as fetchUserModule from '@/utils/fetchUser';
jest.mock('@/utils/fetchUser');
const mockFetchUser = fetchUserModule.fetchUser as jest.Mock;
describe('useFetchUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should fetch user successfully and set states correctly', async () => {
    const mockUserData = { id: 1, first_name: 'John', last_name: 'Doe', email: 'john@example.com', image: null };
    mockFetchUser.mockResolvedValue(mockUserData);
    const { result } = renderHook(() => useFetchUser());
    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBe(null);
    expect(result.current.error).toBe(null);
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.user).toEqual(mockUserData);
    expect(result.current.error).toBe(null);
    expect(mockFetchUser).toHaveBeenCalledTimes(1);
  });
  it('should handle array response and take first element', async () => {
    const mockUserData = [
      { id: 1, first_name: 'John', last_name: 'Doe', email: 'john@example.com' },
      { id: 2, first_name: 'Jane', last_name: 'Smith' },
    ];
    mockFetchUser.mockResolvedValue(mockUserData);
    const { result } = renderHook(() => useFetchUser());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.user).toEqual(mockUserData[0]);
  });
  it('should handle falsy user data and set user to null', async () => {
    mockFetchUser.mockResolvedValue(null);
    const { result } = renderHook(() => useFetchUser());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.user).toBe(null);
  });
  it('should set error on fetch failure', async () => {
    const mockError = new Error('Failed to fetch user');
    mockFetchUser.mockRejectedValue(mockError);
    const { result } = renderHook(() => useFetchUser());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.error).toBe(mockError.message);
    expect(result.current.user).toBe(null);
  });
  it('should run effect only once on mount', async () => {
    mockFetchUser.mockResolvedValue({ id: 1 });
    const { rerender } = renderHook(() => useFetchUser());
    await waitFor(() => {
      expect(mockFetchUser).toHaveBeenCalledTimes(1);
    });
    rerender();
    expect(mockFetchUser).toHaveBeenCalledTimes(1);
  });
});
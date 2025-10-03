import { renderHook, waitFor } from '@testing-library/react';
import { useFetchUser } from './useFetchUser';
import { fetchUser } from '@/app/utils/fetchUser';

jest.mock('@/app/utils/fetchUser');

const mockFetchUser = fetchUser as jest.MockedFunction<typeof fetchUser>;

describe('useFetchUser Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with correct default states', () => {
    const { result } = renderHook(() => useFetchUser());

    expect(result.current.user).toBe(null);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
  });

  it('should set user and clear error on successful fetch with single user object', async () => {
    const mockUser = {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      image: null,
      notifications: [{ type: 'new_message', count: 2 }],
    };
    mockFetchUser.mockResolvedValue(mockUser);

    const { result } = renderHook(() => useFetchUser());

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.error).toBe(null);
    expect(mockFetchUser).toHaveBeenCalledTimes(1);
  });

  it('should set user and clear error on successful fetch with array of users', async () => {
    const mockUser = {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      image: null,
      notifications: [{ type: 'new_message', count: 2 }],
    };
    mockFetchUser.mockResolvedValue([mockUser]);

    const { result } = renderHook(() => useFetchUser());

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.error).toBe(null);
    expect(mockFetchUser).toHaveBeenCalledTimes(1);
  });

  it('should set user to null and clear error on successful fetch with empty data', async () => {
    mockFetchUser.mockResolvedValue(null);

    const { result } = renderHook(() => useFetchUser());

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.user).toBe(null);
    expect(result.current.error).toBe(null);
    expect(mockFetchUser).toHaveBeenCalledTimes(1);
  });

  it('should set error and user to null on failed fetch', async () => {
    mockFetchUser.mockRejectedValue(new Error('Failed to fetch user'));

    const { result } = renderHook(() => useFetchUser());

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.user).toBe(null);
    expect(result.current.error).toBe('Failed to fetch user');
    expect(mockFetchUser).toHaveBeenCalledTimes(1);
  });
});
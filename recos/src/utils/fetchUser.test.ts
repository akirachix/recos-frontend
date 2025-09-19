import { fetchUser } from '@/utils/fetchUser';

global.fetch = jest.fn();

describe('fetchUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch user data successfully', async () => {
    const mockUserData = { id: 1, first_name: 'John', last_name: 'Doe', email: 'john@example.com' };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockUserData),
    });

    const result = await fetchUser();

    expect(result).toEqual(mockUserData);
    expect(global.fetch).toHaveBeenCalledWith('/api/users');
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if response is not ok with error message from JSON', async () => {
    const errorMessage = 'User not found';
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({ error: errorMessage }),
    });

    await expect(fetchUser()).rejects.toThrow(errorMessage);
    expect(global.fetch).toHaveBeenCalledWith('/api/users');
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should throw a default error if response is not ok and no error message in JSON', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({}),
    });

    await expect(fetchUser()).rejects.toThrow('Failed to fetch user');
    expect(global.fetch).toHaveBeenCalledWith('/api/users');
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should throw a network error if fetch fails', async () => {
    const networkError = new Error('Network error');
    (global.fetch as jest.Mock).mockRejectedValue(networkError);

    await expect(fetchUser()).rejects.toThrow('Network error');
    expect(global.fetch).toHaveBeenCalledWith('/api/users');
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
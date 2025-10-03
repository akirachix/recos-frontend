import { fetchLogout } from './fetchLogout';
import { getAuthToken } from './useToken';

jest.mock('./useToken');

describe('fetchLogout', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    global.fetch = jest.fn(); 
  });

  it('should successfully logout and return result', async () => {
    (getAuthToken as jest.Mock).mockReturnValue('mocked-token');

    const mockResponseData = { success: true };
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponseData,
    });

    const result = await fetchLogout();

    expect(getAuthToken).toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledWith('/api/logout', {
      method: 'POST',
      headers: {
        Authorization: 'Token mocked-token',
        'Content-Type': 'application/json',
      },
    });
    expect(result).toEqual(mockResponseData);
  });

  it('should throw error if no token found', async () => {
    (getAuthToken as jest.Mock).mockReturnValue(null);

    await expect(fetchLogout()).rejects.toThrow('No token found.');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('should throw error if response not ok', async () => {
    (getAuthToken as jest.Mock).mockReturnValue('mocked-token');

    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      statusText: 'Unauthorized',
    });

    await expect(fetchLogout()).rejects.toThrow('Logout failed: Unauthorized');
  });

  it('should throw error on fetch failure', async () => {
    (getAuthToken as jest.Mock).mockReturnValue('mocked-token');

    (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    await expect(fetchLogout()).rejects.toThrow(
      'An error occurred during logout: Network error'
    );
  });
});

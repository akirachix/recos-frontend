
import { fetchCompanies } from './fetchCompanies';
import { getAuthToken } from './useToken';

global.fetch = jest.fn();

describe('fetchCompanies', () => {
  const mockToken = 'test-token';
  const baseUrl = '/api/companies/';
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch companies successfully with valid token', async () => {
    const mockResponse = {
      data: [{ id: 1, name: 'Company A' }, { id: 2, name: 'Company B' }],
    };
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await fetchCompanies(mockToken);

    expect(global.fetch).toHaveBeenCalledWith(baseUrl, {
      headers: {
        Authorization: `Token ${mockToken}`,
        'Content-Type': 'application/json',
      },
    });
    expect(result).toEqual(mockResponse.data);
  });

  it('should return empty array if response.data is undefined', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({}),
    });

    const result = await fetchCompanies(mockToken);

    expect(result).toEqual([]);
  });

  it('should throw error when response is not ok', async () => {
    const errorMessage = 'Unauthorized';
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: jest.fn().mockResolvedValueOnce(errorMessage),
    });

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await expect(fetchCompanies(mockToken)).rejects.toThrow(errorMessage);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error in fetchCompanies:', expect.any(Error));

    consoleErrorSpy.mockRestore();
  });

  it('should throw generic error when response text is empty', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: jest.fn().mockResolvedValueOnce(''),
    });

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await expect(fetchCompanies(mockToken)).rejects.toThrow('Failed to fetch companies, status 500');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error in fetchCompanies:', expect.any(Error));

    consoleErrorSpy.mockRestore();
  });

  it('should handle network errors', async () => {
    const networkError = new Error('Network error');
    (global.fetch as jest.Mock).mockRejectedValueOnce(networkError);

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await expect(fetchCompanies(mockToken)).rejects.toThrow(networkError);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error in fetchCompanies:', networkError);

    consoleErrorSpy.mockRestore();
  });
});
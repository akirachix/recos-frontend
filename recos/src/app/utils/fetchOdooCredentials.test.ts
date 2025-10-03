import { postOdooCredentials } from '../utils/fetchOdooCredentials';

describe('postOdooCredentials', () => {
  const token = 'test-token';
  const credentials = { db_url: 'http://recos.odoo.com', db_name: 'recos' };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns JSON data on successful POST', async () => {
    const mockResponseData = { success: true };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => Promise.resolve(mockResponseData),
      text: async () => Promise.resolve(JSON.stringify(mockResponseData)),
    });

    const data = await postOdooCredentials(token, credentials);

    expect(global.fetch).toHaveBeenCalledWith('/api/odoo-credentials/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(credentials),
    });
    expect(data).toEqual(mockResponseData);
  });

  it('returns error-like object on fetch rejection', async () => {
    const error = new Error('Network error');
    global.fetch = jest.fn().mockRejectedValue(error);

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const result = await postOdooCredentials(token, credentials);

    expect(result).toEqual({
      error: 'Network error or server unreachable',
      status: 500,
    });
<<<<<<< HEAD
  });

  it('throws error if fetch rejects', async () => {
    const error = new Error('Network error');
    global.fetch = jest.fn().mockRejectedValue(error);
    await expect(postOdooCredentials(token, credentials)).rejects.toThrow('Network error');
=======

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error in postOdooCredentials:', error);
    consoleErrorSpy.mockRestore();
>>>>>>> 2bb68eaca8eb54a90698bdbdcdf40e3175ddbac7
  });
});
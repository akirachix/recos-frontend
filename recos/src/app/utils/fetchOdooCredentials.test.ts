import { postOdooCredentials } from '../utils/fetchOdooCredentials';

describe('postOdooCredentials', () => {
  const token = 'test-token';
  const credentials = { db_url: 'http://recos.odoo.com', db_name: 'recos' };
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.resetAllMocks();
    consoleErrorSpy = jest.spyOn(global.console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
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

    const result = await postOdooCredentials(token, credentials);

    expect(result).toEqual({
      error: 'Network error',
      status: 500,
    });
  });
});

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

    expect(global.fetch).toHaveBeenCalledWith('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(credentials),
    });
    expect(data).toEqual(mockResponseData);
  });

  it('returns error-like object on failed POST', async () => {
    const errorMessage = 'Invalid credentials';
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => Promise.reject(new Error('Not JSON')),
      text: async () => Promise.resolve(errorMessage),
    });

    const result = await postOdooCredentials(token, credentials);

    expect(result).toEqual({
      error: errorMessage,
      status: 401,
    });
  });

  it('throws error if fetch rejects', async () => {
    const error = new Error('Network error');
    global.fetch = jest.fn().mockRejectedValue(error);

    await expect(postOdooCredentials(token, credentials)).rejects.toThrow('Network error');
  });
});

import { verifyOdoo } from '../utils/fetchVerifyOdoo';

describe('verifyOdoo', () => {
  const token = 'test-token';
  const credentials = { db_url: 'http://recos.odoo.com', db_name: 'recos' };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns JSON data on successful POST', async () => {
    const mockResponseData = { verified: true };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockResponseData,
      text: async () => JSON.stringify(mockResponseData),
    });

    const data = await verifyOdoo(credentials, token);

    expect(global.fetch).toHaveBeenCalledWith('/api/verify-odoo/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(credentials),
    });
    expect(data).toEqual(mockResponseData);
  });

  it('returns error-like object on failed POST with JSON error', async () => {
    const errorMessage = 'Verification failed';
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ error: errorMessage }),
    });

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const result = await verifyOdoo(credentials, token);

    expect(result).toEqual({
      error: errorMessage,
      status: 400,
      valid: false,
    });

    expect(consoleErrorSpy).not.toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it('returns error-like object on fetch rejection', async () => {
    const error = new Error('Network error');
    global.fetch = jest.fn().mockRejectedValue(error);

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const result = await verifyOdoo(credentials, token);

    expect(result).toEqual({
      error: 'Network error or server unreachable',
      status: 500,
      valid: false,
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error in verifyOdoo:', error);
    consoleErrorSpy.mockRestore();
  });
});
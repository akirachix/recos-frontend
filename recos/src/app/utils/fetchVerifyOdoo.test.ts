import { verifyOdoo } from '../utils/fetchVerifyOdoo';

describe('verifyOdoo', () => {
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

    const data = await verifyOdoo(credentials);

    expect(global.fetch).toHaveBeenCalledWith('/api/verify-odoo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    expect(data).toEqual(mockResponseData);
  });

  it('returns error-like object on failed POST', async () => {
    const errorMessage = 'Verification failed';
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => { throw new Error('Not JSON'); }, 
      text: async () => errorMessage,
    });

    const result = await verifyOdoo(credentials);
    expect(result).toEqual(expect.objectContaining({
      status: expect.any(Number),
    }));
  });

  it('throws error when fetch rejects', async () => {
    const error = new Error('Network error');
    global.fetch = jest.fn().mockRejectedValue(error);

    await expect(verifyOdoo(credentials)).rejects.toThrow('Network error');
  });
});

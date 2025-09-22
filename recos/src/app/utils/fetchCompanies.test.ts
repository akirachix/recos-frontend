import { fetchCompanies } from './fetchCompanies';

describe('fetchCompanies', () => {
  const token = 'test-token';

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns data when fetch is successful', async () => {
    const mockData = [{ id: 1, name: 'Zojo' }];
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockData,
      text: async () => JSON.stringify(mockData),
    });

    const data = await fetchCompanies(token);

    expect(global.fetch).toHaveBeenCalledWith('/api/companies/', {
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });
    expect(data).toEqual(mockData);
  });

  it('throws an error when error message includes "already exist"', async () => {
    const errorMessage = 'Company already exists';
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => { throw new Error('Not JSON'); },
      text: async () => errorMessage,
    });

    await expect(fetchCompanies(token)).rejects.toThrow(errorMessage);
  });

  it('throws an error when error message does not include "already exist"', async () => {
    const errorMessage = 'Some other error';
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => { throw new Error('Not JSON'); },
      text: async () => errorMessage,
    });

    await expect(fetchCompanies(token)).rejects.toThrow(errorMessage);
  });

  it('throws error if fetch rejects', async () => {
    const error = new Error('Network error');
    global.fetch = jest.fn().mockRejectedValue(error);

    await expect(fetchCompanies(token)).rejects.toThrow('Network error');
  });
});

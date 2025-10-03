
import { fetchCompanies } from './fetchCompanies';
import { getAuthToken } from './useToken';

jest.mock('./authToken');

describe('fetchCompanies', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getAuthToken as jest.Mock).mockReturnValue('test-token');
  });

  it('returns data when fetch is successful', async () => {
    const mockData = [{ id: 1, name: 'Zojo' }];
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: mockData }), 
      } as Response)
    );

  });

});
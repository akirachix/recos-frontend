import { fetchInterviews } from "./fetchInterview";

describe('fetchInterviews', () => {
  const mockToken = 'mock-token';

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('should fetch and return JSON data when response is ok', async () => {
    const mockResponseData = [
      { id: 1, candidate_id: 11, scheduled_at: '2025-10-01T10:00:00Z', created_at: '2025-09-20T10:00:00Z' }
    ];

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponseData),
      headers: {
        get: jest.fn().mockReturnValue('application/json'),
      },
    });

    const data = await fetchInterviews(mockToken);

    expect(global.fetch).toHaveBeenCalledWith('/api/interview', {
      headers: {
        Authorization: `Token ${mockToken}`,
        'Content-Type': 'application/json',
      },
    });

    expect(data).toEqual(mockResponseData);
  });

  test('should throw error with response text when response not ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: jest.fn().mockResolvedValue({ message: 'Unauthorized' }),
      headers: {
        get: jest.fn().mockReturnValue('application/json'),
      },
    });

    await expect(fetchInterviews(mockToken)).rejects.toThrow('Unauthorized');
  });

  test('should throw error when fetch throws error', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network Error'));

    await expect(fetchInterviews(mockToken)).rejects.toThrow('Network Error');
  });
});

import { fetchInterviewById } from "./fetchInterviewById";

describe('fetchInterviewById', () => {
  const mockToken = 'mock-token';
  const interviewId = 123;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('fetches interview data successfully', async () => {
    const mockData = { id: interviewId, candidate_id: 42, scheduled_at: '2025-10-01T10:00:00Z' };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    });

    const data = await fetchInterviewById(mockToken, interviewId);

    expect(global.fetch).toHaveBeenCalledWith(`/api/interview/${interviewId}`, {
      headers: {
        Authorization: `Token ${mockToken}`,
        'Content-Type': 'application/json',
      },
    });

    expect(data).toEqual(mockData);
  });

  test('throws error if no token provided', async () => {
    await expect(fetchInterviewById(null, interviewId)).rejects.toThrow('Not authenticated');
  });

  test('throws error with response text if response not ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      text: jest.fn().mockResolvedValue('Not found'),
    });

    await expect(fetchInterviewById(mockToken, interviewId)).rejects.toThrow(
      `Couldn't get interview id ${interviewId}: 404 - Not found`
    );
  });

  test('throws error if fetch itself fails', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    await expect(fetchInterviewById(mockToken, interviewId)).rejects.toThrow('Network error');
  });
});

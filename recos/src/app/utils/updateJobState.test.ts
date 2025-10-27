import { updateJobState } from './updateJobState';
import '@testing-library/jest-dom';

global.fetch = jest.fn();

describe('updateJobState', () => {
  const jobId = '123';
  const state = 'open';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should successfully update job state and return response data', async () => {
    const mockResponse = { success: true, data: { jobId, state } };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await updateJobState(jobId, state);

    expect(fetch).toHaveBeenCalledWith(`/api/jobs/${jobId}/update`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ state }),
    });
    expect(result).toEqual(mockResponse);
  });

  test('should throw an error with message from API when response is not OK', async () => {
    const errorMessage = 'Invalid state transition';
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValueOnce({ details: { message: errorMessage } }),
    });

    await expect(updateJobState(jobId, state)).rejects.toThrow(errorMessage);
    expect(fetch).toHaveBeenCalledWith(`/api/jobs/${jobId}/update`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ state }),
    });
  });

  test('should throw default error message when response is not OK and no error details provided', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValueOnce({}),
    });

    await expect(updateJobState(jobId, state)).rejects.toThrow('Failed to update job state');
    expect(fetch).toHaveBeenCalledWith(`/api/jobs/${jobId}/update`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ state }),
    });
  });

  test('should throw network error when fetch fails', async () => {
    const networkError = new Error('Network error');
    (global.fetch as jest.Mock).mockRejectedValueOnce(networkError);

    await expect(updateJobState(jobId, state)).rejects.toThrow('Network error');
    expect(fetch).toHaveBeenCalledWith(`/api/jobs/${jobId}/update`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ state }),
    });
  });
});
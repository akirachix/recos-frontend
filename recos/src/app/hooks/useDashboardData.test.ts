import { renderHook, waitFor } from '@testing-library/react';
import { useDashboardData } from './useDashboardData';
import { fetchJobs } from '../utils/fetchJobs';
import { fetchInterviews } from '../utils/fetchInterview';


jest.mock('../utils/fetchJobs');
jest.mock('../utils/fetchInterview');

const mockedFetchJobs = fetchJobs as jest.Mock;
const mockedFetchInterviews = fetchInterviews as jest.Mock;

describe('useDashboardData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: 'auth_token=test-token',
    });
  });
  it('handles error state when fetching data fails', async () => {
        const errorMessage = "Failed to fetch";
        mockedFetchJobs.mockRejectedValue(new Error(errorMessage));
        mockedFetchInterviews.mockResolvedValue([]);
    
        const { result } = renderHook(() => useDashboardData('1'));
    
        await waitFor(() => {
          expect(result.current.loading).toBe(false);
        });
    
        expect(result.current.error).toBe(errorMessage);  });
});

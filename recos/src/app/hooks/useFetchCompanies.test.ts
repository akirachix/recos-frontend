import { renderHook, act } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import { fetchCompanies } from '../utils/fetchCompanies';
import { getAuthToken } from '../utils/useToken';
import { useCompanies } from './useFetchCompanies';

// Mock the imported utilities
jest.mock('../utils/fetchCompanies');
jest.mock('../utils/useToken');

const mockFetchCompanies = fetchCompanies as jest.Mock;
const mockGetAuthToken = getAuthToken as jest.Mock;

describe('useCompanies Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with correct default states', () => {
    mockGetAuthToken.mockReturnValue(null);
    const { result } = renderHook(() => useCompanies());

    expect(result.current.companies).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Missing token');
  });

  it('should fetch companies successfully with valid token', async () => {
    const mockCompanies = [
      { company_id: '1', company_name: 'Company A' },
      { company_id: '2', company_name: 'Company B' },
    ];
    mockGetAuthToken.mockReturnValue('valid-token');
    mockFetchCompanies.mockResolvedValue(mockCompanies);

    const { result } = renderHook(() => useCompanies());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(null);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.companies).toEqual(mockCompanies);
    expect(result.current.error).toBe(null);
    expect(mockFetchCompanies).toHaveBeenCalledWith('valid-token');
  });

  it('should handle fetch error', async () => {
    mockGetAuthToken.mockReturnValue('valid-token');
    mockFetchCompanies.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useCompanies());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.companies).toEqual([]);
    expect(result.current.error).toBe('Network error');
  });

  it('should call refetch correctly', async () => {
    const mockCompanies = [
      { company_id: '1', company_name: 'Company A' },
    ];
    mockGetAuthToken.mockReturnValue('valid-token');
    mockFetchCompanies.mockResolvedValue(mockCompanies);

    const { result } = renderHook(() => useCompanies());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.companies).toEqual(mockCompanies);

    // Clear previous calls and mock new data
    mockFetchCompanies.mockClear();
    const newCompanies = [
      { company_id: '3', company_name: 'Company C' },
    ];
    mockFetchCompanies.mockResolvedValue(newCompanies);

    // Call refetch
    await act(async () => {
      result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockFetchCompanies).toHaveBeenCalledTimes(1);
    expect(result.current.companies).toEqual(newCompanies);
    expect(result.current.error).toBe(null);
  });

  it('should handle refetch with error', async () => {
    mockGetAuthToken.mockReturnValue('valid-token');
    mockFetchCompanies.mockResolvedValueOnce([
      { company_id: '1', company_name: 'Company A' },
    ]);

    const { result } = renderHook(() => useCompanies());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Mock error for refetch
    mockFetchCompanies.mockClear();
    mockFetchCompanies.mockRejectedValue(new Error('Refetch error'));

    await act(async () => {
      result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.companies).toEqual([]);
    expect(result.current.error).toBe('Refetch error');
  });
});
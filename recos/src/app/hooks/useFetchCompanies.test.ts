<<<<<<< HEAD
import { renderHook } from "@testing-library/react";
import { useToken } from "./useToken";

describe("useToken hook", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return token from cookie", () => {
    jest.spyOn(require("../utils/authToken"), "getAuthToken").mockReturnValue("test-auth-token");

    const { result } = renderHook(() => useToken());

    expect(result.current).toBe("test-auth-token");
  });

  it("should return null if no token", () => {
    jest.spyOn(require("../utils/authToken"), "getAuthToken").mockReturnValue(null);

    const { result } = renderHook(() => useToken());

    expect(result.current).toBeNull();
=======
import { renderHook, act, waitFor } from '@testing-library/react';
import { useCompanies } from './useFetchCompanies';
import { fetchCompanies } from '../utils/fetchCompanies';
import { getAuthToken } from '../utils/useToken';

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
    expect(result.current.error).toBe(null);
  });

  it('should set companies when fetchCompanies returns data', async () => {
    const mockCompanies = [
      { company_id: '1', company_name: 'Company A' },
      { company_id: '2', company_name: 'Company B' },
    ];
    mockGetAuthToken.mockReturnValue('valid-token');
    mockFetchCompanies.mockResolvedValue(mockCompanies);
    const { result } = renderHook(() => useCompanies());
    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.companies).toEqual(mockCompanies);
    expect(result.current.error).toBe(null);
    expect(mockFetchCompanies).toHaveBeenCalledWith('valid-token');
  });

  it('should handle fetch error correctly', async () => {
    mockGetAuthToken.mockReturnValue('valid-token');
    mockFetchCompanies.mockRejectedValue(new Error('Failed to fetch'));
    const { result } = renderHook(() => useCompanies());
    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.companies).toEqual([]);
    expect(result.current.error).toBe('Failed to fetch');
  });

  it('should not fetch if token is null', () => {
    mockGetAuthToken.mockReturnValue(null);
    const { result } = renderHook(() => useCompanies());
    expect(result.current.companies).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(mockFetchCompanies).not.toHaveBeenCalled();
>>>>>>> 2bb68eaca8eb54a90698bdbdcdf40e3175ddbac7
  });
});

<<<<<<< HEAD
=======
  it('should not refetch if already fetched', async () => {
    mockGetAuthToken.mockReturnValue('valid-token');
    mockFetchCompanies.mockResolvedValue([]);
    const { result } = renderHook(() => useCompanies());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await act(async () => {
      await result.current.refetch();
    });
    expect(mockFetchCompanies).toHaveBeenCalledTimes(1);
  });
});
>>>>>>> 2bb68eaca8eb54a90698bdbdcdf40e3175ddbac7

import { renderHook, act } from '@testing-library/react';
import { useVerifyOdoo } from './useFetchVerifyOdoo';
import { verifyOdoo } from '../utils/fetchVerifyOdoo';

jest.mock('../utils/fetchVerifyOdoo');

const mockVerifyOdoo = verifyOdoo as jest.MockedFunction<typeof verifyOdoo>;

describe('useVerifyOdoo Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with correct default states', () => {
    const { result } = renderHook(() => useVerifyOdoo());

    expect(result.current.error).toBe(null);
    expect(result.current.loading).toBe(false);
    expect(typeof result.current.verify).toBe('function');
  });

  it('should return valid result and clear error on successful verification', async () => {
    const mockCredentials = { db_url: 'https://example.odoo.com', db_name: 'testdb', email: 'test@example.com', api_key: 'abc123' };
    const mockToken = 'valid-token';
    mockVerifyOdoo.mockResolvedValue({ valid: true });

    const { result } = renderHook(() => useVerifyOdoo());

    let verifyResult;
    await act(async () => {
      verifyResult = await result.current.verify(mockCredentials, mockToken);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(verifyResult).toEqual({ valid: true });
    expect(mockVerifyOdoo).toHaveBeenCalledWith(mockCredentials, mockToken);
    expect(mockVerifyOdoo).toHaveBeenCalledTimes(1);
  });

  it('should set error and return invalid result when verifyOdoo returns an error', async () => {
    const mockCredentials = { db_url: 'https://example.odoo.com', db_name: 'testdb', email: 'test@example.com', api_key: 'abc123' };
    const mockToken = 'valid-token';
    mockVerifyOdoo.mockResolvedValue({ valid: false, error: 'Invalid credentials' });

    const { result } = renderHook(() => useVerifyOdoo());

    let verifyResult;
    await act(async () => {
      verifyResult = await result.current.verify(mockCredentials, mockToken);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Invalid credentials');
    expect(verifyResult).toEqual({ valid: false, error: 'Invalid credentials' });
    expect(mockVerifyOdoo).toHaveBeenCalledWith(mockCredentials, mockToken);
    expect(mockVerifyOdoo).toHaveBeenCalledTimes(1);
  });

  it('should set error and return invalid result when verifyOdoo throws an error', async () => {
    const mockCredentials = { db_url: 'https://example.odoo.com', db_name: 'testdb', email: 'test@example.com', api_key: 'abc123' };
    const mockToken = 'valid-token';
    mockVerifyOdoo.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useVerifyOdoo());

    let verifyResult;
    await act(async () => {
      verifyResult = await result.current.verify(mockCredentials, mockToken);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Network error');
    expect(verifyResult).toEqual({ valid: false, error: 'Network error' });
    expect(mockVerifyOdoo).toHaveBeenCalledWith(mockCredentials, mockToken);
    expect(mockVerifyOdoo).toHaveBeenCalledTimes(1);
  });

  it('should set error and return invalid result for unknown error', async () => {
    const mockCredentials = { db_url: 'https://example.odoo.com', db_name: 'testdb', email: 'test@example.com', api_key: 'abc123' };
    const mockToken = 'valid-token';
    mockVerifyOdoo.mockRejectedValue({}); 
    const { result } = renderHook(() => useVerifyOdoo());

    let verifyResult;
    await act(async () => {
      verifyResult = await result.current.verify(mockCredentials, mockToken);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('An unknown error occurred');
    expect(verifyResult).toEqual({ valid: false, error: 'An unknown error occurred' });
    expect(mockVerifyOdoo).toHaveBeenCalledWith(mockCredentials, mockToken);
    expect(mockVerifyOdoo).toHaveBeenCalledTimes(1);
  });
});
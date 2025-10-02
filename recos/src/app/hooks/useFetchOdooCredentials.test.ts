import { renderHook, act} from '@testing-library/react';
import { useOdooAuth } from './useFetchOdooCredentials';
import { useVerifyOdoo } from './useFetchVerifyOdoo';
import { postOdooCredentials } from '../utils/fetchOdooCredentials';
import { getAuthToken } from '../utils/useToken';
import { useRouter } from 'next/navigation';

jest.mock('./useFetchVerifyOdoo');
jest.mock('../utils/fetchOdooCredentials');
jest.mock('../utils/useToken');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockUseVerifyOdoo = useVerifyOdoo as jest.Mock;
const mockPostOdooCredentials = postOdooCredentials as jest.Mock;
const mockGetAuthToken = getAuthToken as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;

describe('useOdooAuth Hook', () => {
  const mockPush = jest.fn();
  const mockVerify = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({ push: mockPush });
    mockUseVerifyOdoo.mockReturnValue({
      verify: mockVerify,
      error: null,
      loading: false,
    });
    mockGetAuthToken.mockReturnValue('valid-token');
    mockPostOdooCredentials.mockResolvedValue({ error: null });
  });

  it('should initialize with correct default states', () => {
    const { result } = renderHook(() => useOdooAuth());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.dbUrl).toBe('');
    expect(result.current.dbName).toBe('');
    expect(result.current.email).toBe('');
    expect(result.current.apiKey).toBe('');
    expect(result.current.agreed).toBe(false);
    expect(typeof result.current.verifyAndSave).toBe('function');
    expect(typeof result.current.setDbUrl).toBe('function');
    expect(typeof result.current.setDbName).toBe('function');
    expect(typeof result.current.setEmail).toBe('function');
    expect(typeof result.current.setApiKey).toBe('function');
    expect(typeof result.current.setAgreed).toBe('function');
  });

  it('should set error and return false if no auth token', async () => {
    mockGetAuthToken.mockReturnValue(null);
    const { result } = renderHook(() => useOdooAuth());

    await act(async () => {
      const success = await result.current.verifyAndSave();
      expect(success).toBe(false);
    });

    expect(result.current.error).toBe('Not authenticated. Please login.');
    expect(result.current.loading).toBe(false);
    expect(mockVerify).not.toHaveBeenCalled();
    expect(mockPostOdooCredentials).not.toHaveBeenCalled();
  });

  it('should set error and return false if not agreed', async () => {
    const { result } = renderHook(() => useOdooAuth());

    act(() => {
      result.current.setDbUrl('https://example.odoo.com');
      result.current.setDbName('testdb');
      result.current.setEmail('test@example.com');
      result.current.setApiKey('abc123');
    });

    await act(async () => {
      const success = await result.current.verifyAndSave();
      expect(success).toBe(false);
    });

    expect(result.current.error).toBe('Please agree to share candidate information.');
    expect(result.current.loading).toBe(false);
    expect(mockVerify).not.toHaveBeenCalled();
    expect(mockPostOdooCredentials).not.toHaveBeenCalled();
  });

  it('should set error and return false if any field is missing', async () => {
    const { result } = renderHook(() => useOdooAuth());

    act(() => {
      result.current.setDbUrl('https://example.odoo.com');
      result.current.setDbName('testdb');
      result.current.setEmail('test@example.com');
      result.current.setAgreed(true);
    });

    await act(async () => {
      const success = await result.current.verifyAndSave();
      expect(success).toBe(false);
    });

    expect(result.current.error).toBe('All fields are required.');
    expect(result.current.loading).toBe(false);
    expect(mockVerify).not.toHaveBeenCalled();
    expect(mockPostOdooCredentials).not.toHaveBeenCalled();
  });

  it('should set error and return false if verification fails', async () => {
    mockVerify.mockResolvedValue({ valid: false, error: 'Invalid credentials' });
    const { result } = renderHook(() => useOdooAuth());

    act(() => {
      result.current.setDbUrl('https://example.odoo.com');
      result.current.setDbName('testdb');
      result.current.setEmail('test@example.com');
      result.current.setApiKey('abc123');
      result.current.setAgreed(true);
    });

    await act(async () => {
      const success = await result.current.verifyAndSave();
      expect(success).toBe(false);
    });

    expect(result.current.error).toBe('Invalid credentials');
    expect(result.current.loading).toBe(false);
    expect(mockVerify).toHaveBeenCalledWith(
      {
        db_url: 'https://example.odoo.com',
        db_name: 'testdb',
        email: 'test@example.com',
        api_key: 'abc123',
      },
      'valid-token'
    );
    expect(mockPostOdooCredentials).not.toHaveBeenCalled();
  });

  it('should set error and return false if save fails', async () => {
    mockVerify.mockResolvedValue({ valid: true });
    mockPostOdooCredentials.mockResolvedValue({ error: 'Save failed' });
    const { result } = renderHook(() => useOdooAuth());

    act(() => {
      result.current.setDbUrl('https://example.odoo.com');
      result.current.setDbName('testdb');
      result.current.setEmail('test@example.com');
      result.current.setApiKey('abc123');
      result.current.setAgreed(true);
    });

    await act(async () => {
      const success = await result.current.verifyAndSave();
      expect(success).toBe(false);
    });

    expect(result.current.error).toBe('Save failed');
    expect(result.current.loading).toBe(false);
    expect(mockVerify).toHaveBeenCalled();
    expect(mockPostOdooCredentials).toHaveBeenCalledWith('valid-token', {
      db_url: 'https://example.odoo.com',
      db_name: 'testdb',
      email: 'test@example.com',
      api_key: 'abc123',
    });
  });

  it('should navigate and return true on successful verification and save', async () => {
    mockVerify.mockResolvedValue({ valid: true });
    mockPostOdooCredentials.mockResolvedValue({ error: null });
    const { result } = renderHook(() => useOdooAuth());

    act(() => {
      result.current.setDbUrl('https://example.odoo.com');
      result.current.setDbName('testdb');
      result.current.setEmail('test@example.com');
      result.current.setApiKey('abc123');
      result.current.setAgreed(true);
    });

    await act(async () => {
      const success = await result.current.verifyAndSave();
      expect(success).toBe(true);
    });

    expect(result.current.error).toBe(null);
    expect(result.current.loading).toBe(false);
    expect(mockVerify).toHaveBeenCalled();
    expect(mockPostOdooCredentials).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith('/authentication/odoo/companies');
  });

  it('should combine error state with useVerifyOdoo', () => {
    mockUseVerifyOdoo.mockReturnValue({
      verify: mockVerify,
      error: 'Verify error',
      loading: false,
    });
    const { result } = renderHook(() => useOdooAuth());

    expect(result.current.error).toBe('Verify error');
  });

  it('should handle unexpected errors in verifyAndSave', async () => {
    mockVerify.mockRejectedValue(new Error('Unexpected error'));
    const { result } = renderHook(() => useOdooAuth());

    act(() => {
      result.current.setDbUrl('https://example.odoo.com');
      result.current.setDbName('testdb');
      result.current.setEmail('test@example.com');
      result.current.setApiKey('abc123');
      result.current.setAgreed(true);
    });

    await act(async () => {
      const success = await result.current.verifyAndSave();
      expect(success).toBe(false);
    });

    expect(result.current.error).toBe('Unexpected error');
    expect(result.current.loading).toBe(false);
    expect(mockVerify).toHaveBeenCalled();
    expect(mockPostOdooCredentials).not.toHaveBeenCalled();
  });
});
import { renderHook, act } from '@testing-library/react';
import { useOdooAuth } from './useFetchOdooCredentials';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
describe('useOdooAuth hook', () => {
  const mockedPush = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockedPush,
    });
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => 'mocked-token'),
      },
      writable: true,
    });
  });
  it('initializes token from localStorage', () => {
    const { result } = renderHook(() => useOdooAuth());
    expect(result.current.token).toBe('mocked-token');
  });
  it('sets error and returns false if verifyAndSave called without token', async () => {
    (window.localStorage.getItem as jest.Mock).mockReturnValueOnce(null);
    const { result } = renderHook(() => useOdooAuth());
    let returnValue: boolean | undefined;
    await act(async () => {
      returnValue = await result.current.verifyAndSave();
    });
    expect(result.current.error).toBe('Not authenticated. Please login.');
    expect(returnValue).toBe(false);
  });

  it('sets error and returns false if agreed is false', async () => {
    const { result } = renderHook(() => useOdooAuth());
    expect(result.current.token).toBe('mocked-token');
    expect(result.current.agreed).toBe(false);

    let returnValue: boolean | undefined;
    await act(async () => {
      returnValue = await result.current.verifyAndSave();
    });

    expect(result.current.error).toBe('Please agree to share candidate information.');
    expect(returnValue).toBe(false);
  });

  it('calls router.push and returns true when verifyAndSave succeeds', async () => {
    const { result } = renderHook(() => useOdooAuth());
    act(() => {
      result.current.setAgreed(true);
      result.current.setDbUrl('http://dburl');
      result.current.setDbName('dbname');
      result.current.setEmail('user@example.com');
      result.current.setApiKey('apikey123');
    });
    let returnValue: boolean | undefined;
    await act(async () => {
      returnValue = await result.current.verifyAndSave();
    });
    expect(result.current.error).toBeNull();
    expect(mockedPush).toHaveBeenCalledWith('/authentication/odoo/companies');
    expect(returnValue).toBe(true);
    expect(result.current.loading).toBe(false);
  });
});

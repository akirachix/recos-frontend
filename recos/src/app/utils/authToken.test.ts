
import { setAuthToken } from './useToken';
import Cookies from 'js-cookie';

jest.mock('js-cookie');

describe('Auth token cookie functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sets auth token cookie with correct options', () => {
    const token = 'test-token';
    setAuthToken(token);
    expect(Cookies.set).toHaveBeenCalledWith('auth_token', token, {
      expires: 7,
      secure: false,
      sameSite: 'strict',
      path: '/',
    });
  });


});
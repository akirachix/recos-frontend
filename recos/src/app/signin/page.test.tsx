import React from 'react';
import { render } from '@testing-library/react';
import SignInPage from './page';

jest.mock('../hooks/useLogin', () => ({
  __esModule: true,
  default: () => ({
    error: null,
    loginUser: jest.fn(),
  }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('SignInPage', () => {
  it('renders without crashing', () => {
    render(<SignInPage />);
  });
});
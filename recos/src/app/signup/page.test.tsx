import React from 'react';
import { render } from '@testing-library/react';
import SignUpPage from './page';

jest.mock('../hooks/useRegister', () => ({
  __esModule: true,
  default: () => ({
    error: null,
    isSuccess: false,
    registerUser: jest.fn(),
  }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('SignUpPage', () => {
  it('renders without crashing', () => {
    render(<SignUpPage />);
  });
});
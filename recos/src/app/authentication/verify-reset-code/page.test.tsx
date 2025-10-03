import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import VerifyResetCodePage from '@/app/authentication/verify-reset-code/page';
import { useFetchVerifyResetCode } from '@/app/hooks/useFetchVerifyResetCode';
import { useForgotPasswordRequest } from '@/app/hooks/useFetchForgotPassword';
import { useRouter, useSearchParams } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));
jest.mock('@/app/hooks/useFetchVerifyResetCode');
jest.mock('@/app/hooks/useFetchForgotPassword');

const mockURLSearchParams = jest.fn();
const originalURLSearchParams = global.URLSearchParams;

beforeAll(() => {
  (global.URLSearchParams as jest.MockedClass<typeof URLSearchParams>) = mockURLSearchParams;
});

afterAll(() => {
  global.URLSearchParams = originalURLSearchParams;
});

const mockUseFetchVerifyResetCode = useFetchVerifyResetCode as jest.Mock;
const mockUseForgotPasswordRequest = useForgotPasswordRequest as jest.Mock;

describe('VerifyResetCodePage', () => {

  const mockPush = jest.fn();

  const mockVerifyResetCode = jest.fn();

  const mockRequestCode = jest.fn();

  const mockGet = jest.fn();



  beforeEach(() => {

    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({

      push: mockPush,

    });

    (useSearchParams as jest.Mock).mockReturnValue({

      get: mockGet,

    });

    

    mockUseFetchVerifyResetCode.mockReturnValue({

      loading: false,

      error: null,

      verified: false,

      verifyResetCode: mockVerifyResetCode,

    });

    

    mockUseForgotPasswordRequest.mockReturnValue({

      loading: false,

      error: null,

      success: false,

      requestCode: mockRequestCode,

    });

    

    mockGet.mockReturnValue('test@example.com');

    mockURLSearchParams.mockImplementation(() => ({

      get: mockGet

    }));

  });

  it('renders verification form with email from URL', () => {
    render(<VerifyResetCodePage />);
    
    expect(screen.getByText('Email Verification')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getAllByRole('textbox')).toHaveLength(4);
  });

  it('accepts numeric input and moves focus to next field', () => {
    render(<VerifyResetCodePage />);
    
    const inputs = screen.getAllByRole('textbox');
    
    fireEvent.change(inputs[0], { target: { value: '1' } });
    expect(inputs[0]).toHaveValue('1');
    
    expect(inputs[1]).toHaveFocus();
    
    fireEvent.change(inputs[1], { target: { value: 'a' } });
    expect(inputs[1]).toHaveValue('');
  });

  it('submits verification code when form is submitted', async () => {
    render(<VerifyResetCodePage />);
    
    const inputs = screen.getAllByRole('textbox');
    
    fireEvent.change(inputs[0], { target: { value: '1' } });
    fireEvent.change(inputs[1], { target: { value: '2' } });
    fireEvent.change(inputs[2], { target: { value: '3' } });
    fireEvent.change(inputs[3], { target: { value: '4' } });
    
    fireEvent.click(screen.getByRole('button', { name: 'Verify' }));
    
    await waitFor(() => {
      expect(mockVerifyResetCode).toHaveBeenCalledWith('test@example.com', '1234');
    });
  });

  it('shows error when code is incomplete', () => {
    render(<VerifyResetCodePage />);
    
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: '1' } });
    fireEvent.change(inputs[1], { target: { value: '2' } });
    
    fireEvent.click(screen.getByRole('button', { name: 'Verify' }));
    
    expect(screen.getByText('Please enter the 4-digit code.')).toBeInTheDocument();
  });
});
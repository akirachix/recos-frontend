import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResetPasswordPage from './page';
import { useRouter, useSearchParams } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));
import { useResetPassword } from '@/app/hooks/useFetchResetPassword';

const mockUseResetPassword = useResetPassword as jest.Mock;

jest.mock('@/app/hooks/useFetchResetPassword');
jest.mock('react-icons/ai', () => ({
  AiOutlineEye: jest.fn(() => <div data-testid="eye-icon" />),
  AiOutlineEyeInvisible: jest.fn(() => <div data-testid="eye-invisible-icon" />),
}));

const mockURLSearchParams = jest.fn();
const originalURLSearchParams = global.URLSearchParams;

beforeAll(() => {
  (global.URLSearchParams as jest.MockedClass<typeof URLSearchParams>) = mockURLSearchParams;
});

afterAll(() => {
  global.URLSearchParams = originalURLSearchParams;
});

describe('ResetPasswordPage', () => {
  const mockPush = jest.fn();
  const mockResetPassword = jest.fn();
  const mockGet = jest.fn();

const mockUseResetPassword = useResetPassword as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (useSearchParams as jest.Mock).mockReturnValue({
      get: mockGet,
    });
    
    mockUseResetPassword.mockReturnValue({
      loading: false,
      error: null,
      success: false,
      resetPassword: mockResetPassword,
    });
    
    mockGet.mockReturnValue('test@example.com');
    mockURLSearchParams.mockImplementation(() => ({
      get: mockGet
    }));
  });

  it('renders reset password form with email from URL', () => {
    render(<ResetPasswordPage />);
    
    expect(screen.getByText('Reset Password')).toBeInTheDocument();
    expect(screen.getByLabelText('New Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
  });

  it('updates form state when typing in password fields', () => {
    render(<ResetPasswordPage />);
    
    const passwordInput = screen.getByLabelText('New Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    
    fireEvent.change(passwordInput, { target: { value: 'newpassword' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'newpassword' } });
    
    expect(passwordInput).toHaveValue('newpassword');
    expect(confirmPasswordInput).toHaveValue('newpassword');
  });

  it('shows error when passwords do not match', () => {
    render(<ResetPasswordPage />);
    
    const passwordInput = screen.getByLabelText('New Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    
    fireEvent.change(passwordInput, { target: { value: 'password1' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password2' } });
    
    expect(screen.getByText('Passwords do not match.')).toBeInTheDocument();
  });

  it('toggles password visibility when eye icon is clicked', () => {
    render(<ResetPasswordPage />);
    
    const passwordInput = screen.getByLabelText('New Password');
    const toggleButton = screen.getAllByRole('button')[0];
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('toggles confirm password visibility when eye icon is clicked', () => {
    render(<ResetPasswordPage />);
    
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const toggleButton = screen.getAllByRole('button')[1]; 
    
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    
    fireEvent.click(toggleButton);
    expect(confirmPasswordInput).toHaveAttribute('type', 'text');
    
    fireEvent.click(toggleButton);
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
  });

  it('calls resetPassword with correct parameters on form submission', async () => {
    render(<ResetPasswordPage />);
    
    const passwordInput = screen.getByLabelText('New Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: 'Continue' });
    
    fireEvent.change(passwordInput, { target: { value: 'newpassword' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'newpassword' } });
    
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith(
        'test@example.com',
        'newpassword',
        'newpassword'
      );
    });
  });

  it('shows loading state during password reset', () => {
    (useResetPassword as jest.Mock).mockReturnValue({
      loading: true,
      error: null,
      success: false,
      resetPassword: mockResetPassword,
    });

    render(<ResetPasswordPage />);
    
    expect(screen.getByRole('button', { name: 'Changing...' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Changing...' })).toBeDisabled();
  });

  it('displays error message when password reset fails', () => {
    (useResetPassword as jest.Mock).mockReturnValue({
      loading: false,
      error: 'Failed to reset password',
      success: false,
      resetPassword: mockResetPassword,
    });

    render(<ResetPasswordPage />);
    
    expect(screen.getByText('Failed to reset password')).toBeInTheDocument();
  });

  it('displays success message when password reset is successful', () => {
    (useResetPassword as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      success: true,
      resetPassword: mockResetPassword,
    });

    render(<ResetPasswordPage />);
    
    expect(screen.getByText('Password reset successful')).toBeInTheDocument();
  });

  it('redirects to signin page when password reset is successful', () => {
    (useResetPassword as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      success: true,
      resetPassword: mockResetPassword,
    });

    render(<ResetPasswordPage />);
    
    expect(mockPush).toHaveBeenCalledWith('/signin');
  });
});
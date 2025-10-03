import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Signup from './page';
import useRegister from '../hooks/useRegister';
import { useRouter } from 'next/navigation';

jest.mock('../hooks/useRegister');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('next/link', () => {
  return function MockLink({ href, children, ...props }: { href: string; children: React.ReactNode }) {
    return <a href={href} {...props}>{children}</a>;
  };
});
jest.mock('@heroicons/react/24/outline', () => ({
  EyeIcon: () => <svg data-testid="eye-icon" />,
  EyeSlashIcon: () => <svg data-testid="eye-slash-icon" />,
}));

const mockUseRegister = useRegister as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;

describe('Signup Component', () => {
  const mockPush = jest.fn();
  const mockRegister = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({ push: mockPush });
    mockUseRegister.mockReturnValue({
      register: mockRegister,
      loading: false,
      error: null,
    });
  });

  it('should render with correct initial state', () => {
    render(<Signup />);

    expect(screen.getByLabelText('First Name')).toHaveValue('');
    expect(screen.getByLabelText('Last Name')).toHaveValue('');
    expect(screen.getByLabelText('Email')).toHaveValue('');
    expect(screen.getByLabelText('Password')).toHaveValue('');
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
    expect(screen.getByRole('button', { name: /sign up/i })).not.toBeDisabled();
    const signInLinks = screen.getAllByRole('link', { name: /sign in/i });
    expect(signInLinks.find(link => link.className.includes('text-purple-700'))).toHaveAttribute('href', '/signin');
    expect(screen.getByAltText('Recos Logo')).toBeInTheDocument();
    expect(screen.getByTestId('eye-slash-icon')).toBeInTheDocument();
    expect(screen.queryByText(/successfully registered/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });

  it('should update form fields on input change', async () => {
    render(<Signup />);

    const firstNameInput = screen.getByLabelText('First Name');
    const lastNameInput = screen.getByLabelText('Last Name');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    await userEvent.type(firstNameInput, 'John');
    await userEvent.type(lastNameInput, 'Doe');
    await userEvent.type(emailInput, 'john.doe@example.com');
    await userEvent.type(passwordInput, 'password123');

    expect(firstNameInput).toHaveValue('John');
    expect(lastNameInput).toHaveValue('Doe');
    expect(emailInput).toHaveValue('john.doe@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('should toggle password visibility', async () => {
    render(<Signup />);

    const passwordInput = screen.getByLabelText('Password');
    const toggleButton = screen.getByRole('button', { name: /show password/i });

    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(screen.getByTestId('eye-slash-icon')).toBeInTheDocument();

    await userEvent.click(toggleButton);

    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(screen.getByTestId('eye-icon')).toBeInTheDocument();

    await userEvent.click(toggleButton);

    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(screen.getByTestId('eye-slash-icon')).toBeInTheDocument();
  });

  it('should display success message and navigate on successful registration', async () => {
    mockRegister.mockResolvedValue('success');
    render(<Signup />);

    const firstNameInput = screen.getByLabelText('First Name');
    const lastNameInput = screen.getByLabelText('Last Name');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    await userEvent.type(firstNameInput, 'John');
    await userEvent.type(lastNameInput, 'Doe');
    await userEvent.type(emailInput, 'john.doe@example.com');
    await userEvent.type(passwordInput, 'password123');

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      });
      expect(screen.getByText('Successfully registered!')).toBeInTheDocument();
    });

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/signin'), { timeout: 1500 });
  });

  it('should display user exists message on existing user', async () => {
    mockRegister.mockResolvedValue('exists');
    render(<Signup />);

    const firstNameInput = screen.getByLabelText('First Name');
    const lastNameInput = screen.getByLabelText('Last Name');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    await userEvent.type(firstNameInput, 'John');
    await userEvent.type(lastNameInput, 'Doe');
    await userEvent.type(emailInput, 'john.doe@example.com');
    await userEvent.type(passwordInput, 'password123');

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      });
      expect(screen.getByText('User already exists. Please sign in.')).toBeInTheDocument();
    });

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should display error message from useRegister hook', async () => {
    mockUseRegister.mockReturnValue({
      register: mockRegister,
      loading: false,
      error: 'Registration failed',
    });
    render(<Signup />);

    expect(screen.getByText('Registration failed')).toBeInTheDocument();
  });

  it('should disable submit button when loading', async () => {
    mockUseRegister.mockReturnValue({
      register: mockRegister,
      loading: true,
      error: null,
    });
    render(<Signup />);

    const submitButton = screen.getByRole('button', { name: /signing up/i });
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Signing Up...');
  });

  it('should clear success message on input change', async () => {
    mockRegister.mockResolvedValue('success');
    render(<Signup />);

    const firstNameInput = screen.getByLabelText('First Name');
    const lastNameInput = screen.getByLabelText('Last Name');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    await userEvent.type(firstNameInput, 'John');
    await userEvent.type(lastNameInput, 'Doe');
    await userEvent.type(emailInput, 'john.doe@example.com');
    await userEvent.type(passwordInput, 'password123');

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Successfully registered!')).toBeInTheDocument();
    });

    await userEvent.clear(firstNameInput);
    await userEvent.type(firstNameInput, 'Jane');

    await waitFor(() => {
      expect(screen.queryByText('Successfully registered!')).not.toBeInTheDocument();
    });
  });
});
import { render, screen, fireEvent } from '@testing-library/react';
import OdooPage from './page';
import { useOdooAuth } from '../../hooks/useFetchOdooCredentials';
import { useRouter } from 'next/navigation';
import '@testing-library/jest-dom';

jest.mock('../../hooks/useFetchOdooCredentials');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('OdooPage', () => {
  const mockPush = jest.fn();
  const mockVerifyAndSave = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    (useOdooAuth as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      dbUrl: '',
      setDbUrl: jest.fn(),
      dbName: '',
      setDbName: jest.fn(),
      email: '',
      setEmail: jest.fn(),
      apiKey: '',
      setApiKey: jest.fn(),
      agreed: false,
      setAgreed: jest.fn(),
      verifyAndSave: mockVerifyAndSave,
    });

    jest.clearAllMocks();
  });

  it('renders the component correctly', () => {
    render(<OdooPage />);
    
    expect(screen.getByText('Connect Your Odoo Account')).toBeInTheDocument();
    expect(screen.getByText('Sync With Odoo')).toBeInTheDocument();
    expect(screen.getByLabelText('Odoo Instance URL')).toBeInTheDocument();
    expect(screen.getByLabelText('Database Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('API Key / Password')).toBeInTheDocument();
    expect(screen.getByLabelText(/I agree to share/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Connect to Odoo' })).toBeInTheDocument();
  });

  it('handles form input changes', () => {
    const mockSetDbUrl = jest.fn();
    const mockSetDbName = jest.fn();
    const mockSetEmail = jest.fn();
    const mockSetApiKey = jest.fn();
    const mockSetAgreed = jest.fn();

    (useOdooAuth as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      dbUrl: '',
      setDbUrl: mockSetDbUrl,
      dbName: '',
      setDbName: mockSetDbName,
      email: '',
      setEmail: mockSetEmail,
      apiKey: '',
      setApiKey: mockSetApiKey,
      agreed: false,
      setAgreed: mockSetAgreed,
      verifyAndSave: mockVerifyAndSave,
    });

    render(<OdooPage />);

    const dbUrlInput = screen.getByLabelText('Odoo Instance URL');
    const dbNameInput = screen.getByLabelText('Database Name');
    const emailInput = screen.getByLabelText('Email');
    const apiKeyInput = screen.getByLabelText('API Key / Password');
    const agreementCheckbox = screen.getByLabelText(/I agree to share/);

    fireEvent.change(dbUrlInput, { target: { value: 'https://example.odoo.com' } });
    fireEvent.change(dbNameInput, { target: { value: 'testdb' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(apiKeyInput, { target: { value: '123456' } });
    fireEvent.click(agreementCheckbox);

    expect(mockSetDbUrl).toHaveBeenCalledWith('https://example.odoo.com');
    expect(mockSetDbName).toHaveBeenCalledWith('testdb');
    expect(mockSetEmail).toHaveBeenCalledWith('test@example.com');
    expect(mockSetApiKey).toHaveBeenCalledWith('123456');
    expect(mockSetAgreed).toHaveBeenCalledWith(true);
  });

  it('disables submit button when loading', () => {
    (useOdooAuth as jest.Mock).mockReturnValue({
      loading: true,
      error: null,
      dbUrl: '',
      setDbUrl: jest.fn(),
      dbName: '',
      setDbName: jest.fn(),
      email: '',
      setEmail: jest.fn(),
      apiKey: '',
      setApiKey: jest.fn(),
      agreed: false,
      setAgreed: jest.fn(),
      verifyAndSave: mockVerifyAndSave,
    });

    render(<OdooPage />);

    const submitButton = screen.getByRole('button', { name: 'Connecting...' });
    expect(submitButton).toBeDisabled();
  });

  it('displays error message when error exists', () => {
    (useOdooAuth as jest.Mock).mockReturnValue({
      loading: false,
      error: 'Invalid credentials',
      dbUrl: '',
      setDbUrl: jest.fn(),
      dbName: '',
      setDbName: jest.fn(),
      email: '',
      setEmail: jest.fn(),
      apiKey: '',
      setApiKey: jest.fn(),
      agreed: false,
      setAgreed: jest.fn(),
      verifyAndSave: mockVerifyAndSave,
    });

    render(<OdooPage />);

    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });

  it('navigates to companies page when View Your Companies is clicked', () => {
    render(<OdooPage />);

    const viewCompaniesButton = screen.getByRole('button', { name: 'View Your Companies' });
    fireEvent.click(viewCompaniesButton);

    expect(mockPush).toHaveBeenCalledWith('/authentication/odoo/companies');
  });

  it('opens Odoo website in new tab when Create Odoo Account is clicked', () => {
    const mockWindowOpen = jest.fn();
    jest.spyOn(window, 'open').mockImplementation(mockWindowOpen);

    render(<OdooPage />);

    const createAccountButton = screen.getByRole('button', { name: 'Create Odoo Account' });
    fireEvent.click(createAccountButton);

    expect(mockWindowOpen).toHaveBeenCalledWith('https://www.odoo.com/', '_blank');
  });
});
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import OdooPage from "./page";
import '@testing-library/jest-dom';

jest.mock("../../hooks/useFetchOdooCredentials", () => ({
  useOdooAuth: jest.fn(),
}));

import { useOdooAuth } from "../../hooks/useFetchOdooCredentials";

describe("OdooPage", () => {
  const mockUseOdooAuth = useOdooAuth as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows login prompt when no token", () => {
    mockUseOdooAuth.mockReturnValue({
      token: null,
      loading: false,
      error: null,
      dbUrl: "",
      setDbUrl: jest.fn(),
      dbName: "",
      setDbName: jest.fn(),
      email: "",
      setEmail: jest.fn(),
      apiKey: "",
      setApiKey: jest.fn(),
      agreed: false,
      setAgreed: jest.fn(),
      verifyAndSave: jest.fn(),
    });

    render(<OdooPage />);
    expect(screen.getByText(/please log in to connect your odoo account/i)).toBeInTheDocument();
  });

  it("renders form with values when token is present", () => {
    mockUseOdooAuth.mockReturnValue({
      token: "token",
      loading: false,
      error: null,
      dbUrl: "https://my-instance.odoo.com",
      setDbUrl: jest.fn(),
      dbName: "mydb",
      setDbName: jest.fn(),
      email: "test@odoo.com",
      setEmail: jest.fn(),
      apiKey: "secret-api-key",
      setApiKey: jest.fn(),
      agreed: true,
      setAgreed: jest.fn(),
      verifyAndSave: jest.fn(),
    });

    render(<OdooPage />);

    expect(screen.getByLabelText(/odoo instance url/i)).toHaveValue("https://my-instance.odoo.com");
    expect(screen.getByLabelText(/database name/i)).toHaveValue("mydb");
    expect(screen.getByLabelText(/email/i)).toHaveValue("test@odoo.com");
    expect(screen.getByLabelText(/api key \/ password/i)).toHaveValue("secret-api-key");
    expect(screen.getByLabelText(/i agree to share my candidate information/i)).toBeChecked();
  });

  it("displays error message", () => {
    mockUseOdooAuth.mockReturnValue({
      token: "token",
      loading: false,
      error: "Invalid credentials",
      dbUrl: "",
      setDbUrl: jest.fn(),
      dbName: "",
      setDbName: jest.fn(),
      email: "",
      setEmail: jest.fn(),
      apiKey: "",
      setApiKey: jest.fn(),
      agreed: false,
      setAgreed: jest.fn(),
      verifyAndSave: jest.fn(),
    });

    render(<OdooPage />);
    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
  });

  it("disables connect button while loading and triggers verifyAndSave on form submit", () => {
    const mockVerify = jest.fn();

    mockUseOdooAuth.mockReturnValue({
      token: "token",
      loading: true,
      error: null,
      dbUrl: "",
      setDbUrl: jest.fn(),
      dbName: "",
      setDbName: jest.fn(),
      email: "",
      setEmail: jest.fn(),
      apiKey: "",
      setApiKey: jest.fn(),
      agreed: true,
      setAgreed: jest.fn(),
      verifyAndSave: mockVerify,
    });

    render(<OdooPage />);
    const button = screen.getByRole("button", { name: /connecting/i });
    expect(button).toBeDisabled();
    mockUseOdooAuth.mockReturnValueOnce({
      token: "token",
      loading: false,
      error: null,
      dbUrl: "",
      setDbUrl: jest.fn(),
      dbName: "",
      setDbName: jest.fn(),
      email: "",
      setEmail: jest.fn(),
      apiKey: "",
      setApiKey: jest.fn(),
      agreed: true,
      setAgreed: jest.fn(),
      verifyAndSave: mockVerify,
    });

    render(<OdooPage />);
    const submitButton = screen.getByRole("button", { name: /connect to odoo/i });
    fireEvent.click(submitButton);

    expect(mockVerify).toHaveBeenCalledTimes(1);
  });
});

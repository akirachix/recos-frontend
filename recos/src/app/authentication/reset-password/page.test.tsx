import '@testing-library/jest-dom';
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ResetPasswordPage from "@/app/authentication/reset-password/page";
import { useResetPassword } from "@/app/hooks/useFetchResetPassword";
import { useRouter } from "next/navigation";

jest.mock("@/app/hooks/useFetchResetPassword");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("ResetPasswordPage", () => {
  const pushMock = jest.fn();
  const resetPasswordMock = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();

    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });

    (useResetPassword as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      success: false,
      resetPassword: resetPasswordMock,
    });

    pushMock.mockClear();
    resetPasswordMock.mockClear();
  });

  it("renders form inputs and buttons", () => {
    render(<ResetPasswordPage />);
  });

  it("toggles password visibility fields", () => {
    render(<ResetPasswordPage />);
    const passwordInput = screen.getByLabelText(/new password/i, { selector: 'input' });
    const togglePasswordButton = screen.getByRole("button", { name: /show password/i });
    fireEvent.click(togglePasswordButton);
    expect(passwordInput).toHaveAttribute("type", "text");
    fireEvent.click(togglePasswordButton);
    expect(passwordInput).toHaveAttribute("type", "password");

    const confirmPasswordInput = screen.getByLabelText(/confirm password/i, { selector: 'input' });
    const toggleConfirmPasswordButton = screen.getByRole("button", { name: /show confirm password/i });
    fireEvent.click(toggleConfirmPasswordButton);
    expect(confirmPasswordInput).toHaveAttribute("type", "text");
    fireEvent.click(toggleConfirmPasswordButton);
    expect(confirmPasswordInput).toHaveAttribute("type", "password");
  });

  it("shows error when passwords do not match on change and submit", async () => {
    render(<ResetPasswordPage />);
    const newPasswordInput = screen.getByLabelText(/new password/i, { selector: 'input' });
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i, { selector: 'input' });
    const button = screen.getByRole("button", { name: /continue/i });

    fireEvent.change(newPasswordInput, { target: { value: "password1" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "password2" } });

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();

    fireEvent.click(button);
    expect(resetPasswordMock).not.toHaveBeenCalled();
  });

  it("calls resetPassword on valid form submit", async () => {
    (useResetPassword as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      success: false,
      resetPassword: resetPasswordMock,
    });
    render(<ResetPasswordPage />);

    const newPasswordInput = screen.getByLabelText(/new password/i, { selector: 'input' });
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i, { selector: 'input' });
    const button = screen.getByRole("button", { name: /continue/i });

    fireEvent.change(newPasswordInput, { target: { value: "mypassword123" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "mypassword123" } });

    fireEvent.click(button);
    await waitFor(() => {
      expect(resetPasswordMock).toHaveBeenCalledWith(expect.any(String), "mypassword123", "mypassword123");
    });
  });

  it("displays error from hook if any", () => {
    (useResetPassword as jest.Mock).mockReturnValue({
      loading: false,
      error: "Reset failed",
      success: false,
      resetPassword: resetPasswordMock,
    });
    render(<ResetPasswordPage />);
    expect(screen.getByText(/reset failed/i)).toBeInTheDocument();
  });

  it("disables button when loading", () => {
    (useResetPassword as jest.Mock).mockReturnValue({
      loading: true,
      error: null,
      success: false,
      resetPassword: resetPasswordMock,
    });
    render(<ResetPasswordPage />);
    expect(screen.getByRole("button", { name: /changing/i })).toBeDisabled();
  });

  it("redirects on success", async () => {
    (useResetPassword as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      success: true,
      resetPassword: resetPasswordMock,
    });
    render(<ResetPasswordPage />);

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/signin");
    });
  });
});
